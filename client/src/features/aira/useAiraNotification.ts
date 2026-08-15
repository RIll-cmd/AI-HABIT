import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAiraStore } from "./store";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useTowerStore } from "@/features/tower/store/useTowerStore";
import { useHabitStore } from "@/features/habits/store";
import { useBossStore } from "@/features/bosses/store/useBossStore";
import { useWorkoutStore } from "@/features/workouts/store/useWorkoutStore";
import { useShopStore } from "@/features/shop/store/useShopStore";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import { useSkillStore } from "@/features/skills/store/useSkillStore";
import { useBeastStore } from "@/features/beasts/store/useBeastStore";
import { useSleepStore } from "@/features/sleep/store/useSleepStore";
import { useLearningStore } from "@/features/learning/store/useLearningStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { playAIRASound } from "@/utils/audio";
import { AiraMood } from "@/components/ui/AiraAvatar";

interface BriefingTrigger {
  text: string;
  category: string;
  mood: AiraMood;
}

/**
 * Generates context-aware AIRA briefings based on the active page/route and real-time store telemetry.
 */
function generatePageContextBriefings(pathname: string): BriefingTrigger[] {
  const triggers: BriefingTrigger[] = [];

  const character = useCharacterStore.getState().character;
  const userGold = character?.gold ?? 0;
  const userGems = character?.gems ?? 0;

  // =========================================================================
  // 1. WORKOUTS & BODY HEATMAP PAGE (/workouts, /workouts/boss-pr)
  // =========================================================================
  if (pathname.startsWith("/workouts")) {
    const workoutStore = useWorkoutStore.getState();
    const recovery = workoutStore.muscleRecovery;
    const isWorkoutActive = workoutStore.isWorkoutActive;

    if (isWorkoutActive) {
      triggers.push({
        category: "WORKOUT PROTOCOL",
        mood: "ANALYZING",
        text: `Active workout session detected. Focus on controlled eccentric tempo, maintain proper breathing cadence, and target RPE 8.0–9.0 for optimal hypertrophy.`,
      });
    }

    if (pathname.includes("boss-pr")) {
      triggers.push({
        category: "WEEKLY PR BOSS",
        mood: "WARNING",
        text: `Weekly Boss PR Protocol: Damage dealt scales exponentially with your heaviest completed sets and estimated 1RM. Execute your target compound movement with maximum power!`,
      });
    }

    if (recovery && recovery.muscles) {
      const musclesList = Object.values(recovery.muscles);
      const fatigued = musclesList.filter((m) => m.freshness < 50 || m.status === "FATIGUED");
      const fresh = musclesList.filter((m) => m.freshness >= 80 || m.status === "FRESH");

      // 1.1 Fatigued muscles warning
      if (fatigued.length > 0) {
        const fatiguedNames = fatigued.slice(0, 3).map((m) => `${m.name} (${Math.round(m.freshness)}%)`).join(", ");
        triggers.push({
          category: "HEATMAP TELEMETRY",
          mood: "WARNING",
          text: `Biometric Heatmap Alert: High localized fatigue detected in ${fatiguedNames}. I advise resting these groups today to allow full cellular repair and prevent overtraining.`,
        });
      }

      // 1.2 Fresh muscles workout suggestions
      const freshUpperPush = fresh.filter((m) => ["CHEST", "SHOULDERS", "FRONT_DELTS", "TRICEPS"].includes(m.id));
      const freshUpperPull = fresh.filter((m) => ["LATS", "TRAPS", "REAR_DELTS", "BICEPS"].includes(m.id));
      const freshLegs = fresh.filter((m) => ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES"].includes(m.id));
      const freshCore = fresh.filter((m) => ["ABS", "OBLIQUES", "LOWER_BACK"].includes(m.id));

      if (freshLegs.length >= 2) {
        triggers.push({
          category: "WORKOUT RECOMMENDATION",
          mood: "SUCCESS",
          text: `Optimal Biometric Readiness: Lower body groups (${freshLegs.map((m) => m.name).slice(0, 2).join(", ")}) are at 100% freshness. Recommended protocol: Barbell Back Squats, Romanian Deadlifts, and Leg Press.`,
        });
      }

      if (freshUpperPush.length >= 2) {
        triggers.push({
          category: "WORKOUT RECOMMENDATION",
          mood: "SUCCESS",
          text: `Upper Push Primed: Pectorals and Shoulders have achieved full restoration. Recommended protocol: Incline Dumbbell Press, Standing Overhead Press, and Tricep Extensions.`,
        });
      }

      if (freshUpperPull.length >= 2) {
        triggers.push({
          category: "WORKOUT RECOMMENDATION",
          mood: "SUCCESS",
          text: `Upper Pull Primed: Latissimus Dorsi and Biceps are at peak readiness. Recommended protocol: Weighted Pull-ups, Barbell Bent-Over Rows, and Lat Pulldowns.`,
        });
      }

      if (freshCore.length >= 2 && triggers.length < 3) {
        triggers.push({
          category: "WORKOUT RECOMMENDATION",
          mood: "ANALYZING",
          text: `Core Stability Primed: Abdominals and Obliques are fully recovered. Consider integrating Hanging Leg Raises and Cable Woodchoppers into today's session.`,
        });
      }

      // 1.3 Full Peak or Critical Fatigue
      if (recovery.summary.freshCount === 16) {
        triggers.push({
          category: "HEATMAP TELEMETRY",
          mood: "HAPPY",
          text: `Full Biometric Peak: All 16 anatomical muscle groups are at 100% combat readiness! You are fully primed for maximum-effort PR testing or heavy compound lifting.`,
        });
      } else if (recovery.summary.overallFreshness < 40) {
        triggers.push({
          category: "HEATMAP TELEMETRY",
          mood: "WARNING",
          text: `System Fatigue Warning: Overall physical recovery is at ${Math.round(recovery.summary.overallFreshness)}%. High systemic damage logged. Prioritize hydration, 8+ hours of sleep, and active mobility.`,
        });
      }
    } else {
      triggers.push({
        category: "WORKOUT ADVICE",
        mood: "ANALYZING",
        text: `Bio-Scanner initializing. Log your completed sets in the Workout Logger to generate real-time anatomical recovery heatmaps.`,
      });
    }
  }

  // =========================================================================
  // 2. SHOP & THE ASCENDANT EXCHANGE (/shop)
  // =========================================================================
  else if (pathname.startsWith("/shop")) {
    const shopStore = useShopStore.getState();
    const inventoryStore = useInventoryStore.getState();
    const shopItems = shopStore.items || [];
    const equippedItems = (inventoryStore.items || []).filter((i) => i.isEquipped);

    if (shopItems.length > 0) {
      const rarityRank: Record<string, number> = {
        COMMON: 1,
        UNCOMMON: 2,
        RARE: 3,
        EPIC: 4,
        LEGENDARY: 5,
        HOLOGRAPHIC: 6,
        MYTHIC: 7,
      };

      // Check for equipment upgrade items
      const affordableUpgrades: typeof shopItems = [];
      const expensiveUpgrades: typeof shopItems = [];

      for (const item of shopItems) {
        if (!item.inStock && item.stock !== null && item.stock <= 0) continue;

        // Compare with currently equipped item in the same slot
        const matchingEquipped = equippedItems.find(
          (eq) => eq.itemDefinition?.type === item.type
        );

        const itemRarity = rarityRank[item.rarity?.toUpperCase()] || 1;
        const equippedRarity = matchingEquipped
          ? rarityRank[matchingEquipped.itemDefinition?.rarity?.toUpperCase()] || 1
          : 0;

        const isUpgrade = !matchingEquipped || itemRarity > equippedRarity;
        const isAffordable =
          item.currencyType === "GOLD"
            ? userGold >= item.price
            : userGems >= item.price;

        if (isUpgrade) {
          if (isAffordable) {
            affordableUpgrades.push(item);
          } else {
            expensiveUpgrades.push(item);
          }
        }
      }

      if (affordableUpgrades.length > 0) {
        const topItem = affordableUpgrades[0];
        triggers.push({
          category: "SHOP RECOMMENDATION",
          mood: "SUCCESS",
          text: `Tactical Shop Recommendation: '${topItem.name}' (${topItem.rarity} ${topItem.type}) provides a direct stat increase over your current loadout for ${topItem.price} ${topItem.currencyType}. Highly recommended purchase!`,
        });
      } else if (expensiveUpgrades.length > 0) {
        const topItem = expensiveUpgrades[0];
        const deficit =
          topItem.currencyType === "GOLD"
            ? topItem.price - userGold
            : topItem.price - userGems;
        triggers.push({
          category: "SHOP ANALYSIS",
          mood: "ANALYZING",
          text: `Market Intelligence: '${topItem.name}' (${topItem.rarity} ${topItem.type}) is the optimal upgrade for your build, but you are ${deficit} ${topItem.currencyType} short. Complete daily quests or Tower floors to fund it.`,
        });
      } else {
        // No equipment upgrades found
        triggers.push({
          category: "SHOP ANALYSIS",
          mood: "NEUTRAL",
          text: `Tactical Shop Evaluation: None of the current shop armaments offer a net stat upgrade over your equipped gear. I advise conserving your Gold for higher-tier dungeon drops or the next stock rotation.`,
        });
      }

      // Check for consumables
      const consumables = shopItems.filter(
        (i) => i.type === "CONSUMABLE" || i.type === "POTION"
      );
      if (consumables.length > 0) {
        triggers.push({
          category: "SUPPLY INTEL",
          mood: "ANALYZING",
          text: `Supply Stock: Restorative potions and combat elixirs are available. Ensure your bag has emergency healing supplies before ascending difficult Tower floors.`,
        });
      }
    } else {
      triggers.push({
        category: "SHOP TERMINAL",
        mood: "ANALYZING",
        text: `Merchant terminal ready. Use 'Analyze Market' or refresh shop stock to inspect new daily inventory rotations.`,
      });
    }
  }

  // =========================================================================
  // 3. INVENTORY & ARMORY PAGE (/inventory)
  // =========================================================================
  else if (pathname.startsWith("/inventory")) {
    const inventoryStore = useInventoryStore.getState();
    const beastStore = useBeastStore.getState();
    const items = inventoryStore.items || [];
    const equipped = items.filter((i) => i.isEquipped);
    const unequipped = items.filter((i) => !i.isEquipped);

    // 3.1 Check for empty slots with available items
    const standardSlots = [
      "WEAPON",
      "ARMOR",
      "HELMET",
      "BOOTS",
      "GLOVES",
      "RING",
      "NECKLACE",
      "ARTIFACT",
      "RELIC",
    ];
    const equippedSlots = new Set<string>(
      equipped.map((i) => i.itemDefinition?.type).filter(Boolean) as string[]
    );
    const emptySlotsWithGear = standardSlots.filter((slot) => {
      if (equippedSlots.has(slot)) return false;
      return unequipped.some((i) => (i.itemDefinition?.type as string) === slot);
    });

    if (emptySlotsWithGear.length > 0) {
      const slotName = emptySlotsWithGear[0];
      triggers.push({
        category: "ARMORY INSPECTION",
        mood: "WARNING",
        text: `PaperDoll Alert: Your ${slotName} slot is currently unequipped, but you have matching gear in your bag! Equip it to raise your baseline Combat Power.`,
      });
    }

    // 3.2 Check for dragon companion
    const collection = beastStore.collection;
    if (
      collection &&
      !collection.equippedBeast &&
      collection.unlockedBeasts &&
      collection.unlockedBeasts.length > 0
    ) {
      triggers.push({
        category: "FAMILIAR RESONANCE",
        mood: "ANALYZING",
        text: `Familiar Telemetry: You have hatched beasts available but no active companion equipped. Equip a Dragon Companion in the Beasts matrix to activate elemental passive multipliers.`,
      });
    }

    triggers.push({
      category: "INVENTORY STATUS",
      mood: "NEUTRAL",
      text: `Armory Diagnostics: ${items.length} items logged. Lock your prized equipment to prevent accidental salvage or replacement during batch management.`,
    });
  }

  // =========================================================================
  // 4. SKILLS & ELEMENTAL TREE (/skills)
  // =========================================================================
  else if (pathname.startsWith("/skills")) {
    const skillStore = useSkillStore.getState();
    const availableSP = skillStore.availableSP || character?.availableSP || 0;

    if (availableSP > 0) {
      triggers.push({
        category: "AETHER RESONANCE",
        mood: "SUCCESS",
        text: `Aether Resonance: You have ${availableSP} unspent Skill Point${availableSP > 1 ? "s" : ""} (SP)! Invest in elemental mastery trees or passive nodes to amplify your combat attributes.`,
      });
    } else {
      triggers.push({
        category: "SKILL TREE SYNC",
        mood: "NEUTRAL",
        text: `Skill Matrix Synced: All active SP allocations are locked in. Earn additional Skill Points by leveling up and maintaining high habit consistency.`,
      });
    }

    triggers.push({
      category: "PASSIVE SYNERGY",
      mood: "ANALYZING",
      text: `Ascension Passives: Unlocking core passives like 'Body Conditioning' and 'Mental Fortress' grants cumulative percentage multipliers to your base attributes.`,
    });
  }

  // =========================================================================
  // 5. DUNGEON TOWER OF ASCENSION (/tower)
  // =========================================================================
  else if (pathname.startsWith("/tower")) {
    const towerStore = useTowerStore.getState();
    const floors = towerStore.floors || [];
    const activeFloor = floors.find(
      (f) => f.status === "AVAILABLE" || f.status === "ATTEMPTED"
    );
    const charPower = character?.power ?? 50;

    if (activeFloor) {
      const recPower = (activeFloor as any).recommendedPower ?? (activeFloor.floorNumber * 80 + 20);
      if (charPower >= recPower) {
        triggers.push({
          category: "TOWER FORECAST",
          mood: "SUCCESS",
          text: `Tower Assessment: Your Combat Power (${charPower} CP) exceeds Floor ${activeFloor.floorNumber}'s threshold (${recPower} CP). Victory probability is 94%. Advance your ascent!`,
        });
      } else {
        triggers.push({
          category: "TOWER WARNING",
          mood: "WARNING",
          text: `Tactical Warning: Floor ${activeFloor.floorNumber} Guardian power (${recPower} CP) exceeds your current defense (${charPower} CP). Upgrade equipment or complete physical workouts before challenging.`,
        });
      }
    } else {
      triggers.push({
        category: "TOWER OF ASCENSION",
        mood: "HAPPY",
        text: `Ascension Monolith: Available floors conquered. Hone your physical discipline and character attributes to prepare for upcoming higher-tier monolith floors.`,
      });
    }

    triggers.push({
      category: "COMBAT TACTICS",
      mood: "ANALYZING",
      text: `Combat Tactics: Conserve offensive cooldowns during initial mob waves and time your elemental burst damage when the floor boss enters enrage phases.`,
    });
  }

  // =========================================================================
  // 6. BEAST EGG INCUBATOR & BESTIARY (/beasts)
  // =========================================================================
  else if (pathname.startsWith("/beasts")) {
    const beastStore = useBeastStore.getState();
    const collection = beastStore.collection;

    if (collection?.activeEgg) {
      const egg = collection.activeEgg;
      if (egg.status === "READY_TO_HATCH") {
        triggers.push({
          category: "INCUBATOR OVERCHARGE",
          mood: "HAPPY",
          text: `Elemental Resonance Reached! Your ${egg.name} is fully charged and ready to crack and hatch on the pedestal! Click 'Hatch Egg' now!`,
        });
      } else if (egg.status === "INCUBATING") {
        const target = egg.targetSteps || egg.targetEnergy || 3000;
        const current = egg.currentSteps || egg.currentEnergy || 0;
        const remaining = Math.max(0, target - current);
        triggers.push({
          category: "INCUBATION TELEMETRY",
          mood: "ANALYZING",
          text: `Active Egg Progress: ${current.toLocaleString()} / ${target.toLocaleString()} steps logged (${remaining.toLocaleString()} steps remaining). Walk or log workouts to accelerate incubation!`,
        });
      }
    } else {
      triggers.push({
        category: "INCUBATOR IDLE",
        mood: "WARNING",
        text: `Incubation Pedestal is empty! Select an egg from your collection or purchase one from the Mystery Egg Shop to begin hatching a new companion.`,
      });
    }

    if (collection?.equippedBeast) {
      const beast = collection.equippedBeast;
      triggers.push({
        category: "COMPANION LINK",
        mood: "SUCCESS",
        text: `Active Companion: '${beast.name}' (${beast.rarity}) is actively granting +${beast.statBonusValue}% ${beast.statBonusType} to your combat attributes.`,
      });
    }
  }

  // =========================================================================
  // 7. HABIT MASTERY & KANBAN QUESTS (/habits, /missions)
  // =========================================================================
  else if (pathname.startsWith("/habits") || pathname.startsWith("/missions")) {
    const habitStore = useHabitStore.getState();
    const todayMissions = habitStore.todayMissions || [];
    const unfinished = todayMissions.filter((m) => m.status !== "COMPLETED");

    if (unfinished.length > 0) {
      triggers.push({
        category: "DAILY DISCIPLINE",
        mood: "ANALYZING",
        text: `Discipline Protocol: You have ${unfinished.length} pending daily mission${unfinished.length > 1 ? "s" : ""} remaining today. Completing them will maximize today's EXP and stat yield.`,
      });
    } else if (todayMissions.length > 0) {
      triggers.push({
        category: "DAILY DISCIPLINE",
        mood: "SUCCESS",
        text: `Flawless Protocol: All daily missions for today are 100% completed! Daily consistency streak protected and maximum multiplier secured.`,
      });
    } else {
      triggers.push({
        category: "MISSION MATRIX",
        mood: "NEUTRAL",
        text: `Mission Matrix: Initialize your daily habit routines to generate actionable daily quests and earn EXP.`,
      });
    }
  }

  // =========================================================================
  // 8. RAID BOSSES (/bosses)
  // =========================================================================
  else if (pathname.startsWith("/bosses")) {
    const bossStore = useBossStore.getState();
    const bosses = bossStore.bosses || [];
    const activeBoss = bosses.find((b) => b.status === "ACTIVE" || (b.currentHp > 0 && b.status !== "DEFEATED"));

    if (activeBoss) {
      triggers.push({
        category: "RAID INTEL",
        mood: "WARNING",
        text: `Raid Threat: '${activeBoss.name}' has ${activeBoss.currentHp.toLocaleString()} HP remaining. Execute high-volume workout sessions and elite habit completions to deal crushing damage!`,
      });
    } else {
      triggers.push({
        category: "RAID ZONE CLEAR",
        mood: "SUCCESS",
        text: `Raid Zone Clear: No active boss threats detected. Next weekly raid will spawn at the scheduled cycle reset.`,
      });
    }
  }

  // =========================================================================
  // 9. CHARACTER & PROFILE (/character, /profile)
  // =========================================================================
  else if (pathname.startsWith("/character") || pathname.startsWith("/profile")) {
    if (character?.stats) {
      const stats = character.stats;
      const statPairs: [string, number][] = [
        ["Strength", stats.strength ?? 1],
        ["Knowledge", stats.knowledge ?? 1],
        ["Discipline", stats.discipline ?? 1],
        ["Focus", stats.focus ?? 1],
        ["Endurance", stats.endurance ?? 1],
        ["Recovery", stats.recovery ?? 1],
        ["Consistency", stats.consistency ?? 1],
      ];

      statPairs.sort((a, b) => a[1] - b[1]);
      const [lowestName, lowestVal] = statPairs[0];

      triggers.push({
        category: "BIOMETRIC RADAR",
        mood: "ANALYZING",
        text: `Biometric Radar: Your lowest attribute is ${lowestName} (${lowestVal}). Focus on aligned daily protocols to maintain a balanced Hexagon radar profile.`,
      });
    }

    triggers.push({
      category: "CHARACTER EVOLUTION",
      mood: "NEUTRAL",
      text: `Ascendant Profile: Level ${character?.level || 1} (Rank ${character?.rank || "F"}). Power Rating: ${character?.power || 50} CP. Gold: ${userGold.toLocaleString()} G.`,
    });
  }

  // =========================================================================
  // 10. SLEEP SANCTUARY & RECOVERY ENGINE (/sleep)
  // =========================================================================
  else if (pathname.startsWith("/sleep")) {
    const sleepStore = useSleepStore.getState();
    const todayLogged = sleepStore.todayLogged;
    const avgHours = sleepStore.getAverageHours(7);
    const sleepDebt = sleepStore.getSleepDebt();
    const streak = sleepStore.getCurrentStreak();

    if (!todayLogged) {
      triggers.push({
        category: "SOMATIC RECOVERY",
        mood: "ANALYZING",
        text: `Sleep Biometrics Pending: Log your hours slept to calculate cellular restoration and claim your daily Recovery (REC) stat increase. Target: 8.0h.`,
      });
    } else {
      triggers.push({
        category: "CELLULAR REGENERATION",
        mood: "SUCCESS",
        text: `Restorative rest synchronized for today! 7-day average: ${avgHours}h. Maintaining close proximity to 8.0 hours maximizes your stamina recharge rate.`,
      });
    }

    if (sleepDebt > 3.0) {
      triggers.push({
        category: "SLEEP DEBT ALERT",
        mood: "WARNING",
        text: `Circadian Deficit Detected: You have accumulated ${sleepDebt}h of sleep debt this week. Consider an earlier bedtime tonight to prevent stat degradation.`,
      });
    }

    if (streak >= 3) {
      triggers.push({
        category: "CIRCADIAN CONSISTENCY",
        mood: "HAPPY",
        text: `Circadian Harmony: ${streak}-day unbroken sleep logging streak! High consistency significantly boosts your character's passive REC multipliers.`,
      });
    }
  }

  // =========================================================================
  // 11. LEARNING & POMODORO FOCUS ENGINE (/learning)
  // =========================================================================
  else if (pathname.startsWith("/learning")) {
    const learningStore = useLearningStore.getState();
    const status = learningStore.status;
    const mode = learningStore.mode;
    const streak = learningStore.getFocusStreak();
    const todayMins = learningStore.getTodayFocusMinutes();
    const linkedHabitName = learningStore.linkedHabitName;

    if (status === "RUNNING") {
      triggers.push({
        category: "COGNITIVE FLOW STATE",
        mood: "ANALYZING",
        text: `Deep Neural Focus Active: ${mode === "FOCUS" ? "25m Sprint Block" : "Restorative Intermission"}. Maintain task isolation to maximize Knowledge (KNO) and Focus (FOC) stat growth.`,
      });
    } else {
      triggers.push({
        category: "COGNITIVE PROTOCOL",
        mood: "NEUTRAL",
        text: `Pomodoro Engine Ready: Link a habit or mission and start a 25-minute focus session to earn Knowledge, Focus, and Discipline stat increases.`,
      });
    }

    if (linkedHabitName) {
      triggers.push({
        category: "HABIT SYNCHRONIZATION",
        mood: "SUCCESS",
        text: `Active link established: "${linkedHabitName}". Completing your focus block will automatically advance your daily habit progression.`,
      });
    }

    if (todayMins > 0) {
      triggers.push({
        category: "DAILY FOCUS TELEMETRY",
        mood: "HAPPY",
        text: `Cognitive Output: You have logged ${todayMins} minutes of deep focus today across a ${streak}-day focus habit streak!`,
      });
    }
  }

  // =========================================================================
  // 12. DASHBOARD & DEFAULT OVERVIEW (/dashboard, /, etc.)
  // =========================================================================
  else {
    const todayMissions = useHabitStore.getState().todayMissions || [];
    const unfinished = todayMissions.filter((m) => m.status !== "COMPLETED");
    const activeEgg = useBeastStore.getState().collection?.activeEgg;
    const bosses = useBossStore.getState().bosses || [];
    const activeBoss = bosses.find((b) => b.status === "ACTIVE" && b.currentHp > 0);
    const availableSP = useSkillStore.getState().availableSP || character?.availableSP || 0;

    if (activeEgg && activeEgg.status === "READY_TO_HATCH") {
      triggers.push({
        category: "BEAST HATCH ALERT",
        mood: "HAPPY",
        text: `Incubator Overcharge: Your elemental beast egg is fully charged and ready to hatch on the pedestal! Navigate to Beasts to claim your dragon!`,
      });
    }

    if (availableSP > 0) {
      triggers.push({
        category: "SKILL POINTS READY",
        mood: "SUCCESS",
        text: `Aether Resonance: You have ${availableSP} unspent Skill Points (SP)! Invest them in the Skill Tree to unlock powerful stat passives.`,
      });
    }

    if (unfinished.length > 0) {
      triggers.push({
        category: "DAILY MISSIONS",
        mood: "ANALYZING",
        text: `Master, you currently have ${unfinished.length} pending daily mission${unfinished.length > 1 ? "s" : ""} remaining. Completing them will optimize today's EXP yield.`,
      });
    }

    if (activeBoss) {
      triggers.push({
        category: "BOSS THREAT",
        mood: "WARNING",
        text: `Raid Target Active: ${activeBoss.name} has ${activeBoss.currentHp.toLocaleString()} HP remaining. Execute your daily training to deal heavy damage.`,
      });
    }

    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
    triggers.push({
      category: "TACTICAL BRIEFING",
      mood: "NEUTRAL",
      text: `Good ${timeOfDay}, ${character?.name || "Master"}. System status nominal. Monitoring your real-world habit execution and recovery metrics.`,
    });
  }

  // Fallback if empty
  if (triggers.length === 0) {
    triggers.push({
      category: "SYSTEM NOMINAL",
      mood: "NEUTRAL",
      text: "System status nominal. All operational subroutines running at peak parameters.",
    });
  }

  return triggers;
}

/**
 * Global AIRA Periodic Briefing & Notification Manager Hook.
 * Dynamically provides intelligent, context-aware analysis on a stable 1-minute (60s) interval.
 * Does NOT auto-fire immediately upon switching sidebars/pages.
 */
export function useAiraNotification() {
  const pathname = usePathname();
  const { autoBriefingsEnabled, showPeriodicToast } = useAiraStore();
  const { airaPeriodicEnabled, airaIntervalSeconds, notificationSound } = useSettingsStore();
  const lastBriefingIndexRef = useRef<number>(0);
  const pathnameRef = useRef<string>(pathname);

  // Keep latest active pathname updated without resetting the periodic timer
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    // Only run periodic analysis if enabled in both settings & store
    if (!autoBriefingsEnabled || !airaPeriodicEnabled) return;

    // Do not run on unauthenticated public auth routes
    const isPublicAuth =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/unauthorized" ||
      pathname === "/landing";
    if (isPublicAuth) return;

    const runAnalysis = () => {
      const currentPath = pathnameRef.current || "/dashboard";
      const triggers = generatePageContextBriefings(currentPath);
      if (triggers.length === 0) return;

      const selectedIndex = lastBriefingIndexRef.current % triggers.length;
      const selectedBriefing = triggers[selectedIndex];
      lastBriefingIndexRef.current = (lastBriefingIndexRef.current + 1) % triggers.length;

      // Map to NotificationCategory in drawer
      let notificationCategory = "AIRA BRIEFINGS";
      if (
        selectedBriefing.category.includes("WORKOUT") ||
        selectedBriefing.category.includes("HEATMAP")
      ) {
        notificationCategory = "WORKOUTS";
      } else if (
        selectedBriefing.category.includes("SHOP") ||
        selectedBriefing.category.includes("SUPPLY")
      ) {
        notificationCategory = "SHOP";
      } else if (
        selectedBriefing.category.includes("MISSION") ||
        selectedBriefing.category.includes("DISCIPLINE")
      ) {
        notificationCategory = "HABITS";
      } else if (
        selectedBriefing.category.includes("TOWER") ||
        selectedBriefing.category.includes("BOSS")
      ) {
        notificationCategory = "TOWER / SYSTEM";
      } else if (selectedBriefing.category.includes("SLEEP") || selectedBriefing.category.includes("SOMATIC") || selectedBriefing.category.includes("CELLULAR")) {
        notificationCategory = "RECOVERY";
      } else if (selectedBriefing.category.includes("FOCUS") || selectedBriefing.category.includes("COGNITIVE") || selectedBriefing.category.includes("POMODORO")) {
        notificationCategory = "LEARNING";
      }

      // Dispatch Toast with Mood & Audio Cue
      showPeriodicToast(selectedBriefing.text, selectedBriefing.category, selectedBriefing.mood);
      useNotificationStore
        .getState()
        .addNotification(notificationCategory as any, selectedBriefing.text);

      // Play AIRA Notice sound audio if notification sound is active
      if (notificationSound) {
        playAIRASound("NOTICE");
      }
    };

    // Stable 1-minute (60 seconds) interval. Never fires immediately upon switching sidebars!
    const intervalMs = Math.max(60000, (airaIntervalSeconds || 60) * 1000);

    const intervalId = setInterval(runAnalysis, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    autoBriefingsEnabled,
    airaPeriodicEnabled,
    airaIntervalSeconds,
    notificationSound,
    showPeriodicToast,
  ]);
}
