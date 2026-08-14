export interface IngredientRequirement {
  name: string;
  quantity: number;
  icon: string;
  ownedQuantity: number;
  isSatisfied: boolean;
}

export interface RecipeOutput {
  name: string;
  type: string;
  rarity: string;
  icon: string;
  description: string;
  attack: number;
  defense: number;
  strength: number;
  knowledge: number;
  endurance: number;
  recovery: number;
  focus: number;
  discipline: number;
  sellValue: number;
}

export interface CraftingRecipe {
  id: string;
  title: string;
  category: "WEAPONS" | "ARMOR" | "ACCESSORIES" | "ALCHEMY";
  description: string;
  requiredLevel: number;
  goldCost: number;
  ingredients: IngredientRequirement[];
  output: RecipeOutput;
  canCraft: boolean;
  missingRequirements: string[];
}

export interface CraftResponse {
  status: string;
  message: string;
  craftedItem: RecipeOutput & { id?: string; [key: string]: any };
  newGold: number;
  consumedIngredients: IngredientRequirement[];
}
