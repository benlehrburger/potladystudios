#!/usr/bin/env python3
"""Optimize gallery images for fast loading.

For every photo in images/garden|home|totems/ this makes two things:
  - the full-resolution file, re-saved as a progressive JPEG (quality 90,
    metadata stripped, longest edge capped at 1600px) — used by the lightbox
  - a lightweight thumbnail in a thumbs/ subfolder (longest edge 900px,
    quality 80) — used by the gallery grid

The grid loads the small thumbnail; tapping a piece loads the full file. At
grid size the thumbnail is indistinguishable from the original, so there is
no visible quality loss.

Idempotent: a photo is treated as "already optimized" once its thumbnail
exists, so re-running does NOT re-compress finished images (which would
slowly degrade them). Drop a new photo in, run this, commit. Use --force
to re-process everything (e.g. after changing the settings below).

Usage:
    python3 optimize-images.py            # optimize any new photos
    python3 optimize-images.py --force    # re-process every photo
"""

import os
import sys
import glob

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit(
        "Pillow is required. Install it with:  pip install Pillow\n"
        "(Then re-run: python3 optimize-images.py)"
    )

CATEGORIES = ["garden", "home", "totems"]
FULL_MAX_EDGE = 1600   # plenty for the lightbox, even on a retina phone
FULL_QUALITY = 90      # visually lossless
THUMB_MAX_EDGE = 900   # crisp in the grid at any screen density
THUMB_QUALITY = 80

ROOT = os.path.dirname(os.path.abspath(__file__))


def thumb_path(full_path):
    d, name = os.path.split(full_path)
    return os.path.join(d, "thumbs", name)


def save_jpeg(im, dest, max_edge, quality):
    # Bake any EXIF orientation into the pixels BEFORE stripping metadata —
    # otherwise a photo the phone stored sideways (with a rotate flag) would
    # display sideways once the flag is gone.
    im = ImageOps.exif_transpose(im)
    im = im.convert("RGB")  # drop alpha / EXIF so nothing rotates or bloats
    w, h = im.size
    if max(w, h) > max_edge:
        s = max_edge / max(w, h)
        im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    im.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)


def main():
    force = "--force" in sys.argv
    processed = skipped = 0

    for cat in CATEGORIES:
        cat_dir = os.path.join(ROOT, "images", cat)
        if not os.path.isdir(cat_dir):
            continue
        for full in sorted(glob.glob(os.path.join(cat_dir, "*.jp*g"))):
            thumb = thumb_path(full)
            if os.path.exists(thumb) and not force:
                skipped += 1
                continue
            before = os.path.getsize(full)
            # Re-save the full file (caps size, makes it progressive)...
            save_jpeg(Image.open(full), full, FULL_MAX_EDGE, FULL_QUALITY)
            # ...then derive the grid thumbnail from it.
            save_jpeg(Image.open(full), thumb, THUMB_MAX_EDGE, THUMB_QUALITY)
            rel = os.path.relpath(full, ROOT)
            print(
                f"  optimized {rel}  "
                f"{before // 1024}K -> {os.path.getsize(full) // 1024}K full, "
                f"{os.path.getsize(thumb) // 1024}K thumb"
            )
            processed += 1

    print(
        f"\nDone: {processed} optimized, {skipped} already done."
        + (" Re-run with --force to redo them." if skipped and not force else "")
    )


if __name__ == "__main__":
    main()
