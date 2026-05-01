import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PYTHON = "/Users/erickmendez/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const SCRIPT = path.join(__dirname, "tools", "deal_brief_docx.py");
const TEMPLATE_PATHS = {
  default: "/Users/erickmendez/Documents/Documents - Erick’s MacBook Air/Props/Commercial Proposal Blockotech - April 2026.docx",
  proposal: path.join(__dirname, "templates", "evolution-commercial-proposal-standard.docx"),
};

export async function buildDealBriefDocx(kind, deal) {
  const safeKind = normalizeDocxKind(kind);
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "salesrep-docx-"));
  const payloadPath = path.join(tmpDir, "deal.json");
  const outputPath = path.join(tmpDir, buildOutputFilename(deal, safeKind));
  const templatePath = resolveTemplatePath(safeKind);

  await fs.writeFile(payloadPath, JSON.stringify({ deal: deal || {} }), "utf8");

  try {
    await runPython([SCRIPT, safeKind, payloadPath, outputPath, templatePath]);
    const content = await fs.readFile(outputPath);
    return {
      content,
      filename: path.basename(outputPath),
      templatePath,
    };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

function normalizeDocxKind(kind) {
  const value = String(kind || "").trim().toLowerCase();
  if (["legal", "proposal", "dd", "integration", "signoff"].includes(value)) {
    return value;
  }
  throw new Error(`Unsupported document export kind: ${kind}`);
}

function buildOutputFilename(deal, kind) {
  const source = String(deal?.deal || deal?.documentClientName || deal?.client || deal?.companyName || "deal")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "deal";
  const suffixMap = {
    legal: "new-service-agreement-request",
    proposal: "commercial-proposal",
    dd: "dd-request",
    integration: "integration-request",
    signoff: "legal-signoff-request",
  };
  return `${source}-${suffixMap[kind] || kind}.docx`;
}

function resolveTemplatePath(kind) {
  return TEMPLATE_PATHS[kind] || TEMPLATE_PATHS.default;
}

function runPython(args) {
  return new Promise((resolve, reject) => {
    const process = spawn(PYTHON, args, {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderr = "";

    process.stdout.on("data", () => {});
    process.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });

    process.on("error", (error) => {
      reject(error);
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `DOCX generator exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}
