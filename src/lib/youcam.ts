import "server-only";

export const HOST = process.env.YOUCAM_API_HOST ?? "https://yce-api-01.makeupar.com/s2s";

export const liveKey = () => process.env.YOUCAM_API_KEY?.trim() || null;

export class YouCamError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 502,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = liveKey();
  if (!key) throw new YouCamError("no_key", "Set YOUCAM_API_KEY to run live.", 409);
  const res = await fetch(`${HOST}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new YouCamError(body.error_code ?? `http_${res.status}`, body.error ?? res.statusText, res.status);
  return body.data as T;
}

type UploadSlot = { file_id: string; requests: { method: string; url: string; headers: Record<string, string> }[] };

export async function upload(bytes: Uint8Array, contentType: string) {
  const { files } = await call<{ files: UploadSlot[] }>("/v2.0/file", {
    method: "POST",
    body: JSON.stringify({ files: [{ content_type: contentType, file_name: `capture.${contentType.split("/")[1]}`, file_size: bytes.byteLength }] }),
  });
  const [slot] = files;
  const put = slot.requests[0];
  const res = await fetch(put.url, { method: put.method, headers: put.headers, body: bytes as BodyInit });
  if (!res.ok) throw new YouCamError("upload_failed", `Upload to storage failed (${res.status}).`);
  return slot.file_id;
}

type TaskState<R> = { task_status: "running" | "success" | "error"; error?: string; error_message?: string; results?: R };

async function runTask<R>(path: string, body: object, timeoutMs = 95_000): Promise<R> {
  const { task_id } = await call<{ task_id: string }>(path, { method: "POST", body: JSON.stringify(body) });
  const started = Date.now();
  for (let wait = 1200; Date.now() - started < timeoutMs; wait = Math.min(wait * 1.4, 5000)) {
    await new Promise((r) => setTimeout(r, wait));
    const state = await call<TaskState<R>>(`${path}/${task_id}`);
    if (state.task_status === "success") return state.results as R;
    if (state.task_status === "error")
      throw new YouCamError(state.error ?? "engine_error", state.error_message ?? "The engine could not process this photo.", 422);
  }
  throw new YouCamError("timeout", "The analysis took too long. Try again.", 504);
}

export const MARKS = ["age_spot", "redness", "acne"] as const;
export type Mark = (typeof MARKS)[number];

type SkinOutput = { type: string; region?: string; mask_urls?: string[] };

export async function skinMarks(fileId: string): Promise<Record<Mark, string>> {
  const results = await runTask<{ output: SkinOutput[] }>("/v2.1/task/skin-analysis", {
    src_file_id: fileId,
    dst_actions: [...MARKS],
    format: "json",
    miniserver_args: { enable_mask_overlay: false },
  });
  const masks = {} as Record<Mark, string>;
  for (const m of MARKS) {
    const o = results.output.find((x) => x.type === m && (!x.region || x.region === "whole"));
    if (!o?.mask_urls?.[0]) throw new YouCamError("missing_concern", `The result had no ${m} mask.`);
    masks[m] = o.mask_urls[0];
  }
  return masks;
}

export type Tone = { skin: string; eyebrow: string; eye: string; lip: string; quality: Record<string, unknown> };

export async function skinTone(fileId: string): Promise<Tone> {
  const r = await runTask<{ color: Record<string, string>; face_quality: Record<string, unknown> }>("/v2.0/task/skin-tone-analysis", {
    src_file_id: fileId,
    face_angle_strictness_level: "high",
  });
  return { skin: r.color.skin_color, eyebrow: r.color.eyebrow_color, eye: r.color.eye_color, lip: r.color.lip_color, quality: r.face_quality ?? {} };
}

export async function renderFoundation(fileId: string, hex: string, coverage: number) {
  const r = await runTask<{ url: string }>("/v2.0/task/makeup-vto", {
    src_file_id: fileId,
    version: "1.0",
    effects: [
      { category: "skin_smooth", skinSmoothStrength: 0, skinSmoothColorIntensity: 0 },
      { category: "foundation", palettes: [{ color: hex, colorIntensity: 100, glowIntensity: 0, coverageIntensity: Math.round(coverage * 100) }] },
    ],
  });
  return r.url;
}

const ADVICE: Record<string, string> = {
  error_src_face_too_small: "Move closer. Your face should fill most of the frame.",
  error_src_face_out_of_bound: "Center your face so the forehead and chin are in frame.",
  error_lighting_dark: "It is too dark. Face a window or a lamp.",
  error_no_face: "No face was found. Look straight at the camera.",
  error_below_min_image_size: "The photo is too small. Use the camera at full resolution.",
  error_pose: "Look straight at the camera with your head level.",
  CreditInsufficiency: "The YouCam account is out of units.",
};

export const advice = (e: YouCamError) => ADVICE[e.code] ?? e.message;
