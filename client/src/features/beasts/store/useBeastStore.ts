import { create } from "zustand";
import { API_BASE_URL } from "@/constants";
import { toast } from "sonner";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import {
  Egg,
  Beast,
  BestiarySpeciesSummary,
  BeastCollectionData,
  EggShopItem,
  StepSyncResult
} from "../types/beast";

export const EGG_SHOP_ITEMS: EggShopItem[] = [
  {
    id: "WOODLAND",
    name: "Woodland Earth Egg",
    eggType: "NATURE",
    sprite: "/eggs/egg_1.png",
    rarity: "COMMON",
    targetSteps: 3000,
    targetEnergy: 3000,
    goldPrice: 1250,
    gemPrice: 0,
    description: "A vibrant forest egg that pulses with natural vitality. Requires 3,000 real-world steps."
  },
  {
    id: "FROST",
    name: "Glacial Cryo Egg",
    eggType: "FROST",
    sprite: "/eggs/egg_4.png",
    rarity: "RARE",
    targetSteps: 5000,
    targetEnergy: 5000,
    goldPrice: 3500,
    gemPrice: 35,
    description: "An icy crystalline egg enveloped in chilling focus. Requires 5,000 real-world steps."
  },
  {
    id: "SOLAR",
    name: "Solar Flare Egg",
    eggType: "FIRE",
    sprite: "/eggs/egg_6.png",
    rarity: "EPIC",
    targetSteps: 8000,
    targetEnergy: 8000,
    goldPrice: 8500,
    gemPrice: 85,
    description: "A fiery ember egg radiating intense thermic power. Requires 8,000 real-world steps."
  },
  {
    id: "CYBER",
    name: "Neon Cyber Egg",
    eggType: "CYBER",
    sprite: "/eggs/egg_15.png",
    rarity: "LEGENDARY",
    targetSteps: 12000,
    targetEnergy: 12000,
    goldPrice: 22000,
    gemPrice: 220,
    description: "An overclocked digital matrix egg. Requires 12,000 real-world steps."
  },
  {
    id: "COSMIC",
    name: "Cosmic Void Egg",
    eggType: "VOID",
    sprite: "/eggs/egg_13.png",
    rarity: "HOLOGRAPHIC",
    targetSteps: 20000,
    targetEnergy: 20000,
    goldPrice: 50000,
    gemPrice: 500,
    description: "A legendary prismatic egg holding darkstar essence. Requires 20,000 real-world steps."
  }
];

interface CelebrationPayload {
  beast: Beast;
  egg: Egg;
  isFirstBeast: boolean;
}

interface BeastState {
  collection: BeastCollectionData | null;
  isLoading: boolean;
  isSyncingSteps: boolean;
  isFeeding: boolean;
  isHatching: boolean;
  isEquipping: boolean;
  isBuying: boolean;
  isUpgrading: boolean;
  celebrationModal: {
    isOpen: boolean;
    data: CelebrationPayload | null;
  };

  fetchCollection: (characterId: string) => Promise<void>;
  syncSteps: (characterId: string, stepCount: number, source?: string) => Promise<boolean>;
  setDailySteps: (characterId: string, steps: number, goal?: number) => Promise<boolean>;
  setStepGoal: (characterId: string, goal: number) => Promise<boolean>;
  upgradeBeast: (characterId: string, beastId: string) => Promise<boolean>;
  feedEnergy: (characterId: string, amount: number, source?: string) => Promise<boolean>;
  hatchEgg: (characterId: string, eggId: string) => Promise<boolean>;
  equipBeast: (characterId: string, beastId: string | null) => Promise<boolean>;
  buyEgg: (characterId: string, eggType: string, currencyType?: "GOLD" | "GEMS") => Promise<boolean>;
  incubateEgg: (characterId: string, eggId: string) => Promise<boolean>;
  openCelebrationModal: (data: CelebrationPayload) => void;
  closeCelebrationModal: () => void;
}

