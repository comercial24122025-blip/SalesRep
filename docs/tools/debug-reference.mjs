import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
import { loadStateFromWorkbook } from "../excelStore.mjs";

const target = "/Users/erickmendez/Documents/Sales/Dashboard_Leads_Opps_Target_2026_B2C-v2.xlsx";

try {
  const state = await loadStateFromWorkbook(target, { fallbackToBootstrap: false });
  console.log(JSON.stringify({ deals: state.deals.length, targets: state.targets.length, firstDeal: state.deals[0] }, null, 2));

  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(target));
  const inspect = await workbook.inspect({
    kind: "table",
    range: "Deals!A1:AT20",
    include: "values",
    tableMaxRows: 20,
    tableMaxCols: 46,
  });
  console.log(inspect.ndjson);
} catch (error) {
  console.error(String(error?.stack || error));
  process.exitCode = 1;
}
