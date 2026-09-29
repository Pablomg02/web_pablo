#!/usr/bin/env python3
"""Prepare a photo for src/gallery/: fix rotation, strip metadata, cap at 2400 px.

Usage:  python3 .claude/skills/gallery-photo/prepare-photo.py INPUT OUTPUT [MAX_SIDE]
Example: python3 .claude/skills/gallery-photo/prepare-photo.py ~/Downloads/IMG_1.jpg src/gallery/valencia-2025.jpeg

- Applies the EXIF rotation, then drops ALL metadata (GPS, camera, dates),
  because the original file is committed to the repo.
- Only shrinks: an image already smaller than MAX_SIDE keeps its size.
- Writes a progressive JPEG (quality 88), the same kind the other photos are.
"""
import sys
from PIL import Image, ImageOps

if len(sys.argv) not in (3, 4):
    sys.exit(__doc__)

source, target = sys.argv[1], sys.argv[2]
max_side = int(sys.argv[3]) if len(sys.argv) == 4 else 2400

image = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
image.thumbnail((max_side, max_side), Image.LANCZOS)  # keeps aspect, never enlarges
image.save(target, "JPEG", quality=88, progressive=True, optimize=True)  # no exif= : metadata dropped
print(f"{target}: {image.width}x{image.height}")