export const useBeastStore = create<BeastState>((set, get) => ({
  collection: null,
  isLoading: false,
  isSyncingSteps: false,
  isFeeding: false,
  isHatching: false,
  isEquipping: false,
  isBuying: false,
  isUpgrading: false,
  celebrationModal: {
    isOpen: false,
    data: null
  },

  fetchCollection: async (characterId: string) => {
    if (!characterId) return;
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/api/beasts/collection/${characterId}`);
      if (res.ok) {
        const data = await res.json();
        set({ collection: data });
      }
    } catch (err) {
      console.error("Failed to load beast collection:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  syncSteps: async (characterId: string, stepCount: number, source = "PEDOMETER_SYNC") => {
    if (!characterId || stepCount <= 0) return false;
    set({ isSyncingSteps: true });
    try {
      const res = await fetch(`${API_BASE_URL}/api/beasts/steps/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, stepCount, source }),
      });
      if (res.ok) {
        const result: StepSyncResult = await res.json();
        playBuffSFX("levelup");
        toast.success(`+${stepCount.toLocaleString()} Steps Logged!`, {
          description: result.isReadyToHatch
            ? "⚡ EGG READY TO HATCH! The shell is bursting with radiant light!"
            : `Incubation Progress: ${result.progressPercent}% (${result.currentSteps.toLocaleString()} / ${result.targetSteps.toLocaleString()} steps)`,
        });
        await get().fetchCollection(characterId);
        return true;
      } else {
        const err = await res.json().catch(() => ({ detail: "Failed to sync steps" }));
        toast.error(err.detail || "Failed to sync steps");
        return false;
      }
    } catch (err) {
      toast.error("Network error while syncing pedometer steps");
      return false;
    } finally {
      set({ isSyncingSteps: false });
    }
  },

  setDailySteps: async (characterId: string, steps: number, goal?: number) => {
    if (!characterId) return false;
    playUIMenuSFX("confirm");
    try {
      const res = await fetch(`${API_BASE_URL}/api/beasts/steps/set-daily`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, steps, goal }),
      });
      if (res.ok) {
        playBuffSFX("buff");
        toast.success(`Daily steps updated to ${steps.toLocaleString()} steps!`);
        await get().fetchCollection(characterId);
        return true;
      } else {
        toast.error("Failed to update daily steps");
        return false;
      }
    } catch (err) {
      toast.error("Network error updating daily steps");
      return false;
    }
  },

  setStepGoal: async (characterId: string, goal: number) => {
    if (!characterId || goal <= 0) return false;
    playUIMenuSFX("confirm");
    try {
      const res = await fetch(`${API_BASE_URL}/api/beasts/steps/goal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, goal }),
      });
      if (res.ok) {
        toast.success(`Daily step goal set to ${goal.toLocaleString()} steps!`);
        await get().fetchCollection(characterId);
        return true;
      }
      return false;
    } catch (err) {
      toast.error("Network error setting step goal");
      return false;
    }
  },

  upgradeBeast: async (characterId: string, beastId: string) => {
    if (!characterId || !beastId) return false;
    set({ isUpgrading: true });
    playUIMenuSFX("confirm");
    try {
      const res = await fetch(`${API_BASE_URL}/api/beasts/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, beastId }),
      });
      if (res.ok) {
        const result = await res.json();
        playBuffSFX("levelup");
        toast.success(result.message || "Companion Ascended!");
        await get().fetchCollection(characterId);
        return true;
      } else {
        const err = await res.json().catch(() => ({ detail: "Failed to upgrade beast" }));
        toast.error(err.detail || "Failed to upgrade beast");
        return false;
      }
    } catch (err) {
      toast.error("Network error while upgrading beast");
      return false;
    } finally {
      set({ isUpgrading: false });
    }
  },

  feedEnergy: async (characterId: string, amount: number, source = "MANUAL_STEPS") => {
    return get().syncSteps(characterId, amount, source);
  },

  hatchEgg: async (characterId: string, eggId: string) => {
    if (!characterId || !eggId) return false;
    set({ isHatching: true });
    playBuffSFX("levelup");
    try {
      const res = await fetch(`${API_BASE_URL}/api/beasts/eggs/hatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, eggId }),
      });
      if (res.ok) {
        const result = await res.json();
        set({
          celebrationModal: {
            isOpen: true,
            data: {
              beast: result.beast,
              egg: result.egg,
              isFirstBeast: result.isFirstBeast
            }
          }
        });
        await get().fetchCollection(characterId);
        return true;
      } else {
        const err = await res.json().catch(() => ({ detail: "Failed to hatch egg" }));
        toast.error(err.detail || "Failed to hatch egg");
        return false;
      }
    } catch (err) {
      toast.error("Network error while hatching egg");
      return false;
    } finally {
      set({ isHatching: false });
    }
  },

  equipBeast: async (characterId: string, beastId: string | null) => {
    if (!characterId) return false;
    set({ isEquipping: true });
    playUIMenuSFX("confirm");
    try {
      const res = await fetch(`${API_BASE_URL}/api/beasts/equip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, beastId }),
      });
      if (res.ok) {
        const result = await res.json();
        playBuffSFX("speed");
        toast.success(result.message || "Companion updated!");
        await get().fetchCollection(characterId);
        return true;
      } else {
        toast.error("Failed to update companion");
        return false;
      }
    } catch (err) {
      toast.error("Network error while equipping beast");
      return false;
    } finally {
      set({ isEquipping: false });
    }
  },

  buyEgg: async (characterId: string, eggType: string, currencyType = "GOLD") => {
    if (!characterId || !eggType) return false;
    set({ isBuying: true });
    playUIMenuSFX("confirm");
    try {
      const res = await fetch(`${API_BASE_URL}/api/beasts/eggs/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, eggType, currencyType }),
      });
      if (res.ok) {
        const result = await res.json();
        playBuffSFX("levelup");
        toast.success(result.message || "Mystery Egg acquired!");
        await get().fetchCollection(characterId);
        return true;
      } else {
        const err = await res.json().catch(() => ({ detail: "Failed to purchase egg" }));
        toast.error(err.detail || "Failed to purchase egg");
        return false;
      }
    } catch (err) {
      toast.error("Network error while purchasing egg");
      return false;
    } finally {
      set({ isBuying: false });
    }
  },

  incubateEgg: async (characterId: string, eggId: string) => {
    if (!characterId || !eggId) return false;
    playUIMenuSFX("confirm");
    try {
      const res = await fetch(`${API_BASE_URL}/api/beasts/eggs/incubate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, eggId }),
      });
      if (res.ok) {
        toast.success("Egg placed in active incubator!");
        await get().fetchCollection(characterId);
        return true;
      }
      return false;
    } catch (err) {
      toast.error("Failed to set active egg");
      return false;
    }
  },

  openCelebrationModal: (data: CelebrationPayload) => {
    set({
      celebrationModal: {
        isOpen: true,
        data
      }
    });
  },

  closeCelebrationModal: () => {
    set({
      celebrationModal: {
        isOpen: false,
        data: null
      }
    });
  }
}));
