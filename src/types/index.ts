export interface ApiError {
  message: string;
  status?: number;
}

export interface LoginCredentials {
  identifier: string;
  password:  string;
  role: 'admin' | 'attendee';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: 'admin' | 'attendee';
    email: string;
  };
}
