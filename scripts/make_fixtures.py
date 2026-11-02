"""Build the replay fixtures in public/replay/.

Replay mode stands in for the YouCam API and for a real bathroom-mirror session
when no key is set. Each subject gets:

- bare.jpg: the face before any sunscreen, with skin-analysis style masks
  (age_spot, redness, acne) and a skin-tone-analysis style tone.json.
- swiped.jpg: one cheek swiped with the first product, under a different light.
- swiped2.jpg: the other product the app asks for next.
- retake.jpg: a swipe under side light that the gate should refuse.
- retest.jpg: a second bare photo, which must read Invisible.
- vto-white.jpg: a white foundation over the whole face, for the mock server's
  makeup try-on answer.

The film is a local filter: a feathered, rub-in streaked layer mixed toward the
product colour in linear light. It is a stand-in for real sunscreen and the app
labels every replay result as filter-made.

Run: python scripts/make_fixtures.py
"""

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts" / "sources"
OUT = ROOT / "public" / "replay"
W, H = 1080, 1350
LANDMARKS = json.loads((SRC / "landmarks.json").read_text())

SUBJECTS = {
    "elder": {
        "credit": "Ferdinand Reus",
        "license": "CC BY-SA 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Elderly_Gambian_woman_face_portrait.jpg",
        "treated": "left",
        "swipes": [("bare-zinc", "#f3f0eb", 0.067), ("clearweight", "#f4f2ee", 0.004)],
    },
    "market": {
        "credit": "Alberto Buscató Vázquez",
        "license": "CC BY-SA 4.0",
        "source": "https://commons.wikimedia.org/wiki/File:Indian_woman_portrait.jpg",
        "treated": "left",
        "swipes": [("bare-zinc", "#f3f0eb", 0.07), ("clearweight", "#f4f2ee", 0.0085)],
    },
    "portrait": {
        "credit": "Heath Cajandig",
        "license": "CC BY 2.0",
        "source": "https://commons.wikimedia.org/wiki/File:Blonde_close_up_(34768208633).jpg",
        "treated": "right",
        "swipes": [("bare-zinc", "#f3f0eb", 0.06), ("clearweight", "#f4f2ee", 0.005)],
    },
    "freckles": {
        "credit": "Christopher Harris",
        "license": "CC0",
        "source": "https://commons.wikimedia.org/wiki/File:Smith_Mountain_Lake_redhead_(Unsplash).jpg",
        "treated": "left",
        "swipes": [("bare-zinc", "#f3f0eb", 0.075), ("clearweight", "#f4f2ee", 0.008)],
    },
}

# Per photo: exposure gain, warmth (+ is warmer), dx, dy, scale, side light.
LIGHT = {
    "bare": (1.00, 0.00, 0, 0, 1.000, 0.0),
    "swiped": (0.93, 0.03, 6, -4, 1.008, 0.0),
    "swiped2": (1.02, -0.01, -4, 3, 0.997, 0.0),
    "retake": (1.00, 0.01, 3, 2, 1.002, 0.55),
    "retest": (0.97, 0.015, 5, -3, 1.006, 0.0),
}

M_RGB_XYZ = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
WHITE = np.array([0.95047, 1.0, 1.08883])


def to_linear(rgb):
    c = rgb / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_srgb(lin):
    c = np.where(lin <= 0.0031308, 12.92 * lin, 1.055 * np.clip(lin, 0, None) ** (1 / 2.4) - 0.055)
    return np.clip(c * 255, 0, 255)


def srgb_to_lab(rgb):
    xyz = to_linear(rgb) @ M_RGB_XYZ.T / WHITE
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def hex_rgb(h):
    return np.array([int(h[i : i + 2], 16) for i in (1, 3, 5)], float)


def oval_mask(points):
    img = Image.new("L", (W, H), 0)
    ImageDraw.Draw(img).polygon([tuple(p) for p in points], fill=255)
    return np.asarray(img) > 127


def mid_x(lm, y):
    top, chin = np.array(lm["oval"][0], float), np.array(lm["oval"][18], float)
    return top[0] + (chin[0] - top[0]) * (y - top[1]) / (chin[1] - top[1])


def film_mask(lm, side, seed):
    """Where the swipe landed: a feathered cheek-sized blob with rub-in streaks."""
    rng = np.random.default_rng(seed)
    cx, cy = lm[side]
    r = 0.085 * lm["faceWidth"]
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    wobble = 1 + 0.12 * np.sin(np.arctan2(yy - cy, xx - cx) * 3 + rng.uniform(0, 6))
    blob = ((xx - cx) / (3.0 * r)) ** 2 + ((yy - cy - 0.4 * r) / (2.6 * r)) ** 2 <= wobble**2
    blob &= oval_mask(lm["oval"]) & (yy > cy - 1.1 * r)
    margin = 0.06 * lm["faceWidth"]
    mx = mid_x(lm, yy)
    blob &= (xx < mx - margin) if side == "left" else (xx > mx + margin)
    soft = ndi.gaussian_filter(blob.astype(float), 0.35 * r)
    streaks = ndi.gaussian_filter(rng.normal(0, 1, (H, W)), (1.2, 7))
    streaks /= streaks.std() + 1e-9
    return np.clip(soft * (1 + 0.07 * streaks), 0, 1)


