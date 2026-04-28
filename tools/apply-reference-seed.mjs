import path from "node:path";
import { loadReferenceSeedState, saveStateToWorkbook } from "../excelStore.mjs";

const workbookPath = path.resolve("/Users/erickmendez/Documents/Codex/pipeline-manager-app/data/pipeline-command-center.xlsx");

const state = await loadReferenceSeedState();
const result = await saveStateToWorkbook(workbookPath, state);

console.log(JSON.stringify({ workbookPath: result.workbookPath, savedAt: result.savedAt, deals: state.deals.length, targets: state.targets.length }, null, 2));
