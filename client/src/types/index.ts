export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  theme?: string;
  title?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
