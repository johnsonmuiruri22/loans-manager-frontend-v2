export interface LoginResponse {
  message: string;
  role: string;
  fullName: string;
  userId: number;
  username: string;
  mustChangePassword: boolean;
  deviceName: string;
  ipAddress: string;
}
