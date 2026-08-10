import os
from PIL import Image

def main():
    base_dir = os.path.join("..", "..", "client", "public", "AIRA ICON")
    img_path = os.path.join(base_dir, "images (1).jpg")
    out_dir = os.path.join(base_dir, "cropped")

    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    try:
        with Image.open(img_path) as img:
            width, height = img.size
            # It's a 2x2 grid
            half_w = width // 2
            half_h = height // 2

            # Define bounding boxes: (left, upper, right, lower)
            box_tl = (0, 0, half_w, half_h) # Top-Left quadrant -> aira-neutral.png
            box_tr = (half_w, 0, width, half_h) # Top-Right quadrant -> aira-alert.png
            box_bl = (0, half_h, half_w, height) # Bottom-Left quadrant -> aira-annoyed.png
            box_br = (half_w, half_h, width, height) # Bottom-Right quadrant -> aira-happy.png

            img.crop(box_tl).save(os.path.join(out_dir, "aira-neutral.png"))
            print("Saved aira-neutral.png")
            img.crop(box_tr).save(os.path.join(out_dir, "aira-alert.png"))
            print("Saved aira-alert.png")
            img.crop(box_bl).save(os.path.join(out_dir, "aira-annoyed.png"))
            print("Saved aira-annoyed.png")
            img.crop(box_br).save(os.path.join(out_dir, "aira-happy.png"))
            print("Saved aira-happy.png")
    except Exception as e:
        print("Error cropping image:", e)

if __name__ == "__main__":
    main()
