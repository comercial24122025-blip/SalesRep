import fs from "node:fs/promises";
import path from "node:path";

const DB_SCHEMA_VERSION = 1;

export async function ensureDatabase(dbPath, seedState = null) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  try {
    const raw = await fs.readFile(dbPath, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.schemaVersion) {
      return parsed;
    }
  } catch {
    // initialize below
  }

  const now = new Date().toISOString();
  const payload = {
    schemaVersion: DB_SCHEMA_VERSION,
    revision: 1,
    savedAt: now,
    state: normalizeState(seedState || {}),
  };
  await fs.writeFile(dbPath, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

export async function loadStateFromDatabase(dbPath) {
  const raw = await fs.readFile(dbPath, "utf8");
  const parsed = JSON.parse(raw);
  return {
    state: normalizeState(parsed?.state || {}),
    revision: Number(parsed?.revision || 1),
    savedAt: parsed?.savedAt || null,
    schemaVersion: Number(parsed?.schemaVersion || DB_SCHEMA_VERSION),
  };
}

export async function saveStateToDatabase(dbPath, nextState) {
  const current = await ensureDatabase(dbPath, {});
  const revision = Number(current.revision || 1) + 1;
  const savedAt = new Date().toISOString();
  const payload = {
    schemaVersion: DB_SCHEMA_VERSION,
    revision,
    savedAt,
    state: normalizeState(nextState || {}),
  };
  await fs.writeFile(dbPath, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

function normalizeState(payload) {
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
    history: Array.isArray(body.history) ? body.history : [],
  };
}
