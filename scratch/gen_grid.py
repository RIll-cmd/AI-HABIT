import os
import math
from PIL import Image, ImageDraw, ImageFont

icon_dir = r"d:\real ascend os\client\public\icons"
out_dir = r"d:\real ascend os\scratch"
os.makedirs(out_dir, exist_ok=True)

# get all pngs
files = [f for f in os.listdir(icon_dir) if f.endswith('.png')]
files.sort(key=lambda x: int(''.join(filter(str.isdigit, x))) if any(c.isdigit() for c in x) else 0)

batch_size = 100
font = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 20)

for i in range(0, len(files), batch_size):
    batch = files[i:i+batch_size]
    
    cols = 10
    rows = math.ceil(len(batch) / cols)
    
    cell_w = 200
    cell_h = 250
    
    img = Image.new('RGB', (cols * cell_w, rows * cell_h), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    for idx, f in enumerate(batch):
        col = idx % cols
        row = idx // cols
        
        icon_path = os.path.join(icon_dir, f)
        try:
            icon = Image.open(icon_path).convert('RGBA')
            # scale up if small
            icon = icon.resize((128, 128), Image.NEAREST)
            
            # paste
            x_offset = col * cell_w + (cell_w - 128) // 2
            y_offset = row * cell_h + 20
            
            # use a grey background square for visibility if icon has white
            draw.rectangle([x_offset, y_offset, x_offset+128, y_offset+128], fill=(220, 220, 220))
            
            img.paste(icon, (x_offset, y_offset), icon)
            
            # draw text
            text_x = col * cell_w + 20
            text_y = row * cell_h + 160
            draw.text((text_x, text_y), f, fill=(0,0,0), font=font)
        except Exception as e:
            print(f"Error processing {f}: {e}")
            
    out_path = os.path.join(out_dir, f"grid_{i//batch_size}.png")
    img.save(out_path)
    print(f"Saved {out_path}")
