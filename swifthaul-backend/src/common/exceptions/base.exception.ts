import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * BaseException is the foundation for every custom exception in SwiftHaul.
 *
 * Why extend HttpException instead of Error?
 * NestJS's built-in exception filter already knows how to handle HttpException —
 * it reads the status code and message automatically. By extending it, our custom
 * exceptions integrate seamlessly with NestJS without any extra plumbing.
 *
 * Why add an `errorCode`?
 * HTTP status codes (404, 400) tell you *category* of error, but not *which* error.
 * An `errorCode` like "ORDER_NOT_FOUND" or "INVALID_TRANSITION" lets the frontend
 * display the exact right message or take specific action, without parsing strings.
 */
export class BaseException extends HttpException {
  constructor(
    public readonly errorCode: string,
    message: string,
    status: HttpStatus,
  ) {
    super({ errorCode, message }, status);
  }
}
