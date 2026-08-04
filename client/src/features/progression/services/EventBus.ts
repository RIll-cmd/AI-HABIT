export type ProgressionEventType =
  | 'MISSION_COMPLETED'
  | 'LEVEL_UP'
  | 'RANK_ASCENDED'
  | 'ACHIEVEMENT_UNLOCKED';

export interface MissionCompletedPayload {
  baseReward: {
    exp: number;
    gold?: number;
    stat?: number;
    statName?: string;
    statAmount?: number;
  };
  completionType?: 'MINI' | 'NORMAL' | 'ELITE' | string;
  habit?: any;
  [key: string]: any;
}

export interface LevelUpPayload {
  newLevel: number;
  [key: string]: any;
}

export interface RankAscendedPayload {
  newRank: string;
  [key: string]: any;
}

export interface AchievementUnlockedPayload {
  achievementId: string;
  achievementName?: string;
  [key: string]: any;
}

export interface EventPayloadMap {
  MISSION_COMPLETED: MissionCompletedPayload;
  LEVEL_UP: LevelUpPayload;
  RANK_ASCENDED: RankAscendedPayload;
  ACHIEVEMENT_UNLOCKED: AchievementUnlockedPayload;
}

export type EventCallback<E extends ProgressionEventType> = (
  payload: EventPayloadMap[E]
) => void;

export class EventBus {
  private static instance: EventBus;
  private listeners: {
    [E in ProgressionEventType]?: Array<EventCallback<any>>;
  } = {};

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<E extends ProgressionEventType>(
    event: E,
    callback: EventCallback<E>
  ): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);

    return () => this.unsubscribe(event, callback);
  }

  public unsubscribe<E extends ProgressionEventType>(
    event: E,
    callback: EventCallback<E>
  ): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter((cb) => cb !== callback);
  }

  public publish<E extends ProgressionEventType>(
    event: E,
    payload: EventPayloadMap[E]
  ): void {
    const callbacks = this.listeners[event];
    if (callbacks && callbacks.length > 0) {
      [...callbacks].forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[EventBus] Error in listener for event ${event}:`, err);
        }
      });
    }
  }
}

export const eventBus = EventBus.getInstance();
