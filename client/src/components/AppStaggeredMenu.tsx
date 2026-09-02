"use client";

import React from "react";
import { StaggeredMenu, StaggeredMenuItem, StaggeredMenuSocialItem } from "@/components/ui/StaggeredMenu";
import { useNavigationStore } from "@/store/useNavigationStore";
import { playSystemOpen } from "@/features/audio/useSystemAudio";
import { playMovementSFX } from "@/utils/audio";

export const ASCEND_NAV_ITEMS: StaggeredMenuItem[] = [
  { label: "Dashboard", link: "/dashboard", ariaLabel: "Go to Dashboard" },
  { label: "Profile", link: "/profile", ariaLabel: "View Character Profile" },
  { label: "Missions", link: "/missions", ariaLabel: "View Daily Missions" },
  { label: "Habits", link: "/habits", ariaLabel: "Track Habits" },
  { label: "Sleep & Rest", link: "/sleep", ariaLabel: "Sleep Sanctuary" },
  { label: "Learning & Focus", link: "/learning", ariaLabel: "Focus Engine" },
  { label: "Calendar", link: "/calendar", ariaLabel: "Calendar Schedule" },
  { label: "Workouts", link: "/workouts", ariaLabel: "Fitness & Workouts" },
  { label: "Boss PR", link: "/workouts/boss-pr", ariaLabel: "Boss PR Benchmarks" },
  { label: "Tower", link: "/tower", ariaLabel: "Tower of Ascension" },
  { label: "Inventory", link: "/inventory", ariaLabel: "Vault & Equipment" },
  { label: "Beasts & Pets", link: "/beasts", ariaLabel: "Companion Sanctum" },
  { label: "Forge & Craft", link: "/crafting", ariaLabel: "Blacksmith Forge" },
  { label: "Skills", link: "/skills", ariaLabel: "Skill Tree" },
  { label: "Bosses", link: "/bosses", ariaLabel: "World Bosses" },
  { label: "Shop", link: "/shop", ariaLabel: "Merchant Emporium" },
  { label: "Achievements", link: "/achievements", ariaLabel: "Hall of Achievements" },
  { label: "AI System", link: "/aira", ariaLabel: "AIRA AI System" },
];

export const ASCEND_SOCIAL_ITEMS: StaggeredMenuSocialItem[] = [
  { label: "AIRA Console", link: "/aira" },
  { label: "Settings", link: "/settings" },
  { label: "Community", link: "https://discord.gg" },
];

export function AppStaggeredMenu({
  position = "left",
  isFixed = true,
}: {
  position?: "left" | "right";
  isFixed?: boolean;
}) {
  const { isMenuOpen, setMenuOpen } = useNavigationStore();

  return (
    <StaggeredMenu
      position={position}
      isFixed={isFixed}
      hideHeader={true}
      isOpen={isMenuOpen}
      onOpenChange={setMenuOpen}
      items={ASCEND_NAV_ITEMS.map((item) => ({
        ...item,
        onClick: () => {
          setMenuOpen(false);
          playSystemOpen();
          playMovementSFX("teleport");
        },
      }))}
      socialItems={ASCEND_SOCIAL_ITEMS}
      displaySocials={true}
      displayItemNumbering={true}
      accentColor="#22c55e"
      colors={[
        "#23074D",
        "#440F79",
        "#6F1B9B",
        "#9D22A8",
        "#D42B7D",
        "#EB3F67",
        "#F45D48",
      ]}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#ffffff"
      onMenuOpen={() => {
        playSystemOpen();
      }}
    />
  );
}

export default AppStaggeredMenu;
