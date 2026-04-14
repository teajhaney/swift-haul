import axios from 'axios';

export interface BackendErrorPayload {
  error: {
    code: string;
    message: string;
  };
}

export function isBackendErrorPayload(
  value: unknown
): value is BackendErrorPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;
  if (typeof body.error !== 'object' || body.error === null) {
    return false;
  }

  const errorBody = body.error as Record<string, unknown>;
  return (
    typeof errorBody.code === 'string' && typeof errorBody.message === 'string'
  );
}

export function getBackendErrorMessage(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (isBackendErrorPayload(responseData)) {
      return responseData.error.message;
    }

    if (
      typeof responseData === 'object' &&
      responseData !== null &&
      'message' in responseData &&
      typeof (responseData as Record<string, unknown>).message === 'string'
    ) {
      return (responseData as { message: string }).message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return undefined;
}
