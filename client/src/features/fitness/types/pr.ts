import { Exercise } from './exercise';

export interface PersonalRecord {
  id: string;
  characterId: string;
  exerciseId: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  date: string | Date;
  exercise?: Exercise | null;
}
