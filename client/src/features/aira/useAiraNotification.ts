import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAiraStore } from "./store";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useTowerStore } from "@/features/tower/store/useTowerStore";
import { useHabitStore } from "@/features/habits/store";
import { useBossStore } from "@/features/bosses/store/useBossStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { playVoiceLine } from "@/utils/audio";

/**
 * Global AIRA Periodic Briefing & Notification Manager Hook.
 * Runs a 60-second interval when active on the Dashboard to inspect
 * character, tower, habit, and boss states and present tactical HUD notifications.
 */
export function useAiraNotification() {
  const pathname = usePathname();
  const { autoBriefingsEnabled, showPeriodicToast } = useAiraStore();
  const lastBriefingIndexRef = useRef<number>(0);

  useEffect(() => {
    // Only run periodic analysis if enabled
    if (!autoBriefingsEnabled) return;

    // Check if user is currently on the Dashboard
    const isDashboard = pathname === "/" || pathname === "/dashboard";
    if (!isDashboard) return;

    const runAnalysis = () => {
      const character = useCharacterStore.getState().character;
      const floors = useTowerStore.getState().floors;
      const todayMissions = useHabitStore.getState().todayMissions;
      const bosses = useBossStore.getState().bosses;

      const unfinishedMissions = todayMissions.filter((m) => m.status !== "COMPLETED");
      const activeBoss = bosses.find((b) => b.status === "ACTIVE");
      const activeFloor = floors.find((f) => f.status === "AVAILABLE" || f.status === "ATTEMPTED");

      // Dynamic Triggers Pool
      const triggers: { text: string; category: string }[] = [];

      // 1. Unfinished Missions Alert
      if (unfinishedMissions.length > 0) {
        triggers.push({
          category: "UNFINISHED MISSIONS",
          text: `Master, you currently have ${unfinishedMissions.length} pending daily mission${unfinishedMissions.length > 1 ? "s" : ""} remaining. Completing them will optimize today's EXP yield.`,
        });
      }

      // 2. Boss Threat Alert
      if (activeBoss && activeBoss.currentHp > 0) {
        triggers.push({
          category: "BOSS ALERT",
          text: `Target Active: ${activeBoss.name} is currently at active HP (${activeBoss.currentHp.toLocaleString()} HP remaining). Recommend executing high-priority missions for maximum damage output.`,
        });
      }

      // 3. Tower Readiness
      if (activeFloor) {
        triggers.push({
          category: "TOWER READINESS",
          text: `Resonance check complete. Floor ${activeFloor.floorNumber} is evaluated and ready for Tower floor progression.`,
        });
      }

      // 4. Time-based Greeting
      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
      triggers.push({
        category: "TACTICAL BRIEFING",
        text: `Good ${timeOfDay}, ${character?.name || "Master"}. Core diagnostic complete. All operational subroutines are running at optimal parameters.`,
      });

      // 5. Idle/Optimal
      triggers.push({
        category: "SYSTEM NOMINAL",
        text: "System status nominal. Monitoring real-world activity logs.",
      });

      // Rotate through available relevant triggers
      const selectedIndex = lastBriefingIndexRef.current % triggers.length;
      const selectedBriefing = triggers[selectedIndex];
      lastBriefingIndexRef.current = (lastBriefingIndexRef.current + 1) % triggers.length;

      // Map to NotificationCategory
      let notificationCategory = "AIRA BRIEFINGS";
      if (selectedBriefing.category === "UNFINISHED MISSIONS") notificationCategory = "HABITS";
      if (selectedBriefing.category === "BOSS ALERT" || selectedBriefing.category === "TOWER READINESS") notificationCategory = "TOWER / SYSTEM";

      // Dispatch Toast & Audio Cue
      showPeriodicToast(selectedBriefing.text, selectedBriefing.category);
      useNotificationStore.getState().addNotification(notificationCategory as any, selectedBriefing.text);
      playVoiceLine("/sounds/AIRA Persona/AI-NOTICE.mp3");
    };

    // Run initial briefing scan after 10 seconds, then repeat every 60 seconds (1 minute)
    const intervalId = setInterval(runAnalysis, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [pathname, autoBriefingsEnabled, showPeriodicToast]);
}
