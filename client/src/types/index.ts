export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type {
  Character,
  CharacterStats,
  ProgressHistory,
} from "@/features/character/types/character";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
