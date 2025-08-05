export interface User {
  userId: string;
  // email: string;
}
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
