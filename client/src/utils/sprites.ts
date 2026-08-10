/**
 * Sprite Utility for Tower Enemies, Bosses, and Character Avatars.
 * Maps enemy names & levels to cleanly cropped isolated sprite frames in public/BossesAndEnemies_sprite/cropped/.
 */

/**
 * Returns the public filepath for a given Tower enemy or Boss sprite.
 * Uses sliced/cropped single-frame assets to prevent squashed sprite sheet grids.
 */
export function getEnemySpritePath(
  enemyName: string,
  floorOrLevel: number = 1,
  isBoss: boolean = false
): string {
  const nameLower = (enemyName || "").toLowerCase();

  // 1. Featured Bosses (every 5 floors or by name)
  if (nameLower.includes("golux") || nameLower.includes("gollux")) {
    return "/BossesAndEnemies_sprite/cropped/gollux_cropped.png";
  }
  if (nameLower.includes("wizard")) {
    return "/BossesAndEnemies_sprite/cropped/wizard_cropped.png";
  }
  if (nameLower.includes("necromancer")) {
    return "/BossesAndEnemies_sprite/cropped/necromancer_cropped.png";
  }
  if (nameLower.includes("nightborne") || nameLower.includes("night borne")) {
    return "/BossesAndEnemies_sprite/cropped/nightborne_cropped.png";
  }
  if (nameLower.includes("bringer") || nameLower.includes("death")) {
    return "/BossesAndEnemies_sprite/cropped/bringer_of_death_cropped.png";
  }

  // Generic Boss fallback if flagged as isBoss or containing boss keywords
  if (isBoss || nameLower.includes("boss") || nameLower.includes("king") || nameLower.includes("monarch")) {
    const bossList = [
      "/BossesAndEnemies_sprite/cropped/gollux_cropped.png",
      "/BossesAndEnemies_sprite/cropped/wizard_cropped.png",
      "/BossesAndEnemies_sprite/cropped/necromancer_cropped.png",
      "/BossesAndEnemies_sprite/cropped/nightborne_cropped.png",
      "/BossesAndEnemies_sprite/cropped/bringer_of_death_cropped.png",
    ];
    const index = (Math.max(1, floorOrLevel) / 5 - 1) % bossList.length;
    return bossList[Math.max(0, Math.floor(index))] || bossList[0];
  }

  // 2. Regular Guardians by Name
  if (nameLower.includes("slime")) {
    return "/BossesAndEnemies_sprite/cropped/slime_cropped.gif";
  }
  if (nameLower.includes("bat")) {
    return "/BossesAndEnemies_sprite/cropped/bat_cropped.gif";
  }
  if (nameLower.includes("rat")) {
    return "/BossesAndEnemies_sprite/cropped/rat_cropped.gif";
  }
  if (nameLower.includes("crab")) {
    return "/BossesAndEnemies_sprite/cropped/crab_cropped.gif";
  }
  if (nameLower.includes("skull") || nameLower.includes("skeleton")) {
    return "/BossesAndEnemies_sprite/cropped/skull_cropped.png";
  }
  if (nameLower.includes("pebble") || nameLower.includes("boulder")) {
    return "/BossesAndEnemies_sprite/cropped/pebble_cropped.png";
  }
  if (nameLower.includes("mushroom")) {
    return "/BossesAndEnemies_sprite/cropped/mushroom_cropped.png";
  }
  if (nameLower.includes("golem")) {
    return "/BossesAndEnemies_sprite/cropped/golem_cropped.png";
  }

  // Fallback by Floor Cycle
  const cycle = floorOrLevel % 8;
  switch (cycle) {
    case 1:
      return "/BossesAndEnemies_sprite/cropped/slime_cropped.gif";
    case 2:
      return "/BossesAndEnemies_sprite/cropped/bat_cropped.gif";
    case 3:
      return "/BossesAndEnemies_sprite/cropped/rat_cropped.gif";
    case 4:
      return "/BossesAndEnemies_sprite/cropped/crab_cropped.gif";
    case 5:
      return "/BossesAndEnemies_sprite/cropped/skull_cropped.png";
    case 6:
      return "/BossesAndEnemies_sprite/cropped/pebble_cropped.png";
    case 7:
      return "/BossesAndEnemies_sprite/cropped/mushroom_cropped.png";
    default:
      return "/BossesAndEnemies_sprite/cropped/golem_cropped.png";
  }
}

/** Character Avatar Sprite Path from public/Character_sprite_placeholder/ */
export const CHARACTER_AVATAR_SPRITE =
  "/Character_sprite_placeholder/cropped/player-front.png";

export const CHARACTER_AVATAR_PREVIEW =
  "/Character_sprite_placeholder/cropped/player-front.png";
