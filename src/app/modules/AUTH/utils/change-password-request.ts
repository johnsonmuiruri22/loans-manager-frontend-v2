export interface ChangePasswordRequest{
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}
