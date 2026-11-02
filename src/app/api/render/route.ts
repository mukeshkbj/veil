import { YouCamError, advice, renderFoundation } from "@/lib/youcam";
import { guard, proxied } from "../photo";

export const maxDuration = 120;

export async function POST(request: Request) {
  const blocked = guard(request, "render", 30);
  if (blocked) return blocked;
  const body = (await request.json().catch(() => null)) as { fileId?: unknown; hex?: unknown; coverage?: unknown } | null;
  const { fileId, hex, coverage } = body ?? {};
  if (typeof fileId !== "string" || typeof hex !== "string" || !/^#[0-9a-f]{6}$/i.test(hex) || typeof coverage !== "number" || coverage < 0 || coverage > 1) {
    return Response.json({ error: "Send a file id, a #rrggbb colour and a coverage from 0 to 1." }, { status: 400 });
  }
  try {
    const url = await renderFoundation(fileId, hex, coverage);
    return Response.json({ image: proxied(url) });
  } catch (e) {
    if (e instanceof YouCamError) return Response.json({ error: advice(e), code: e.code }, { status: e.status });
    throw e;
  }
}
