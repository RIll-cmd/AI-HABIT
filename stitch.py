import os
import re
from PIL import Image, ImageDraw, ImageFont

icons_dir = "client/public/icons"
files = [f for f in os.listdir(icons_dir) if f.endswith('.png') and f != 'all_icons.png']
# Sort naturally (Icon1, Icon2, ..., Icon10)
files.sort(key=lambda f: int(re.search(r'\d+', f).group()) if re.search(r'\d+', f) else 0)

img_size = 48 # give some space
cols = 20
rows = (len(files) + cols - 1) // cols

result = Image.new('RGBA', (cols * img_size, rows * img_size), (0, 0, 0, 255))
draw = ImageDraw.Draw(result)

for i, f in enumerate(files):
    try:
        img = Image.open(os.path.join(icons_dir, f)).convert("RGBA")
        img = img.resize((32, 32))
        x = (i % cols) * img_size
        y = (i // cols) * img_size
        
        # Paste image
        result.paste(img, (x + 8, y), img)
        
        # Draw label
        label = re.search(r'\d+', f).group() if re.search(r'\d+', f) else f
        draw.text((x + 8, y + 34), label, fill="white")
    except Exception as e:
        print(f"Error processing {f}: {e}")

result.save(os.path.join(icons_dir, 'all_icons.png'))
print(f"Saved {len(files)} icons to all_icons.png")
