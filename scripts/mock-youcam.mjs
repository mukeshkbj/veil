import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

const PORT = 4010;
const ORIGIN = `http://localhost:${PORT}`;
const SUBJECT = process.argv[2] ?? "elder";
const manifest = JSON.parse(await readFile("public/replay/manifest.json", "utf8")).find((s) => s.id === SUBJECT);
const tone = JSON.parse(await readFile(`public/replay/${SUBJECT}/tone.json`, "utf8"));
const MARKS = ["age_spot", "redness", "acne"];

const uploads = new Map();
const tasks = new Map();

const json = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};

const body = (req) =>
  new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });

function result(kind, params) {
  if (kind === "skin-analysis") {
    return { output: MARKS.map((type) => ({ type, mask_urls: [`${ORIGIN}/asset/${manifest.masks.find((m) => m.includes(type))}`] })) };
  }
  if (kind === "skin-tone-analysis") {
    return { color: { skin_color: tone.color.skin_color, eyebrow_color: "#3a2a22", eye_color: "#3b2b20", lip_color: "#8a4a48" }, face_quality: { lighting: "ok" } };
  }
  const white = params.effects?.some((e) => e.category === "foundation" && e.palettes?.[0]?.color?.toLowerCase() === "#ffffff");
  return { url: `${ORIGIN}/asset/${white ? "vto-white.jpg" : manifest.bare}` };
}

createServer(async (req, res) => {
  const url = new URL(req.url, ORIGIN);
  const path = url.pathname;
  console.log(req.method, path);

  if (path.startsWith("/s2s/") && req.headers.authorization !== `Bearer ${process.env.YOUCAM_API_KEY ?? "mock"}`) {
    return json(res, 401, { status: 401, error: "Invalid API key", error_code: "InvalidApiKey" });
  }

  if (req.method === "POST" && path === "/s2s/v2.0/file") {
    const { files } = JSON.parse(await body(req));
    const id = `file_${uploads.size + 1}`;
    uploads.set(id, null);
    return json(res, 200, {
      status: 200,
      data: { files: [{ file_id: id, requests: [{ method: "PUT", url: `${ORIGIN}/upload/${id}`, headers: { "Content-Type": files[0].content_type } }] }] },
    });
  }

  if (req.method === "PUT" && path.startsWith("/upload/")) {
    uploads.set(path.split("/").pop(), await body(req));
    res.writeHead(200);
    return res.end();
  }

  const task = path.match(/^\/s2s\/v2\.[01]\/task\/(skin-analysis|skin-tone-analysis|makeup-vto)(?:\/(.+))?$/);
  if (task && req.method === "POST") {
    const params = JSON.parse(await body(req));
    if (!uploads.get(params.src_file_id)) return json(res, 400, { status: 400, error: "File not uploaded", error_code: "InvalidParameters" });
    const id = `task_${tasks.size + 1}`;
    tasks.set(id, { kind: task[1], params, polls: 0 });
    return json(res, 200, { status: 200, data: { task_id: id } });
  }
  if (task && req.method === "GET") {
    const t = tasks.get(task[2]);
    if (!t) return json(res, 400, { status: 400, error: "Invalid task id", error_code: "InvalidTaskId" });
    if (t.polls++ < 1) return json(res, 200, { status: 200, data: { task_status: "running" } });
    return json(res, 200, { status: 200, data: { task_status: "success", results: result(t.kind, t.params) } });
  }

  if (req.method === "GET" && path.startsWith("/asset/")) {
    const file = path.slice("/asset/".length).replace(/[^\w.-]/g, "");
    const bytes = await readFile(`public/replay/${SUBJECT}/${file}`).catch(() => null);
    if (!bytes) return json(res, 404, { error: "not found" });
    res.writeHead(200, { "Content-Type": file.endsWith(".png") ? "image/png" : "image/jpeg" });
    return res.end(bytes);
  }

  json(res, 404, { status: 404, error: "Not found" });
}).listen(PORT, () => console.log(`Mock YouCam API on ${ORIGIN}/s2s, serving ${SUBJECT}`));
