export interface User {
  id?: any;
  email: string;
  password?: string;
  name: string;
  contact: string;
  role: 'user' | 'admin';
  createdAt?: string;
  isActive?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends User {
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}