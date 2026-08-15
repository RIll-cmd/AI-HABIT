"use client";

import React from "react";
import { BeastGrid } from "@/features/beasts/components/BeastGrid";
import { BestiarySpeciesSummary } from "@/features/beasts/types/beast";

export interface BeastBestiaryProps {
  bestiary: BestiarySpeciesSummary[];
  characterId: string;
  totalDiscovered: number;
  totalSpecies: number;
}

export const BeastBestiary: React.FC<BeastBestiaryProps> = (props) => {
  return <BeastGrid {...props} />;
};
