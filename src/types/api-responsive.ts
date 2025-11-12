export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  error: string | null;
  errorCode: number | null;
}
