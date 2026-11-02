import { readFile, writeFile } from "node:fs/promises";
import { MARKS, renderFoundation, skinMarks, skinTone, upload } from "../src/lib/youcam.ts";

const ROOT = "public/replay";
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ["elder", "portrait", "market", "freckles"];

async function save(url: string, path: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${path}`);
  await writeFile(path, Buffer.from(await res.arrayBuffer()));
}

for (const id of ids) {
  const calls: { path: string; ms: number }[] = [];
  const timed = async <T>(path: string, run: () => Promise<T>) => {
    const start = performance.now();
    const value = await run();
    calls.push({ path, ms: Math.round(performance.now() - start) });
    return value;
  };
  const dir = `${ROOT}/${id}`;
  const fileId = await timed("/v2.0/file", async () => upload(new Uint8Array(await readFile(`${dir}/bare.jpg`)), "image/jpeg"));
  const [masks, tone] = await Promise.all([
    timed("/v2.1/task/skin-analysis", () => skinMarks(fileId)),
    timed("/v2.0/task/skin-tone-analysis", () => skinTone(fileId)),
  ]);
  const vto = await timed("/v2.0/task/makeup-vto", () => renderFoundation(fileId, "#ffffff", 0.06));
  await Promise.all([...MARKS.map((m) => save(masks[m], `${dir}/bare-${m}.png`)), save(vto, `${dir}/vto-white.jpg`)]);
  await writeFile(`${dir}/tone.json`, JSON.stringify({ color: { skin_color: tone.skin } }));
  await writeFile(`${dir}/calls.json`, JSON.stringify({ at: new Date().toISOString(), calls }, null, 1));
  console.log(id, tone.skin, calls.map((c) => `${c.path} ${c.ms}ms`).join(", "));
}
