import os
from PIL import Image, ImageSequence

def make_gif_transparent(input_path, output_path, is_bg_fn):
    print(f"Processing {input_path}...")
    img = Image.open(input_path)
    processed_frames = []
    durations = []
    
    for frame in ImageSequence.Iterator(img):
        durations.append(frame.info.get('duration', 100))
        rgba = frame.convert('RGBA')
        datas = list(rgba.getdata())
        new_data = []
        for item in datas:
            # item is (R, G, B, A)
            if is_bg_fn(item):
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append(item)
        rgba.putdata(new_data)
        processed_frames.append(rgba)
    
    # Save as animated GIF with palette transparency
    output_frames = []
    for f in processed_frames:
        alpha = f.split()[3]
        # mask of transparent pixels (alpha <= 10)
        mask = Image.eval(alpha, lambda a: 255 if a <= 10 else 0)
        
        # Quantize RGB to 255 colors (saving 1 slot for transparent index 255)
        p_frame = f.convert('RGB').convert('P', palette=Image.ADAPTIVE, colors=255)
        p_frame.paste(255, mask)
        p_frame.info['transparency'] = 255
        output_frames.append(p_frame)

    output_frames[0].save(
        output_path,
        save_all=True,
        append_images=output_frames[1:],
        loop=0,
        duration=durations,
        disposal=2,
        transparency=255
    )
    print(f"Successfully saved transparent GIF to {output_path}")

def is_bg_gold_gem(item):
    r, g, b, a = item
    if a < 10:
        return True
    # Dark/black box or near white
    if (r < 25 and g < 25 and b < 25) or (r > 240 and g > 240 and b > 240):
        return True
    return False

def is_bg_3rd(item):
    r, g, b, a = item
    if a < 10:
        return True
    # Peach/salmon background or near black or near white
    if (r > 190 and g > 170 and b > 160) or (r < 25 and g < 25 and b < 25) or (r > 240 and g > 240 and b > 240):
        return True
    return False

if __name__ == "__main__":
    make_gif_transparent("client/public/coin icons/gold_icon.gif", "client/public/coin icons/gold_icon.gif", is_bg_gold_gem)
    make_gif_transparent("client/public/coin icons/gem_icon.gif", "client/public/coin icons/gem_icon.gif", is_bg_gold_gem)
    make_gif_transparent("client/public/coin icons/3rd_currency.gif", "client/public/coin icons/3rd_currency.gif", is_bg_3rd)
