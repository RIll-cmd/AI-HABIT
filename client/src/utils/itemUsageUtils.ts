import {
  Sword,
  Shield,
  Dumbbell,
  BookOpen,
  Zap,
  HeartPulse,
  Target,
  Activity,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Package,
} from "lucide-react";

export interface ItemStatBonus {
  label: string;
  shortLabel: string;
  value: number;
  icon: any;
  color: string;
  bg: string;
  borderColor: string;
}

export interface ItemUsageDetails {
  isEquipment: boolean;
  categoryLabel: string;
  slotLabel: string;
  usageGuide: string;
  statBonuses: ItemStatBonus[];
  hasBonuses: boolean;
}

const EQUIPMENT_TYPES = [
  "WEAPON",
  "HELMET",
  "ARMOR",
  "GLOVES",
  "BOOTS",
  "RING",
  "NECKLACE",
  "ARTIFACT",
  "RELIC",
  "EQUIPMENT",
];

export function getItemUsageDetails(item: {
  name: string;
  type?: string | null;
  description?: string | null;
  attack?: number | null;
  defense?: number | null;
  strength?: number | null;
  knowledge?: number | null;
  endurance?: number | null;
  recovery?: number | null;
  focus?: number | null;
  discipline?: number | null;
  consistency?: number | null;
}): ItemUsageDetails {
  const typeUpper = (item.type || "").toUpperCase();
  const nameLower = (item.name || "").toLowerCase();

  const isEquipment = EQUIPMENT_TYPES.includes(typeUpper) || 
    anyKeywordMatch(nameLower, ["sword", "blade", "bow", "axe", "armor", "cuirass", "shield", "helm", "boot", "glove", "ring", "staff", "dagger", "hammer", "necklace", "amulet"]);

  let categoryLabel = "Material";
  let slotLabel = "Non-Equippable";
  let usageGuide = "Used for gear enhancement and crafting recipes, or can be sold to merchants for Gold.";

  if (typeUpper === "WEAPON" || anyKeywordMatch(nameLower, ["sword", "blade", "bow", "axe", "staff", "dagger", "hammer", "crossbow"])) {
    categoryLabel = "Weapon";
    slotLabel = "Main Hand Weapon Slot";
    usageGuide = "Equip via Inventory to boost your character's Attack Power and physical combat damage.";
  } else if (typeUpper === "HELMET" || anyKeywordMatch(nameLower, ["helmet", "crown", "hood", "cap", "mask"])) {
    categoryLabel = "Helmet";
    slotLabel = "Head Armor Slot";
    usageGuide = "Equip via Inventory to increase Defense and neural focus against incoming strikes.";
  } else if (typeUpper === "ARMOR" || anyKeywordMatch(nameLower, ["armor", "plate", "mail", "robe", "tunic", "cuirass", "shield"])) {
    categoryLabel = "Armor";
    slotLabel = "Chest Armor Slot";
    usageGuide = "Equip via Inventory to significantly boost Defense and damage mitigation in Tower & Boss battles.";
  } else if (typeUpper === "GLOVES" || anyKeywordMatch(nameLower, ["glove", "gauntlet", "bracer"])) {
    categoryLabel = "Gloves";
    slotLabel = "Hands Slot";
    usageGuide = "Equip via Inventory to improve strike speed, precision, and physical handling.";
  } else if (typeUpper === "BOOTS" || anyKeywordMatch(nameLower, ["boot", "shoe", "greave", "sandal", "runners"])) {
    categoryLabel = "Boots";
    slotLabel = "Feet Slot";
    usageGuide = "Equip via Inventory to boost movement velocity, agility, and defensive positioning.";
  } else if (typeUpper === "RING" || anyKeywordMatch(nameLower, ["ring", "band"])) {
    categoryLabel = "Ring";
    slotLabel = "Finger Accessory Slot";
    usageGuide = "Equip via Inventory to channel magical mana and amplify multiple core attribute stats.";
  } else if (typeUpper === "NECKLACE" || anyKeywordMatch(nameLower, ["necklace", "amulet", "pendant", "choker"])) {
    categoryLabel = "Necklace";
    slotLabel = "Neck Accessory Slot";
    usageGuide = "Equip via Inventory to enhance life resonance, recovery speed, and spiritual stats.";
  } else if (typeUpper === "ARTIFACT" || typeUpper === "RELIC" || anyKeywordMatch(nameLower, ["artifact", "relic"])) {
    categoryLabel = "Artifact / Relic";
    slotLabel = "Artifact Relic Slot";
    usageGuide = "Equip via Inventory to unleash ancient monarch passive bonuses and special aura effects.";
  } else if (typeUpper === "CONSUMABLE" || anyKeywordMatch(nameLower, ["potion", "elixir", "flask", "token", "tonic", "scroll"])) {
    categoryLabel = "Consumable";
    slotLabel = "Useable from Inventory";
    if (nameLower.includes("health") || nameLower.includes("hp")) {
      usageGuide = "Use from Inventory to instantly restore character HP and accelerate biological recovery.";
    } else if (nameLower.includes("exp")) {
      usageGuide = "Use from Inventory to stimulate neural adaptation and immediately grant bonus EXP.";
    } else if (nameLower.includes("gold")) {
      usageGuide = "Use from Inventory to grant an immediate bonus payout of Gold currency.";
    } else {
      usageGuide = "Use directly from Inventory to activate its instant regenerative or multiplier effect.";
    }
  } else if (anyKeywordMatch(nameLower, ["gem", "crystal", "stone", "shard", "ore", "ingot", "material"])) {
    categoryLabel = "Material";
    slotLabel = "Crafting / Enhancement Material";
    usageGuide = "Valuable crafting material. Used in Forge upgrades and alchemical synthesis, or sellable for Gold.";
  }

  // Collect active stat bonuses
  const statBonuses: ItemStatBonus[] = [];

  if (typeof item.attack === "number" && item.attack > 0) {
    statBonuses.push({
      label: "Attack Power",
      shortLabel: "ATK",
      value: item.attack,
      icon: Sword,
      color: "text-red-400",
      bg: "bg-red-950/40",
      borderColor: "border-red-500/30",
    });
  }

  if (typeof item.defense === "number" && item.defense > 0) {
    statBonuses.push({
      label: "Defense Armor",
      shortLabel: "DEF",
      value: item.defense,
      icon: Shield,
      color: "text-blue-400",
      bg: "bg-blue-950/40",
      borderColor: "border-blue-500/30",
    });
  }

  if (typeof item.strength === "number" && item.strength > 0) {
    statBonuses.push({
      label: "Strength",
      shortLabel: "STR",
      value: item.strength,
      icon: Dumbbell,
      color: "text-orange-400",
      bg: "bg-orange-950/40",
      borderColor: "border-orange-500/30",
    });
  }

  if (typeof item.knowledge === "number" && item.knowledge > 0) {
    statBonuses.push({
      label: "Knowledge",
      shortLabel: "KNO",
      value: item.knowledge,
      icon: BookOpen,
      color: "text-cyan-400",
      bg: "bg-cyan-950/40",
      borderColor: "border-cyan-500/30",
    });
  }

  if (typeof item.endurance === "number" && item.endurance > 0) {
    statBonuses.push({
      label: "Endurance",
      shortLabel: "END",
      value: item.endurance,
      icon: Zap,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40",
      borderColor: "border-emerald-500/30",
    });
  }

  if (typeof item.recovery === "number" && item.recovery > 0) {
    statBonuses.push({
      label: "Recovery",
      shortLabel: "REC",
      value: item.recovery,
      icon: HeartPulse,
      color: "text-pink-400",
      bg: "bg-pink-950/40",
      borderColor: "border-pink-500/30",
    });
  }

  if (typeof item.focus === "number" && item.focus > 0) {
    statBonuses.push({
      label: "Focus",
      shortLabel: "FOC",
      value: item.focus,
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-950/40",
      borderColor: "border-purple-500/30",
    });
  }

  if (typeof item.discipline === "number" && item.discipline > 0) {
    statBonuses.push({
      label: "Discipline",
      shortLabel: "DIS",
      value: item.discipline,
      icon: Activity,
      color: "text-amber-400",
      bg: "bg-amber-950/40",
      borderColor: "border-amber-500/30",
    });
  }

  if (typeof item.consistency === "number" && item.consistency > 0) {
    statBonuses.push({
      label: "Consistency",
      shortLabel: "CNS",
      value: item.consistency,
      icon: Activity,
      color: "text-teal-400",
      bg: "bg-teal-950/40",
      borderColor: "border-teal-500/30",
    });
  }

  return {
    isEquipment,
    categoryLabel,
    slotLabel,
    usageGuide,
    statBonuses,
    hasBonuses: statBonuses.length > 0,
  };
}

function anyKeywordMatch(str: string, keywords: string[]): boolean {
  return keywords.some((k) => str.includes(k));
}
