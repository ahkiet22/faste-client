export type ApiStatus = 'success' | 'error';

export interface ApiResponse<T = any> {
  status: ApiStatus;
  message: string;
  data: T | null;
  error: string | null;
  errorCode: number | null;
}
