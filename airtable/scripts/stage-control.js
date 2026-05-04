/*
  Airtable automation script: Stage Control

  Recommended trigger:
  - When a Deals record is updated.
  - Pass input variables:
    - recordId: Airtable record ID
    - requestedStage: value of Stage

  Recommended action:
  - If this script throws, notify RevOps and revert the stage manually or via a second update action.
*/

const config = input.config();
const table = base.getTable("Deals");
const record = await table.selectRecordAsync(config.recordId);

if (!record) {
  throw new Error("Deal record not found.");
}

const stage = config.requestedStage || record.getCellValueAsString("Stage");
const dealValue = record.getCellValue("Deal Value USD");
const contractUploaded = Boolean(record.getCellValue("Contract Uploaded"));
const apiReady = Boolean(record.getCellValue("API Ready"));
const ddStatus = record.getCellValueAsString("DD Status Rollup");

const failures = [];

if (stage === "DD") {
  if (!dealValue) failures.push("Deal Value USD is required before DD.");
  if (!contractUploaded) failures.push("Contract Uploaded must be checked before DD.");
}

if (stage === "Integration" && ddStatus !== "Approved") {
  failures.push("DD Status must be Approved before Integration.");
}

if (stage === "Go Live" && !apiReady) {
  failures.push("API Ready must be checked before Go Live.");
}

if (failures.length) {
  await table.updateRecordAsync(record.id, {
    "Risk Level": { name: "Stuck" },
    "Next Action": failures.join(" "),
  });

  throw new Error(failures.join(" "));
}

await table.updateRecordAsync(record.id, {
  "Stage Entry Date": new Date().toISOString().slice(0, 10),
});
