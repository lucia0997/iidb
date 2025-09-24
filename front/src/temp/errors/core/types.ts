export type ErrorKind =
  | 'auth'
  | 'permission'
  | 'not_found'
  | 'validation'
  | 'conflict'
  | 'client'
  | 'server'
  | 'rate_limit'
  | 'unknown';

export type ApiErrorPayload = {
  error: {
    code: string;
    kind: ErrorKind;
    message: string;
    details?: Record<string, unknown>;
    field_errors?: any;
  };
};
