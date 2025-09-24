import { ApiErrorPayload, ErrorKind } from './types';

export class ApiError extends Error {
  readonly code: string;
  readonly kind: ErrorKind;
  readonly status?: number;
  readonly details?: Record<string, unknown>;
  readonly fieldErrors?: any;

  constructor(init: {
    code: string;
    kind: ErrorKind;
    message: string;
    status?: number;
    details?: Record<string, unknown>;
    fieldErrors?: any;
  }) {
    super(init.message);
    this.name = 'ApiError';
    this.code = init.code;
    this.kind = init.kind;
    this.status = init.status;
    this.details = init.details;
    this.fieldErrors = init.fieldErrors;
  }
}

export function parseApiError(body: unknown, status?: number): ApiError | null {
  const error = (body as ApiErrorPayload | undefined)?.error;
  if (
    !error ||
    typeof error.code !== 'string' ||
    typeof error.kind !== 'string' ||
    typeof error.message !== 'string'
  ) {
    return null;
  }
  return new ApiError({
    code: error.code,
    kind: error.kind,
    message: error.message,
    status,
    details: error.details && typeof error.details === 'object' ? error.details : undefined,
    fieldErrors: error.field_errors,
  });
}
