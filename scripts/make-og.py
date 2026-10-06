#!/usr/bin/env python
"""
Generate public/og/gopilot-og.png to the layout §24.2 of docs/BUILD_SPEC.md
specifies: 1200x630, under 300 KB, wordmark top-left, headline + subhead on a
#F8F7F7 ground across the left 55%, and the demo's real composed final frame
(Sentinel-2 capture + the crimson field outlines) filling the right 45%.

Run:  python -I scripts/make-og.py <space-grotesk.ttf> <inter.ttf>

The field polygons are the same ten features components/demo/fieldPaths.ts
renders, parsed straight out of that file so the share card and the on-page map
can never drift. They are in the capture's 640x400 pixel space and are
transformed here by the same object-cover maths DemoMap.tsx applies in CSS.
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent

W, H = 1200, 630
PANEL_W = 540                      # the right 45% of 1200
TEXT_L = 80                        # §24.2 safe margin
TEXT_R = PANEL_W + 40              # gutter before the image panel
TEXT_W = (W - PANEL_W) - TEXT_L - 40

GROUND = (248, 247, 247)           # #F8F7F7
INK = (32, 29, 31)                 # #201D1F
SUB = (74, 74, 74)                 # #4A4A4A
BRAND = (0, 139, 106)              # #008B6A
MUTED = (107, 107, 107)
FIELD_FILL = (230, 25, 75)         # #e6194b, from fieldPaths.ts
FIELD_STROKE = (35, 35, 35)        # #232323

HEADLINE = 'The geospatial AI agent'
SUBHEAD = 'Ask in plain language. Get the layer back.'

SG_PATH, INTER_PATH = sys.argv[1], sys.argv[2]


def font(path, size, weight):
    f = ImageFont.truetype(path, size)
    # Both files are variable fonts; without an explicit instance PIL renders
    # the default master (Light for Space Grotesk, Regular for Inter).
    f.set_variation_by_axes([weight])
    return f


def font_inter(size, weight):
    f = ImageFont.truetype(INTER_PATH, size)
    f.set_variation_by_axes([float(size), weight])  # Inter: [opsz, wght]
    return f


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ''
    for word in words:
        trial = f'{cur} {word}'.strip()
        if draw.textlength(trial, font=fnt) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def wrap_sentences(draw, text, fnt, max_w):
    """Like wrap(), but prefer breaking between sentences. Greedy wrapping puts
    a lone 'back.' on line two, which looks like a mistake on a share card."""
    if draw.textlength(text, font=fnt) <= max_w:
        return [text]
    parts = [s.strip() + '.' for s in text.rstrip('.').split('. ')]
    if all(draw.textlength(p, font=fnt) <= max_w for p in parts):
        return parts
    return wrap(draw, text, fnt, max_w)


def parse_paths(src):
    """Pull the `d` attribute of every FIELD_PATHS entry. Each is a closed
    polygon of M/L commands only, so a flat coordinate scrape is exact."""
    out = []
    for d in re.findall(r"d:\s*'([^']+)'", src):
        pts = [(float(x), float(y)) for x, y in re.findall(r'[ML](-?[\d.]+) (-?[\d.]+)', d)]
        if len(pts) >= 3:
            out.append(pts)
    return out


def main():
    img = Image.new('RGB', (W, H), GROUND)

    # ---- right 45%: the real capture, object-cover + centre-crop ----------
    src = Image.open(ROOT / 'public' / 'demo' / 'sakaka-aoi@2x.jpg').convert('RGB')
    sw, sh = src.size
    scale = max(PANEL_W / sw, H / sh)
    scaled = src.resize((round(sw * scale), round(sh * scale)), Image.LANCZOS)
    off_x = (scaled.width - PANEL_W) // 2
    off_y = (scaled.height - H) // 2
    panel = scaled.crop((off_x, off_y, off_x + PANEL_W, off_y + H))

    # fieldPaths.ts coordinates are 640x400; map them through the same crop.
    k = scaled.width / 640.0
    pd = ImageDraw.Draw(panel)
    polys = parse_paths((ROOT / 'components' / 'demo' / 'fieldPaths.ts').read_text(encoding='utf-8'))
    for pts in polys:
        px = [(x * k - off_x, y * k - off_y) for x, y in pts]
        # Dark under-stroke then crimson, exactly as DemoMap layers them: the
        # bare crimson is only ~2.9:1 on sand and needs the halo to read.
        pd.line(px + [px[0]], fill=FIELD_STROKE, width=7, joint='curve')
        pd.line(px + [px[0]], fill=FIELD_FILL, width=4, joint='curve')

    img.paste(panel, (W - PANEL_W, 0))
    ImageDraw.Draw(img).line(
        [(W - PANEL_W, 0), (W - PANEL_W, H)], fill=(230, 226, 227), width=2
    )

    # ---- left: wordmark, headline, subhead -------------------------------
    draw = ImageDraw.Draw(img)

    f_mark = font(SG_PATH, 48, 700)
    f_by = font_inter(28, 500)
    f_head = font(SG_PATH, 72, 700)
    f_sub = font_inter(34, 500)

    draw.text((TEXT_L, 72), 'GoPilot', font=f_mark, fill=BRAND)
    mark_w = draw.textlength('GoPilot', font=f_mark)
    draw.text((TEXT_L + mark_w + 14, 88), 'by RASID', font=f_by, fill=MUTED)

    head_lines = wrap(draw, HEADLINE, f_head, TEXT_W)
    sub_lines = wrap_sentences(draw, SUBHEAD, f_sub, TEXT_W)
    head_lh, sub_lh = 80, 46

    block_h = len(head_lines) * head_lh + 26 + len(sub_lines) * sub_lh
    # Centre the block in the band between the wordmark and the 90px dead zone
    # at the bottom that LinkedIn and Discord crop or letterbox.
    y = 168 + max(0, ((H - 90) - 168 - block_h) // 2)

    for line in head_lines:
        draw.text((TEXT_L, y), line, font=f_head, fill=INK)
        y += head_lh
    y += 26
    for line in sub_lines:
        draw.text((TEXT_L, y), line, font=f_sub, fill=SUB)
        y += sub_lh

    out = ROOT / 'public' / 'og' / 'gopilot-og.png'
    out.parent.mkdir(parents=True, exist_ok=True)
    # Palette-quantise: the left 55% is flat colour and type, so 256 colours is
    # visually lossless there and keeps the file far under the 300 KB ceiling
    # that a full-colour PNG of a satellite photo would blow straight past.
    img.convert('P', palette=Image.ADAPTIVE, colors=256).save(out, optimize=True)

    print(f'wrote {out}  {out.stat().st_size} bytes  {Image.open(out).size}')
    print(f'polygons drawn: {len(polys)}  headline lines: {len(head_lines)}  '
          f'subhead lines: {len(sub_lines)}  text ends y={y}')


if __name__ == '__main__':
    main()
