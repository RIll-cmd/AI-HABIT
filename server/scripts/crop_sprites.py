import os
from PIL import Image

def crop_sprite_sheets():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "client", "public", "BossesAndEnemies_sprite"))
    output_dir = os.path.join(base_dir, "cropped")
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Base Directory: {base_dir}")
    print(f"Output Directory: {output_dir}")

    # Slicing configurations: (source_rel_path, frame_width, frame_height, output_filename)
    configs = [
        # Bosses
        ("Gollux/gollux_idle.png", 128, 128, "gollux_cropped.png"),
        ("wizard idle.png", 80, 80, "wizard_cropped.png"),
        ("Necromancer/Idle/spr_NecromancerIdle_strip50.png", 96, 96, "necromancer_cropped.png"),
        ("Necromancer_creativekind-Sheet.png", 160, 128, "necromancer_sheet_cropped.png"),
        ("NightBorne.png", 80, 80, "nightborne_cropped.png"),
        ("Bringer-Of-Death/Individual Sprite/Idle/Bringer-of-Death_Idle_1.png", None, None, "bringer_of_death_cropped.png"),

        # Regular Guardians
        ("Slime/SlimeComplete.gif", None, None, "slime_cropped.gif"),
        ("Bat/BatComplete.gif", None, None, "bat_cropped.gif"),
        ("Rat/RatComplete.gif", None, None, "rat_cropped.gif"),
        ("Crab/CrabComplete.gif", None, None, "crab_cropped.gif"),
        ("Skull/Bones_SingleSkull_Fly.png", 64, 128, "skull_cropped.png"),
        ("Pebble/Pebble_Idle.png", None, None, "pebble_cropped.png"),
        ("Forest_Monsters_FREE/Mushroom/Mushroom with VFX/Mushroom-Idle.png", None, None, "mushroom_cropped.png"),
        ("Golems_Free_Version/Golem_1/Orange/No_Swoosh_VFX/Golem_1_idle.png", None, None, "golem_cropped.png"),
    ]

    for rel_path, frame_w, frame_h, out_name in configs:
        src_path = os.path.join(base_dir, rel_path)
        dest_path = os.path.join(output_dir, out_name)

        if not os.path.exists(src_path):
            print(f"Skipping (not found): {src_path}")
            continue

        im = Image.open(src_path)
        
        if frame_w and frame_h:
            # Crop 1st frame (top-left)
            box = (0, 0, min(frame_w, im.width), min(frame_h, im.height))
            cropped_im = im.crop(box)
            cropped_im.save(dest_path)
            print(f"Successfully cropped [{out_name}] from [{rel_path}] ({frame_w}x{frame_h})")
        else:
            # Single frame image or GIF - save directly
            im.save(dest_path)
            print(f"Copied single frame/animation [{out_name}] from [{rel_path}]")

    print("\nAll sprite sheets successfully cropped into public/BossesAndEnemies_sprite/cropped/")

if __name__ == "__main__":
    crop_sprite_sheets()
