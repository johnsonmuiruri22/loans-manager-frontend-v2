export interface AuthenticatedUser {
  id: number;
  username: string;
  fullName: string;
  role: string;
  authenticated: boolean;
}