def apply_film(rgb, mask, hex_, opacity):
    """Mix toward the film colour in linear light, heavier where film pools in creases."""
    lab = srgb_to_lab(rgb)
    local = ndi.gaussian_filter(lab[..., 0], 6)
    pooling = 1 + 0.35 * np.clip((local - lab[..., 0]) / 8, 0, 1)
    o = np.clip(opacity * mask * pooling, 0, 1)[..., None]
    lin = to_linear(rgb) * (1 - o) + to_linear(hex_rgb(hex_)) * o
    return to_srgb(lin)


def jitter(rgb, gain, warm, dx, dy, scale, side):
    ramp = 1 + side * (0.5 - np.arange(W)[None, :, None] / W)
    out = rgb * gain * ramp
    out[..., 0] *= 1 + warm
    out[..., 2] *= 1 - warm
    img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    sw, sh = int(W * scale * 1.03), int(H * scale * 1.03)
    img = img.resize((sw, sh), Image.LANCZOS)
    left, top = (sw - W) // 2 - dx, (sh - H) // 2 - dy
    canvas = Image.new("RGB", (W, H))
    canvas.paste(img, (-left, -top))
    return np.asarray(canvas).astype(float)


def soft(x, lo, hi):
    return np.clip((x - lo) / (hi - lo), 0, 1)


def marks(rgb, lm):
    """Approximate skin-analysis masks, in the API's alpha-PNG shape."""
    region = ndi.binary_erosion(oval_mask(lm["oval"]), iterations=14)
    lab = srgb_to_lab(rgb)
    L, a = lab[..., 0], lab[..., 1]
    ref = region.astype(float)
    norm = ndi.gaussian_filter(ref, 25) + 1e-6
    L_med = ndi.gaussian_filter(L * ref, 25) / norm
    a_med = ndi.gaussian_filter(a * ref, 25) / norm
    red = ndi.gaussian_filter(a - a_med, 3)
    spots = ndi.gaussian_filter(L_med - L, 2.0) - ndi.gaussian_filter(L_med - L, 9.0)
    bumps = ndi.gaussian_filter(a - a_med, 1.5) - ndi.gaussian_filter(a - a_med, 6)
    return {
        "age_spot": soft(spots, 1.4, 5.0) * soft(L_med - L, 1.0, 6.0) * region,
        "redness": soft(red, 2.5, 9.0) * region,
        "acne": soft(bumps, 2.0, 5.0) * region,
    }


def save_png(mask, path):
    rgba = np.zeros((H, W, 4), np.uint8)
    rgba[..., :3] = 255
    rgba[..., 3] = (np.clip(mask, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(path, optimize=True)


def to_hex(rgb):
    return "#" + "".join(f"{int(round(v)):02x}" for v in rgb)


def tone(rgb, lm):
    def median_in(cx, cy, r):
        yy, xx = np.mgrid[0:H, 0:W]
        sel = (xx - cx) ** 2 + (yy - cy) ** 2 <= r * r
        return np.median(rgb[sel], axis=0)

    r = 0.085 * lm["faceWidth"]
    skin = (median_in(*lm["left"], r) + median_in(*lm["right"], r)) / 2
    return {"skin_color": to_hex(skin)}


def build(key, subject):
    lm = LANDMARKS[key]
    base = np.asarray(Image.open(SRC / f"{key}.jpg").convert("RGB")).astype(float)
    folder = OUT / key
    folder.mkdir(parents=True, exist_ok=True)
    side = subject["treated"]
    swipe_mask = film_mask(lm, side, seed=len(key))

    shots = {"bare": base, "retest": base}
    films = []
    for name, (product, hex_, opacity) in zip(("swiped", "swiped2"), subject["swipes"]):
        shots[name] = apply_film(base, swipe_mask, hex_, opacity)
        films.append({"photo": f"{name}.jpg", "productId": product, "hex": hex_, "opacity": opacity})
    shots["retake"] = shots["swiped"]

    for name, rgb in shots.items():
        Image.fromarray(jitter(rgb, *LIGHT[name]).astype(np.uint8)).save(folder / f"{name}.jpg", quality=90)
    Image.fromarray(jitter(shots["swiped"], *LIGHT["bare"]).astype(np.uint8)).save(folder / "film.jpg", quality=90)

    face = ndi.gaussian_filter(oval_mask(lm["oval"]).astype(float), 6)
    vto = apply_film(jitter(base, *LIGHT["bare"]), face, "#ffffff", 0.06)
    Image.fromarray(vto.astype(np.uint8)).save(folder / "vto-white.jpg", quality=90)

    bare_masks = marks(base, lm)
    for k, m in bare_masks.items():
        save_png(m, folder / f"bare-{k}.png")
    (folder / "tone.json").write_text(json.dumps({"color": tone(base, lm)}))

    return {
        "id": key,
        "credit": subject["credit"],
        "license": subject["license"],
        "source": subject["source"],
        "treated": side,
        "bare": "bare.jpg",
        "masks": [f"bare-{k}.png" for k in bare_masks],
        "tone": "tone.json",
        "swipes": films,
        "retake": "retake.jpg",
        "retest": "retest.jpg",
    }


def main():
    for old in OUT.glob("*/*"):
        old.unlink()
    manifest = [build(k, s) for k, s in SUBJECTS.items()]
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding="utf-8")
    for m in manifest:
        print(m["id"], json.loads((OUT / m["id"] / "tone.json").read_text()))


if __name__ == "__main__":
    main()
