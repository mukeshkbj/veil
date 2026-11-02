import { HOST } from "@/lib/youcam";
import { signed } from "../photo";

const MAX_BYTES = 12 * 1024 * 1024;

const ALLOWED = [/\.amazonaws\.com$/, /\.makeupar\.com$/, /\.perfectcorp\.com$/, /\.cloudfront\.net$/];
const api = new URL(HOST);
const allowed = (url: URL) => (url.protocol === "https:" && ALLOWED.some((r) => r.test(url.hostname))) || url.origin === api.origin;

function imageType(bytes: Uint8Array) {
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  return null;
}

async function capped(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (let r = await reader.read(); !r.done; r = await reader.read()) {
    size += r.value.length;
    if (size > MAX_BYTES) {
      await reader.cancel();
      throw new Error("Too large");
    }
    chunks.push(r.value);
  }
  return Buffer.concat(chunks);
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const target = params.get("u");
  const url = target ? URL.parse(target) : null;
  if (!url || !allowed(url) || !signed(target!, params.get("s"))) {
    return new Response("Not an allowed result URL.", { status: 400 });
  }
  const res = await fetch(url, { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15_000) }).catch(() => null);
  const bytes = res?.ok && res.body ? await capped(res.body).catch(() => null) : null;
  const type = bytes && imageType(bytes);
  if (!bytes || !type) return new Response("Result expired or unavailable.", { status: 502 });
  return new Response(bytes, {
    headers: { "Content-Type": type, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}
