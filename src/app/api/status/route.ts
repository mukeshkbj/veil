import { connection } from "next/server";
import { liveKey } from "@/lib/youcam";

export async function GET() {
  await connection();
  return Response.json({ live: Boolean(liveKey()) });
}
