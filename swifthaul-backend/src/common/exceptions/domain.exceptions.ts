import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

// ─── 401 Unauthorized ─────────────────────────────────────────────────────────

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(
      'INVALID_CREDENTIALS',
      'Invalid email or password.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class TokenExpiredException extends BaseException {
  constructor() {
    super(
      'TOKEN_EXPIRED',
      'Your session has expired. Please log in again.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidRefreshTokenException extends BaseException {
  constructor() {
    super(
      'INVALID_REFRESH_TOKEN',
      'Refresh token is invalid or has been revoked.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidInviteTokenException extends BaseException {
  constructor() {
    super(
      'INVALID_INVITE_TOKEN',
      'This invite link is invalid or has already been used.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidOtpException extends BaseException {
  constructor() {
    super(
      'INVALID_OTP',
      'The code you entered is incorrect or has expired.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

// ─── 403 Forbidden ────────────────────────────────────────────────────────────

export class ForbiddenResourceException extends BaseException {
  constructor() {
    super(
      'FORBIDDEN',
      'You do not have permission to perform this action.',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class AccountInactiveException extends BaseException {
  constructor() {
    super(
      'ACCOUNT_INACTIVE',
      'Your account has been deactivated. Contact an admin.',
      HttpStatus.FORBIDDEN,
    );
  }
}

// ─── 404 Not Found ────────────────────────────────────────────────────────────

export class UserNotFoundException extends BaseException {
  constructor() {
    super('USER_NOT_FOUND', 'User not found.', HttpStatus.NOT_FOUND);
  }
}

export class OrderNotFoundException extends BaseException {
  constructor() {
    super('ORDER_NOT_FOUND', 'Order not found.', HttpStatus.NOT_FOUND);
  }
}

export class DriverNotFoundException extends BaseException {
  constructor() {
    super('DRIVER_NOT_FOUND', 'Driver not found.', HttpStatus.NOT_FOUND);
  }
}

export class NotificationNotFoundException extends BaseException {
  constructor() {
    super(
      'NOTIFICATION_NOT_FOUND',
      'Notification not found.',
      HttpStatus.NOT_FOUND,
    );
  }
}

// ─── 409 Conflict ─────────────────────────────────────────────────────────────

export class EmailAlreadyExistsException extends BaseException {
  constructor() {
    super(
      'EMAIL_ALREADY_EXISTS',
      'An account with this email already exists.',
      HttpStatus.CONFLICT,
    );
  }
}

export class ReferenceIdConflictException extends BaseException {
  constructor() {
    super(
      'REFERENCE_ID_CONFLICT',
      'Could not generate a unique order reference. Please try again.',
      HttpStatus.CONFLICT,
    );
  }
}

// ─── 422 Unprocessable Entity ─────────────────────────────────────────────────

export class InvalidTransitionException extends BaseException {
  constructor(from: string, to: string) {
    super(
      'INVALID_TRANSITION',
      `Cannot transition order from ${from} to ${to}.`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class TerminalStatusException extends BaseException {
  constructor(status: string) {
    super(
      'TERMINAL_STATUS',
      `Order is in a terminal state (${status}) and cannot be modified.`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class DriverUnavailableException extends BaseException {
  constructor() {
    super(
      'DRIVER_UNAVAILABLE',
      'This driver is not available for assignment.',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class DriverAtCapacityException extends BaseException {
  constructor() {
    super(
      'DRIVER_AT_CAPACITY',
      'This driver has reached their maximum concurrent orders.',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class CannotDeleteActiveOrderException extends BaseException {
  constructor() {
    super(
      'CANNOT_DELETE_ACTIVE_ORDER',
      'Only cancelled or delivered orders can be deleted.',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class OrderNotEditableException extends BaseException {
  constructor() {
    super(
      'ORDER_NOT_EDITABLE',
      'Order details can only be edited while the order is pending, assigned, or rescheduled.',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class PodAlreadyExistsException extends BaseException {
  constructor() {
    super(
      'POD_ALREADY_EXISTS',
      'Proof of delivery has already been submitted for this order.',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

// ─── 400 Bad Request ──────────────────────────────────────────────────────────

export class PasswordMismatchException extends BaseException {
  constructor() {
    super(
      'PASSWORD_MISMATCH',
      'Current password is incorrect.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

// ─── 502 Bad Gateway (external services) ──────────────────────────────────────

export class GeocodingFailedException extends BaseException {
  constructor() {
    super(
      'GEOCODING_FAILED',
      'Could not geocode the provided address. Please try again.',
      HttpStatus.BAD_GATEWAY,
    );
  }
}

export class RoutingFailedException extends BaseException {
  constructor() {
    super(
      'ROUTING_FAILED',
      'Could not calculate route. Please try again.',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
