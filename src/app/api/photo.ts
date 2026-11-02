import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_BYTES = 8 * 1024 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

const secret = () => process.env.YOUCAM_API_KEY ?? "";
const sign = (url: string) => createHmac("sha256", secret()).update(url).digest("base64url");

export const proxied = (url: string) => `/api/asset?u=${encodeURIComponent(url)}&s=${sign(url)}`;

export function signed(url: string, signature: string | null) {
  const want = Buffer.from(sign(url));
  const got = Buffer.from(signature ?? "");
  return got.length === want.length && timingSafeEqual(got, want);
}

export function guard(request: Request, name: string, max: number) {
  if (request.headers.get("Origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Requests must come from this site." }, { status: 403 });
  }
  const key = `${name}:${request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local"}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) return Response.json({ error: "Too many tries in a short time. Wait a few minutes." }, { status: 429 });
  hits.set(key, [...recent, now]);
  return null;
}

export async function readPhoto(request: Request): Promise<Blob | Response> {
  const blocked = guard(request, "analyze", 6);
  if (blocked) return blocked;
  const length = Number(request.headers.get("Content-Length"));
  if (!length || length > MAX_BYTES) return Response.json({ error: "Send a JPEG or PNG photo under 8 MB." }, { status: 413 });
  const form = await request.formData().catch(() => null);
  const photo = form?.get("photo");
  if (!(photo instanceof Blob) || !["image/jpeg", "image/png"].includes(photo.type) || photo.size > MAX_BYTES) {
    return Response.json({ error: "Send a JPEG or PNG photo under 8 MB." }, { status: 400 });
  }
  return photo;
}
