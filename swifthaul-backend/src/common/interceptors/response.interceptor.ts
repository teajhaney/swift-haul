import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * ResponseInterceptor wraps every successful handler response in the
 * standard SwiftHaul envelope:
 *
 *   { "data": <value> }
 *
 * If the handler already returns an object with a `data` key (e.g. paginated
 * list responses that also carry a `meta` block), the value is passed through
 * as-is so the outer shape is not double-wrapped:
 *
 *   { "data": [...], "meta": { "total": 100, "page": 1, "limit": 20 } }
 *
 * Error responses are NOT touched here — they are formatted by GlobalExceptionFilter.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((value: unknown) => {
        // Already shaped — controller returned { data: ..., meta?: ... }
        if (value !== null && typeof value === 'object' && 'data' in (value as object)) {
          return value;
        }
        return { data: value };
      }),
    );
  }
}
