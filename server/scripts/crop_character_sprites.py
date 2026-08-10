import os
from PIL import Image

def slice_spritesheet():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    input_path = os.path.join(base_dir, "..", "client", "public", "Character_sprite_placeholder", "Monster Pack Character (Free)", "Idle", "Character_Idle.png")
    output_dir = os.path.join(base_dir, "..", "client", "public", "Character_sprite_placeholder", "cropped")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    try:
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        print(f"Opened {input_path}, size: {width}x{height}")
        
        # 512x512 image, 4 rows, 4 columns -> 128x128 per frame
        frame_w = 128
        frame_h = 128
        
        # Typically RPG sprites:
        # Row 0: Down (Front)
        # Row 1: Left
        # Row 2: Right
        # Row 3: Up (Back)
        
        directions = [
            ("player-front.png", 0),
            ("player-left.png", 1),
            ("player-right.png", 2),
            ("player-back.png", 3),
        ]
        
        for name, row in directions:
            # Crop the first column (x=0) for the idle frame
            box = (0, row * frame_h, frame_w, (row + 1) * frame_h)
            frame = img.crop(box)
            
            # Trim transparency
            bbox = frame.getbbox()
            if bbox:
                frame = frame.crop(bbox)
            
            # Save
            out_path = os.path.join(output_dir, name)
            frame.save(out_path)
            print(f"Saved {name} to {out_path}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    slice_spritesheet()
