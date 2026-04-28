import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { ensureWorkbook, loadReferenceSeedState, loadStateFromWorkbook, saveStateToWorkbook } from "./excelStore.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 8000);
const WORKBOOK_PATH = path.join(__dirname, "data", "pipeline-command-center.xlsx");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

await ensureWorkbook(WORKBOOK_PATH);

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const { pathname } = url;

    if (pathname === "/api/state" && request.method === "GET") {
      const state = await loadStateFromWorkbook(WORKBOOK_PATH);
      return sendJson(response, 200, {
        ...state,
        workbookPath: WORKBOOK_PATH,
        workbookUrl: "/api/download",
      });
    }

    if (pathname === "/api/save" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const state = normalizeIncomingState(payload);
      const meta = await saveStateToWorkbook(WORKBOOK_PATH, state);
      return sendJson(response, 200, {
        ok: true,
        workbookPath: meta.workbookPath,
        savedAt: meta.savedAt,
      });
    }

    if (pathname === "/api/reset-demo" && request.method === "POST") {
      const seedState = await loadReferenceSeedState();
      const meta = await saveStateToWorkbook(WORKBOOK_PATH, seedState);
      return sendJson(response, 200, {
        ok: true,
        workbookPath: meta.workbookPath,
        savedAt: meta.savedAt,
      });
    }

    if (pathname === "/api/download" && request.method === "GET") {
      const content = await fs.readFile(WORKBOOK_PATH);
      const workbookName = path.basename(WORKBOOK_PATH);
      response.writeHead(200, {
        "Content-Type": MIME_TYPES[".xlsx"],
        "Content-Disposition": `attachment; filename="${workbookName}"; filename*=UTF-8''${encodeURIComponent(workbookName)}`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Content-Length": content.byteLength,
      });
      response.end(content);
      return;
    }

    if (pathname.startsWith("/api/")) {
      sendJson(response, 404, { error: "Not found" });
      return;
    }

    const targetFile = pathname === "/" ? path.join(__dirname, "index.html") : safeJoin(__dirname, pathname);
    if (!targetFile) {
      sendText(response, 403, "Forbidden");
      return;
    }

    const content = await fs.readFile(targetFile);
    const ext = path.extname(targetFile);
    response.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    response.end(content);
  } catch (error) {
    sendJson(response, 500, { error: String(error?.message || error) });
  }
});

server.listen(PORT, () => {
  console.log(`Pipeline Command Center running at http://localhost:${PORT}`);
  console.log(`Excel storage workbook: ${WORKBOOK_PATH}`);
});

function safeJoin(rootDir, pathname) {
  const normalized = path.normalize(path.join(rootDir, pathname));
  if (!normalized.startsWith(rootDir)) {
    return null;
  }
  return normalized;
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, { "Content-Type": MIME_TYPES[".json"] });
  response.end(body);
}

function sendText(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(body);
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function normalizeIncomingState(payload) {
  const body = payload && typeof payload === "object" ? payload : {};
  return {
    deals: Array.isArray(body.deals) ? body.deals : [],
    targets: Array.isArray(body.targets) ? body.targets : [],
    kpis: Array.isArray(body.kpis) ? body.kpis : [],
    tasks: Array.isArray(body.tasks) ? body.tasks : [],
  };
}
