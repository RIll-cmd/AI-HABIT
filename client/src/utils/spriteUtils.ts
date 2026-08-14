/**
 * Dynamic Animated GIF vs. Static Sprite Asset Routing Helper
 */

// Set of known IDs that have animated GIF assets available in public/
const ANIMATED_GIF_KEYS = new Set([
  "gollux",
  "nightborne",
  "obsidian-sentinel",
  "obsidian_sentinel",
  "gym-behemoth",
  "gym_behemoth",
  "titan-of-iron",
  "iron-golem",
  "colossus-of-muscle",
  "golem",
  "slime",
  "bat",
  "rat",
  "crab",
  "skull",
  "pebble",
  "mushroom",
  "necromancer",
  "wizard",
  "bringer_of_death",
  "bringer-of-death",
]);

export interface SpriteUrlOptions {
  floorOrLevel?: number;
  isBoss?: boolean;
  preferAnimated?: boolean;
}

/**
 * Returns the public asset URL for an enemy or boss sprite.
 * 1. Checks for animated GIF asset first in /bosses/{bossId}.gif or /sprites/animated/{enemyId}.gif
 * 2. Falls back to static PNG asset in /sprites/static/{enemyId}.png only if GIF asset is unavailable
 */
export function getEnemySpriteUrl(
  enemyIdentifier: string,
  options: SpriteUrlOptions = {}
): string {
  if (!enemyIdentifier) return "/sprites/static/slime.png";

  const raw = enemyIdentifier.toLowerCase().trim();

  // Normalize slug key
  let slug = raw.replace(/[^a-z0-9\s_-]/g, "").replace(/\s+/g, "_");

  // Smart mapping for known boss and enemy names
  if (raw.includes("obsidian") || raw.includes("sentinel")) slug = "obsidian_sentinel";
  else if (raw.includes("behemoth") || raw.includes("colossus") || raw.includes("gym")) slug = "gym_behemoth";
  else if (raw.includes("titan") || raw.includes("iron")) slug = "titan-of-iron";
  else if (raw.includes("gollux") || raw.includes("golux")) slug = "gollux";
  else if (raw.includes("nightborne") || raw.includes("night borne") || raw.includes("night")) slug = "nightborne";
  else if (raw.includes("slime")) slug = "slime";
  else if (raw.includes("bat")) slug = "bat";
  else if (raw.includes("rat")) slug = "rat";
  else if (raw.includes("crab")) slug = "crab";
  else if (raw.includes("skull") || raw.includes("skeleton")) slug = "skull";
  else if (raw.includes("pebble") || raw.includes("boulder")) slug = "pebble";
  else if (raw.includes("mushroom")) slug = "mushroom";
  else if (raw.includes("wizard")) slug = "wizard";
  else if (raw.includes("necromancer")) slug = "necromancer";
  else if (raw.includes("bringer") || raw.includes("death")) slug = "bringer_of_death";
  else if (raw.includes("golem")) slug = "golem";

  const isBoss = options.isBoss || raw.includes("boss") || raw.includes("sentinel") || raw.includes("behemoth") || raw.includes("gollux") || raw.includes("nightborne");

  // 1. Check for animated GIF asset first
  if (ANIMATED_GIF_KEYS.has(slug) || options.preferAnimated || isBoss) {
    if (isBoss) {
      if (slug === "obsidian_sentinel") return "/bosses/obsidian-sentinel.gif";
      if (slug === "gym_behemoth") return "/bosses/gym-behemoth.gif";
      if (slug === "gollux") return "/bosses/gollux.gif";
      if (slug === "nightborne") return "/bosses/nightborne.gif";
      if (slug === "golem" || slug === "titan-of-iron") return "/bosses/golem.gif";
      return `/bosses/${slug}.gif`;
    }
    if (ANIMATED_GIF_KEYS.has(slug)) {
      return `/sprites/animated/${slug}.gif`;
    }
  }

  // 2. Fall back to static PNG asset if GIF asset does not exist
  return `/sprites/static/${slug}.png`;
}
