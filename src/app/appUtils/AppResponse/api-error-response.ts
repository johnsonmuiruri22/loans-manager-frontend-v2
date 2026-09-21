export interface ApiErrorResponse{
  message: string;
  error: string;
  statusCode: number;
  path: string;
  timestamp: Date;
}
