import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { ensureWorkbook, importStateFromWorkbook, loadReferenceSeedState, loadStateFromWorkbook, saveStateToWorkbook } from "./excelStore.mjs";
import { buildDealBriefDocx } from "./docxStore.mjs";

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
    setCorsHeaders(response);
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const { pathname } = url;

    if (pathname === "/api/state" && request.method === "GET") {
      const state = await loadStateFromWorkbook(WORKBOOK_PATH);
      const workbookStats = await fs.stat(WORKBOOK_PATH);
      return sendJson(response, 200, {
        ...state,
        workbookPath: WORKBOOK_PATH,
        workbookUrl: "/api/download",
        savedAt: workbookStats.mtime.toISOString(),
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

    if (pathname === "/api/upload" && request.method === "POST") {
      const originalName = sanitizeUploadFilename(url.searchParams.get("filename") || "uploaded-workbook.xlsx");
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "salesrep-upload-"));
      const uploadPath = path.join(tmpDir, originalName);

      try {
        const content = await readBinaryBody(request);
        if (!content.byteLength) {
          throw new Error("The uploaded file is empty.");
        }

        await fs.writeFile(uploadPath, content);
        const imported = await importStateFromWorkbook(uploadPath);
        const currentState = await loadStateFromWorkbook(WORKBOOK_PATH);
        const nextState = mergeImportedState(currentState, imported);
        const meta = await saveStateToWorkbook(WORKBOOK_PATH, nextState);

        return sendJson(response, 200, {
          ok: true,
          workbookPath: meta.workbookPath,
          savedAt: meta.savedAt,
          importMeta: {
            ...(imported.meta || {}),
            filename: originalName,
          },
        });
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    }

    if (pathname === "/api/export-docx" && request.method === "POST") {
      const kind = String(url.searchParams.get("kind") || "").trim().toLowerCase();
      const payload = await readJsonBody(request);
      const deal = payload?.deal && typeof payload.deal === "object" ? payload.deal : {};
      const { content, filename } = await buildDealBriefDocx(kind, deal);
      response.writeHead(200, {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
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

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
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

async function readBinaryBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function sanitizeUploadFilename(filename) {
  const base = path.basename(String(filename || "uploaded-workbook.xlsx").trim()) || "uploaded-workbook.xlsx";
  const normalized = base.replace(/[^a-zA-Z0-9._-]+/g, "-");
  if ([".xlsx", ".xlsm", ".xltx", ".xltm", ".xls"].some((suffix) => normalized.toLowerCase().endsWith(suffix))) {
    return normalized;
  }
  return `${normalized}.xlsx`;
}

function mergeImportedState(currentState, importedPayload) {
  const payload = importedPayload && typeof importedPayload === "object" ? importedPayload : {};
  const importedState = payload.state && typeof payload.state === "object" ? payload.state : {};
  const mode = String(payload.meta?.mode || "");

  if (mode === "opportunities-source") {
    return {
      deals: Array.isArray(importedState.deals) ? importedState.deals : [],
      marketIntel: Array.isArray(importedState.marketIntel) ? importedState.marketIntel : [],
      targets: Array.isArray(importedState.targets) ? importedState.targets : [],
      kpis: Array.isArray(currentState.kpis) && currentState.kpis.length ? currentState.kpis : Array.isArray(importedState.kpis) ? importedState.kpis : [],
      tasks: Array.isArray(currentState.tasks) ? currentState.tasks : [],
      campaigns: Array.isArray(currentState.campaigns) ? currentState.campaigns : [],
      users: Array.isArray(currentState.users) ? currentState.users : [],
      workspace: currentState.workspace && typeof currentState.workspace === "object" ? currentState.workspace : {},
    };
  }

  return normalizeIncomingState(importedState);
}

function normalizeIncomingState(payload) {
  const body = payload && typeof payload === "object" ? payload : {};
  return {
    deals: Array.isArray(body.deals) ? body.deals : [],
    marketIntel: Array.isArray(body.marketIntel) ? body.marketIntel : [],
    targets: Array.isArray(body.targets) ? body.targets : [],
    kpis: Array.isArray(body.kpis) ? body.kpis : [],
    tasks: Array.isArray(body.tasks) ? body.tasks : [],
    campaigns: Array.isArray(body.campaigns) ? body.campaigns : [],
    users: Array.isArray(body.users) ? body.users : [],
    workspace: body.workspace && typeof body.workspace === "object" ? body.workspace : {},
  };
}
