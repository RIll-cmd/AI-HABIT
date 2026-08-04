export interface BattleResult {
  isVictory: boolean;
  logs: string[];
  totalTurns: number;
  remainingHp: number;
  maxCharacterHp: number;
  maxEnemyHp: number;
}
