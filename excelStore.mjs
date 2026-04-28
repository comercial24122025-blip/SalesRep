import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PYTHON = "/Users/erickmendez/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const SCRIPT = path.join(__dirname, "tools", "workbook_store.py");

export async function ensureWorkbook(workbookPath) {
  try {
    await fs.access(workbookPath);
  } catch {
    const seedState = await loadReferenceSeedState();
    await saveStateToWorkbook(workbookPath, seedState);
  }
}

export async function loadStateFromWorkbook(workbookPath) {
  try {
    return await runPythonJson(["read", workbookPath]);
  } catch {
    return await loadReferenceSeedState();
  }
}

export async function loadReferenceSeedState() {
  return runPythonJson(["seed-reference"]);
}

export async function saveStateToWorkbook(workbookPath, state) {
  await fs.mkdir(path.dirname(workbookPath), { recursive: true });

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pipeline-manager-"));
  const payloadPath = path.join(tmpDir, "state.json");
  await fs.writeFile(payloadPath, JSON.stringify(state), "utf8");

  try {
    return await runPythonJson(["write", workbookPath, payloadPath]);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

function runPythonJson(args) {
  return new Promise((resolve, reject) => {
    const process = spawn(PYTHON, [SCRIPT, ...args], {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });

    process.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });

    process.on("error", (error) => {
      reject(error);
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `Python store exited with code ${code}`));
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(new Error(`Invalid JSON from workbook store: ${stdout || stderr}`));
      }
    });
  });
}
