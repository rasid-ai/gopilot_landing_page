#!/usr/bin/env python3
"""Generate the favicon set from GoPilot's own mark.

The icons shipped with the first build were RASID's, copied over from the
saas-ui repo, so a GoPilot page showed the parent company's icon in the browser
tab and on a phone home screen. This regenerates all of them from
public/brand/gopilot-mark-1024.png, which is GoPilot's compass mark.

Run:  python scripts/make-favicons.py
Writes, all into public/:
  favicon-16x16.png  favicon-32x32.png  favicon.ico (16/32/48)
  apple-touch-icon.png (180, opaque)
  android-chrome-192x192.png  android-chrome-512x512.png

The mark is a thin-stroked compass inside an orbital ring. Downscaling it to
16px with a plain resize loses the ring entirely, so every size is produced with
LANCZOS from the 1024px original rather than from an intermediate.
"""

from pathlib import Path
import sys

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "brand" / "gopilot-mark-1024.png"
OUT = ROOT / "public"

# Apple refuses transparency on touch icons: iOS composites them onto black,
# which would turn the mark's transparent interior into a black tile. Brand
# white is the correct backdrop.
APPLE_BG = (255, 255, 255, 255)


def main() -> int:
    if not SRC.exists():
        print(f"missing source: {SRC}", file=sys.stderr)
        return 1

    src = Image.open(SRC).convert("RGBA")
    if src.width != src.height:
        print(f"warning: source is {src.width}x{src.height}, not square", file=sys.stderr)

    def scaled(size: int) -> Image.Image:
        return src.resize((size, size), Image.LANCZOS)

    for size in (16, 32):
        scaled(size).save(OUT / f"favicon-{size}x{size}.png", optimize=True)

    for size in (192, 512):
        scaled(size).save(OUT / f"android-chrome-{size}x{size}.png", optimize=True)

    # Flatten onto white rather than saving RGBA.
    apple = Image.new("RGBA", (180, 180), APPLE_BG)
    apple.alpha_composite(scaled(180))
    apple.convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)

    # Multi-resolution .ico. Pillow builds every listed size from the image it
    # is given, so hand it the full-resolution original.
    src.save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    for name in (
        "favicon-16x16.png",
        "favicon-32x32.png",
        "favicon.ico",
        "apple-touch-icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
    ):
        p = OUT / name
        print(f"  {name:32} {p.stat().st_size:>7,} bytes")

    return 0


if __name__ == "__main__":
    sys.exit(main())
