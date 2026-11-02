"""Mix the film's soundtrack: one MusicGen score, muffled until the turn, earshot effects, one loudness pass.

Usage: python tools/mix.py   (writes assets/mix.wav)
Times are seconds on the root timeline; swells land their peak at their time, everything else its onset.
"""
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
SFX = ROOT / "assets" / "sfx"
EARSHOT = r"C:\Users\mukes\honey\ambient-launch-refs\.venv\Scripts\earshot.exe"
FFMPEG = r"C:\Users\mukes\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-essentials_build\bin\ffmpeg.exe"
SR = 48000
LENGTH = 36.0
SWELLS = {"whoosh_big", "whoosh_fast", "swish", "swipe"}

SCORE = ("warm-long-5", 0.0, 0.0, 36.0)
OPEN = 8.5

DUCKS = [
    (17.25, 17.8, 0.12),
    (17.8, 19.6, 0.55),
    (33.3, 33.8, 0.4),
]

CUES = [
    ("swipe/cloth", 0.12, 0.35),
    ("pro_tap/soft", 0.1, 0.4),
    ("swish/stick", 2.64, 0.3),
    ("swish/cane", 2.84, 0.28),
    ("swish/blade", 3.04, 0.3),
    ("pro_tap/soft", 3.8, 0.35),
    ("whoosh_big/swell", 5.15, 0.5),
    ("pro_pop_in/round", 5.6, 0.5),
    ("pro_pop_in/deep", 6.25, 0.45),
    ("pro_tap/soft", 8.6, 0.35),
    ("swish/zing", 9.95, 0.25),
    ("whoosh_fast/tight", 10.3, 0.25),
    ("pro_pop_in/airy", 10.55, 0.45),
    ("whoosh_fast/tight", 11.5, 0.35),
    ("pro_hover_tick/glass", 12.1, 0.3),
    ("fit/snap/switch_flip", 12.65, 0.6),
    ("click/thock", 12.66, 0.45),
    ("pro_tap/soft", 12.9, 0.3),
    ("whoosh_big/swell", 14.4, 0.45),
    ("pro_impact/air", 14.4, 0.3),
    ("swipe/glide", 15.45, 0.35),
    ("pro_tap/soft", 16.0, 0.3),
    ("pro_hover_tick/glass", 16.7, 0.3),
    ("pro_hover_tick/glass", 16.92, 0.26),
    ("sub_drop/pro", 17.8, 0.95),
    ("pro_impact/deep", 17.8, 0.7),
    ("pro_tap/knock", 18.12, 0.3),
    ("pro_impact/air", 18.42, 0.45),
    ("swipe/paper", 20.7, 0.28),
    ("pro_tap/knock", 20.85, 0.16),
    ("pro_tap/glass", 20.95, 0.16),
    ("pro_tap/knock", 21.05, 0.16),
    ("whoosh_fast/sleeve", 21.85, 0.3),
    ("pro_pop/tink", 22.45, 0.4),
    ("swipe/velvet", 24.7, 0.3),
    ("pro_impact/air", 26.1, 0.6),
    ("pro_shimmer/m1", 26.55, 0.35),
    ("swipe/velvet", 28.6, 0.22),
    ("pro_impact/air", 31.6, 0.3),
    ("pro_tap/soft", 31.7, 0.2),
    ("logo_sting/soft_bloom", 33.8, 0.55),
]


def load(path):
    audio, sr = sf.read(path, always_2d=True)
    if sr != SR:
        raise SystemExit(f"{path} is {sr} Hz; render at {SR}")
    return audio if audio.shape[1] == 2 else np.repeat(audio, 2, axis=1)


def resample(path):
    out = path.with_suffix(".48k.wav")
    if not out.exists():
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(path), "-ar", str(SR), "-ac", "2", str(out)], check=True)
    return load(out)


def effect(name):
    path = SFX / (name.replace("/", "_") + ".wav")
    if not path.exists():
        SFX.mkdir(parents=True, exist_ok=True)
        subprocess.run([EARSHOT, "sfx", "render", name, "-o", str(path), "--sr", str(SR)], check=True, capture_output=True)
    audio = load(path)
    level = np.abs(audio).max(axis=1)
    if name.split("/")[0] in SWELLS:
        return audio, int(np.argmax(level))
    return audio, int(np.argmax(level > 0.3 * level.max()))


def place(mix, audio, at):
    start = max(0, int(at * SR))
    end = min(len(mix), start + len(audio))
    mix[start:end] += audio[: end - start]


def bed(name, at, offset, dur, fade_in=0.02, fade_out=0.6):
    audio = resample(ROOT / "assets" / "music" / f"{name}.wav")[int(offset * SR) : int((offset + dur) * SR)].copy()
    n = len(audio)
    ramp = np.ones(n)
    ramp[: int(fade_in * SR)] = np.linspace(0, 1, int(fade_in * SR))
    ramp[n - int(fade_out * SR) :] = np.linspace(1, 0, int(fade_out * SR))
    return audio * ramp[:, None], at


mix = np.zeros((int(LENGTH * SR), 2))
music = np.zeros_like(mix)
name, at, offset, dur = SCORE
audio, at = bed(name, at, offset, dur, fade_out=1.5)
muffled = ROOT / "assets" / "music" / f"{name}.muffled.wav"
subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(ROOT / "assets" / "music" / f"{name}.48k.wav"), "-af", "lowpass=f=520,lowpass=f=520", str(muffled)], check=True)
closed = load(muffled)[int(offset * SR) : int((offset + dur) * SR)]
mix_in = np.clip((np.arange(len(audio)) / SR - (OPEN - 0.4)) / 0.4, 0, 1)[:, None]
place(music, (closed * 0.75 * (1 - mix_in) + audio * mix_in) * 0.5, at)

gain = np.ones(len(music))
for start, end, level in DUCKS:
    a, b = int(start * SR), int(end * SR)
    ramp = int(0.08 * SR)
    gain[a:b] = np.minimum(gain[a:b], level)
    gain[a - ramp : a] = np.minimum(gain[a - ramp : a], np.linspace(1, level, ramp))
    gain[b : b + ramp] = np.minimum(gain[b : b + ramp], np.linspace(level, 1, ramp))
mix += music * gain[:, None]

for name, at, level in CUES:
    audio, peak = effect(name)
    place(mix, audio * level, at - peak / SR)

raw = ROOT / "assets" / "mix-raw.wav"
sf.write(raw, mix, SR, subtype="FLOAT")
subprocess.run(
    [FFMPEG, "-v", "error", "-y", "-i", str(raw), "-af", "loudnorm=I=-15:TP=-1.5:LRA=11:linear=true,alimiter=limit=0.8:attack=1:release=60:level=false", "-ar", str(SR), str(ROOT / "assets" / "mix.wav")],
    check=True,
)
print("wrote", ROOT / "assets" / "mix.wav")
