export interface User {
  id: number;
  name: string;
  country: string;
  number: string;
  email: string;
  password: string;
  wantsEmails?: boolean | null;
  jobPostingCredits?: number | null;
  createdAt?: string;
  updatedAt?: string;
  currency?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  country: string;
  number: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token?: string;
  message: string;
}
