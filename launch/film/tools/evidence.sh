#!/usr/bin/env bash
# Make blind-critic evidence for one film: hook, sheet, end, cuts, sound. Usage: tools/evidence.sh <film.mp4> <outdir> <name>
set -e
export PATH="/c/Users/mukes/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-essentials_build/bin:$PATH"
f=$1; o=$2; n=$3; mkdir -p "$o"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
ffmpeg -v error -y -t 3 -i "$f" -vf "fps=4,scale=320:180,tile=6x2" -frames:v 1 "$o/$n-hook.png"
ffmpeg -v error -y -i "$f" -vf "fps=48/$d,scale=320:180,tile=8x6" -frames:v 1 "$o/$n-sheet.png"
ffmpeg -v error -y -sseof -4 -i "$f" -vf "fps=2,scale=320:180,tile=4x2" -frames:v 1 "$o/$n-end.png"
ffmpeg -hide_banner -i "$f" -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep -o "pts_time:[0-9.]*" | cut -d: -f2 > "$o/$n-cuts.txt"
/c/Users/mukes/honey/ambient-launch-refs/.venv/Scripts/earshot.exe timeline "$f" > "$o/$n-sound.txt" 2>/dev/null
