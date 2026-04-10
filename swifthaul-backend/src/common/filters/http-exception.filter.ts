import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * GlobalExceptionFilter catches every exception that bubbles up from any
 * controller or service in the entire application.
 *
 * Why do we need this if NestJS already handles exceptions?
 * NestJS's default exception handling works, but it produces inconsistent
 * response shapes depending on the error type. For example, a validation
 * error from class-validator looks different from a 404 or a raw JS Error.
 * This filter normalises ALL errors into the same shape:
 *   { error: { code: string, message: string } }
 * The frontend can always rely on that structure — no guessing.
 *
 * @Catch() with no arguments means: catch everything, not just HttpException.
 * That includes unexpected JS runtime errors (ReferenceError, TypeError, etc.)
 * which we treat as 500s and log in full detail for debugging.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let errorCode: string;
    let message: string;

    if (exception instanceof HttpException) {
      // HttpException covers our BaseException / domain exceptions and all
      // built-in NestJS exceptions (NotFoundException, UnauthorizedException, etc.)
      status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'object' && body !== null && 'errorCode' in body) {
        // Our custom domain exception — already has errorCode + message
        const typed = body as { errorCode: string; message: string };
        errorCode = typed.errorCode;
        message = typed.message;
      } else if (
        typeof body === 'object' &&
        body !== null &&
        'message' in body
      ) {
        // Built-in NestJS exception (e.g. ValidationPipe errors, NotFoundException)
        const typed = body as { message: string | string[] };
        errorCode = this.statusToCode(status);
        message = Array.isArray(typed.message)
          ? typed.message.join('; ')
          : typed.message;
      } else {
        errorCode = this.statusToCode(status);
        message = typeof body === 'string' ? body : 'An error occurred.';
      }

      // Log 5xx errors as errors; 4xx as warnings (they're expected client mistakes)
      if (status >= 500) {
        this.logger.error(
          `[${request.method}] ${request.url} → ${status} ${errorCode}: ${message}`,
          exception instanceof Error ? exception.stack : undefined,
        );
      } else {
        this.logger.warn(
          `[${request.method}] ${request.url} → ${status} ${errorCode}: ${message}`,
        );
      }
    } else {
      // Unexpected runtime error — we don't know what this is, so treat as 500
      // and log the full stack so we can debug it
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = 'INTERNAL_SERVER_ERROR';
      message = 'An unexpected error occurred. Please try again later.';

      this.logger.error(
        `[${request.method}] ${request.url} → 500 INTERNAL_SERVER_ERROR`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      error: {
        code: errorCode,
        message,
      },
    });
  }

  /**
   * Maps an HTTP status number to a readable default code string.
   * Used as a fallback for built-in NestJS exceptions that don't have
   * our custom errorCode field.
   */
  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
    };
    return map[status] ?? 'HTTP_ERROR';
  }
}
