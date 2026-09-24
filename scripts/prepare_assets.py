from __future__ import annotations

import io
import os
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
IMAGES = PUBLIC / "images"
FONTS = ROOT / "public" / "fonts"

LOGO_CANDIDATES = [
    Path(r"C:\Users\lirre\.cursor\projects\c-Users-lirre-LirreyAutomations\assets\c__Users_lirre_AppData_Roaming_Cursor_User_workspaceStorage_be44545277e1ffdcd3773b28aa77b935_images_Lirrey_Dvora_Logo-684abe60-f0d8-4885-b623-bcbb1ef4cc0e.png"),
    ROOT / "assets" / "logo-source.png",
]

PHOTOS = {
    "hero": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1800&q=80",
    "industry-retreat": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80",
    "industry-workshop": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
    "industry-studio": "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1400&q=80",
    "industry-hospitality": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80",
    "about": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80",
}

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"


def download(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as res:
        return res.read()


def find_logo() -> Path:
    for path in LOGO_CANDIDATES:
        if path.exists():
            return path
    raise FileNotFoundError("Logo source not found")


def knockout_black(src: Path) -> Image.Image:
    im = Image.open(src).convert("RGBA")
    pixels = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            luma = 0.299 * r + 0.587 * g + 0.114 * b
            greenish = g - r
            if luma < 18 and greenish < 6:
                pixels[x, y] = (0, 0, 0, 0)
            elif luma < 36 and greenish < 4:
                alpha = int(min(255, luma * 8))
                pixels[x, y] = (r, g, b, alpha)
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    return im


def recolor_logo(im: Image.Image, target=(247, 243, 234)) -> Image.Image:
    out = im.copy()
    pixels = out.load()
    w, h = out.size
    tr, tg, tb = target
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            # keep gold-ish pixels
            if r > 140 and g > 90 and b < 120 and r > b + 30:
                continue
            pixels[x, y] = (tr, tg, tb, a)
    return out


def save_webp(im: Image.Image, dest: Path, width: int, quality: int = 82) -> None:
    clone = im.copy()
    clone.thumbnail((width, int(width * 1.4)), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    clone.save(dest, "WEBP", quality=quality, method=6)


def make_og(logo: Image.Image, font_path: Path | None) -> None:
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), "#F7F3EA")
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, 18, h), fill="#172522")
    draw.rectangle((0, h - 18, w, h), fill="#D9A83F")

    mark = logo.copy()
    mark.thumbnail((280, 280), Image.Resampling.LANCZOS)
    img.paste(mark, (80, 150), mark)

    font_lg = ImageFont.truetype(str(font_path), 54) if font_path else ImageFont.load_default()
    font_sm = ImageFont.truetype(str(font_path), 28) if font_path else ImageFont.load_default()

    title = "העסק שלך גדל."
    subtitle = "בואי נדאג שהדרך שבה הוא מתנהל תגדל איתו."
    brand = "לירי דבורה  ·  אוטומציות לעסקי Wellness"

    draw.text((1110, 210), title, font=font_lg, fill="#172522", anchor="ra")
    draw.text((1110, 285), subtitle, font=font_sm, fill="#30483D", anchor="ra")
    draw.text((1110, 480), brand, font=font_sm, fill="#68736D", anchor="ra")

    img.save(PUBLIC / "og.png", "PNG", optimize=True)

    icon = Image.new("RGBA", (180, 180), "#F7F3EA")
    small = logo.copy()
    small.thumbnail((150, 150), Image.Resampling.LANCZOS)
    x = (180 - small.width) // 2
    y = (180 - small.height) // 2
    icon.paste(small, (x, y), small)
    icon.save(PUBLIC / "apple-touch-icon.png", "PNG")


def load_font() -> Path | None:
    FONTS.mkdir(parents=True, exist_ok=True)
    dest = FONTS / "Assistant-SemiBold.ttf"
    if not dest.exists():
        url = "https://github.com/google/fonts/raw/main/ofl/assistant/Assistant%5Bwght%5D.ttf"
        try:
            dest.write_bytes(download(url))
        except Exception:
            segoe = Path(r"C:\Windows\Fonts\segoeuib.ttf")
            return segoe if segoe.exists() else None
    return dest


def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)
    logo = knockout_black(find_logo())
    logo.save(IMAGES / "logo.png", "PNG")
    recolor_logo(logo).save(IMAGES / "logo-light.png", "PNG")

    for name, url in PHOTOS.items():
        raw = Image.open(io.BytesIO(download(url))).convert("RGB")
        if name == "hero":
            save_webp(raw, IMAGES / "hero.webp", 1600, 80)
            save_webp(raw, IMAGES / "hero-800.webp", 800, 78)
        elif name == "about":
            save_webp(raw, IMAGES / "about.webp", 1200, 82)
            save_webp(raw, IMAGES / "about-800.webp", 800, 80)
        else:
            save_webp(raw, IMAGES / f"{name}.webp", 1100, 80)

    make_og(logo, load_font())
    print("assets ready")


if __name__ == "__main__":
    main()
