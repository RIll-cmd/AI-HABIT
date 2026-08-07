import React from 'react';

interface SkillIconProps {
  iconId: string | null;
  size?: number;
  className?: string;
}

export const SkillIcon: React.FC<SkillIconProps> = ({ iconId, size = 48, className = '' }) => {
  // Base tile size from the original spritesheet is 32x32
  const TILE_SIZE = 32;
  const SPRITESHEET_URL = '/skills_icon/Free_Skills.png';

  // Extract Row and Col from the "RowX_ColY" string
  let row = 1;
  let col = 1;

  if (iconId) {
    const match = iconId.match(/Row(\d+)_Col(\d+)/);
    if (match) {
      row = parseInt(match[1], 10);
      col = parseInt(match[2], 10);
    }
  }

  // Calculate the background position in raw pixels (before scaling)
  const xPos = -(col - 1) * TILE_SIZE;
  const yPos = -(row - 1) * TILE_SIZE;

  // We want to scale the 32x32 sprite to our target `size` (e.g. 48 or 64)
  // The background size needs to scale the entire sheet proportionally.
  // We assume the sheet has exactly 10 rows and 10 columns based on common packs,
  // but wait, standard CSS doesn't need to know the full sheet size if we just use transform,
  // OR we can just set width/height to TILE_SIZE and scale with CSS transforms!
  // It's cleaner to use a 32x32 div and scale it.

  const scale = size / TILE_SIZE;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        className="absolute top-0 left-0"
        style={{
          width: `${TILE_SIZE}px`,
          height: `${TILE_SIZE}px`,
          backgroundImage: `url('${SPRITESHEET_URL}')`,
          backgroundPosition: `${xPos}px ${yPos}px`,
          backgroundRepeat: 'no-repeat',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );
};
