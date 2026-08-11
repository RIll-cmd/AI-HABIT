/**
 * Sprite Utility for Tower Enemies, Bosses, and Character Avatars.
 * Maps enemy names & levels to isolated sprite frames or animated GIFs.
 */

import { getEnemySpriteUrl } from "./spriteUtils";

export { getEnemySpriteUrl };

/**
 * Returns the public filepath for a given Tower enemy or Boss sprite.
 * Prioritizes animated GIF assets when available for high-energy combat previews.
 */
export function getEnemySpritePath(
  enemyName: string,
  floorOrLevel: number = 1,
  isBoss: boolean = false
): string {
  return getEnemySpriteUrl(enemyName, { floorOrLevel, isBoss });
}

/** Character Avatar Sprite Path from public/Character_sprite_placeholder/ */
export const CHARACTER_AVATAR_SPRITE =
  "/Character_sprite_placeholder/cropped/player-front.png";

export const CHARACTER_AVATAR_PREVIEW =
  "/Character_sprite_placeholder/cropped/player-front.png";
