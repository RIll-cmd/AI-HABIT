import { eventBus, MissionCompletedPayload } from "./EventBus";
import { calculateFinalReward, BaseReward } from "../../habits/utils";
import { CompletionType } from "../../habits/types";
import { useCharacterStore } from "../../../store/useCharacterStore";
import { useDailyBonusStore } from "../../../store/useDailyBonusStore";

export class ProgressionEngine {
  private static instance: ProgressionEngine;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ProgressionEngine {
    if (!ProgressionEngine.instance) {
      ProgressionEngine.instance = new ProgressionEngine();
    }
    return ProgressionEngine.instance;
  }

  public init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    eventBus.subscribe("MISSION_COMPLETED", this.handleMissionCompleted.bind(this));
  }

  private handleMissionCompleted(payload: MissionCompletedPayload): void {
    const { baseReward, completionType = "NORMAL", habit } = payload;
    if (!baseReward) return;

    const base: BaseReward = {
      exp: baseReward.exp || 0,
      gold: baseReward.gold || 0,
      stat: (baseReward as any).stat || baseReward.statAmount || 0,
    };

    const finalReward = calculateFinalReward(base, completionType as CompletionType);
    const habitName = habit?.name || "Habit";
    const primaryStat = habit?.primaryStat || "strength";

    // Check for 2x Daily Double Boost Charge
    const isDoubleBoosted = useDailyBonusStore.getState().consumeHabitCharge();
    const multiplier = isDoubleBoosted ? 2 : 1;

    if (finalReward.stat > 0) {
      useCharacterStore.getState().addStat(primaryStat, finalReward.stat * multiplier);
    }

    if (finalReward.gold > 0) {
      useCharacterStore
        .getState()
        .gainGold(finalReward.gold * multiplier, isDoubleBoosted ? `⚡ [2X BOOST] ${habitName}` : `Completed Mission: ${habitName}`);
    }

    if (finalReward.exp > 0) {
      useCharacterStore
        .getState()
        .gainExp(finalReward.exp * multiplier, isDoubleBoosted ? `⚡ [2X BOOST] ${habitName}` : `Completed Mission: ${habitName}`);
    }
  }
}

export const progressionEngine = ProgressionEngine.getInstance();
progressionEngine.init();
