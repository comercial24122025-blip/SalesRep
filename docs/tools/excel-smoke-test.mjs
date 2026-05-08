import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = path.resolve("/Users/erickmendez/Documents/Codex/pipeline-manager-app/tmp");
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Deals");

sheet.getRange("A1:C3").values = [
  ["Deal", "Stage", "Value"],
  ["Alpha", "Legal", 1000],
  ["Beta", "DD", 2500],
];

const output = await SpreadsheetFile.exportXlsx(workbook);
const targetFile = path.join(outputDir, "smoke-test.xlsx");
await output.save(targetFile);

const imported = await SpreadsheetFile.importXlsx(await FileBlob.load(targetFile));
const inspect = await imported.inspect({
  kind: "table",
  range: "Deals!A1:C3",
  include: "values",
  tableMaxRows: 5,
  tableMaxCols: 5,
});

console.log(JSON.stringify({ targetFile, inspect: inspect.ndjson }, null, 2));
