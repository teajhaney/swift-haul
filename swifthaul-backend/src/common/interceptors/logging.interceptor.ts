import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

/**
 * LoggingInterceptor wraps every incoming request and logs:
 *  - On arrival:   method, URL, IP address
 *  - On response:  method, URL, status code, and how long it took (ms)
 *
 * Why an interceptor rather than middleware?
 * Middleware runs before NestJS processes the request, so it has no
 * knowledge of which controller or handler will handle it. An interceptor
 * sits inside the NestJS lifecycle, which means it runs AFTER guards and
 * CAN observe the final response status code — useful for logging 200 vs 201.
 *
 * Why use RxJS tap() instead of async/await?
 * NestJS handlers return Observables internally. tap() lets us hook into
 * the response stream non-destructively: we observe the result without
 * modifying it, then pass it through untouched.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, ip } = request;
    const startTime = Date.now();

    this.logger.log(`→ ${method} ${url}  [IP: ${ip ?? 'unknown'}]`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const { statusCode } = response;
        this.logger.log(`← ${method} ${url}  ${statusCode}  (${duration}ms)`);
      }),
    );
  }
}
