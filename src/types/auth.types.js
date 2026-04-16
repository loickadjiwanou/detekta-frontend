export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  total_audits: number;
  is_active: boolean;
  is_verified: boolean;
  preferred_language: 'en' | 'fr';
  use_own_api_key: boolean;
  has_api_key: boolean;
  created_at: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
