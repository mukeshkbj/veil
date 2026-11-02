import { YouCamError, advice, skinMarks, skinTone, upload } from "@/lib/youcam";
import { proxied, readPhoto } from "../photo";

export const maxDuration = 120;

export async function POST(request: Request) {
  const photo = await readPhoto(request);
  if (photo instanceof Response) return photo;
  try {
    const fileId = await upload(new Uint8Array(await photo.arrayBuffer()), photo.type);
    const [masks, tone] = await Promise.all([skinMarks(fileId), skinTone(fileId)]);
    return Response.json({ fileId, masks: Object.values(masks).map(proxied), tone });
  } catch (e) {
    if (e instanceof YouCamError) return Response.json({ error: advice(e), code: e.code }, { status: e.status });
    throw e;
  }
}
