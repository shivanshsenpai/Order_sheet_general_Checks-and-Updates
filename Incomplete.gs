function normalize(value) {
  return (value === null || value === undefined) ? "" : value.toString().trim();
}


/**
 * CONFIGURATION OBJECT
 * 👉 Change ONLY this to reuse anywhere
 */
const CONFIG = {
  SOURCE_SHEET: "SourceSheet",
  TARGET_SHEET: "TargetSheet",
  HEADER_ROW: 2,
  DATA_START_ROW: 3,

  UNIQUE_KEY: "UniqueID", // e.g. OrderID

  MAIN_FIELDS: ["Field1", "Field2", "Field3"],

  CHECK_FIELDS: [ // fields to check for missing values
    "FieldA",
    "FieldB",
    "FieldC"
  ]
};



/**
 * STEP 1: Populate incomplete records
 */
function populateIncompleteDataGeneric() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(CONFIG.SOURCE_SHEET);
  const targetSheet = ss.getSheetByName(CONFIG.TARGET_SHEET);

  const lastRow = sourceSheet.getLastRow();
  const lastCol = sourceSheet.getLastColumn();

  const headers = sourceSheet
    .getRange(CONFIG.HEADER_ROW, 1, 1, lastCol)
    .getValues()[0];

  const data = sourceSheet
    .getRange(CONFIG.DATA_START_ROW, 1, lastRow - (CONFIG.DATA_START_ROW - 1), lastCol)
    .getValues();

  // Create header index map
  const headerIndex = {};
  headers.forEach((h, i) => headerIndex[h] = i);

  // Clear target sheet
  const lastTargetRow = targetSheet.getLastRow();
  if (lastTargetRow >= CONFIG.DATA_START_ROW) {
    targetSheet
      .getRange(CONFIG.DATA_START_ROW, 1, lastTargetRow - (CONFIG.DATA_START_ROW - 1), targetSheet.getLastColumn())
      .clearContent();
  }

  const output = [];

  data.forEach(row => {
    let hasMissing = false;

    CONFIG.CHECK_FIELDS.forEach(field => {
      const idx = headerIndex[field];
      if (idx !== undefined && normalize(row[idx]) === "") {
        hasMissing = true;
      }
    });

    if (hasMissing) {
      let newRow = [];

      CONFIG.MAIN_FIELDS.forEach(field => {
        const idx = headerIndex[field];
        newRow.push(idx !== undefined ? row[idx] : "");
      });

      CONFIG.CHECK_FIELDS.forEach(field => {
        const idx = headerIndex[field];
        newRow.push(idx !== undefined ? row[idx] : "");
      });

      output.push(newRow);
    }
  });

  if (output.length > 0) {
    targetSheet
      .getRange(CONFIG.DATA_START_ROW, 1, output.length, output[0].length)
      .setValues(output);
  }

  return output.length;
}



/**
 * STEP 2: Sync back updates
 */
function syncBackGeneric() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(CONFIG.TARGET_SHEET);
  const targetSheet = ss.getSheetByName(CONFIG.SOURCE_SHEET);

  const sourceLastRow = sourceSheet.getLastRow();
  const targetLastRow = targetSheet.getLastRow();
  const targetLastCol = targetSheet.getLastColumn();

  if (sourceLastRow < CONFIG.DATA_START_ROW || targetLastRow < CONFIG.DATA_START_ROW) return 0;

  const sourceData = sourceSheet
    .getRange(CONFIG.DATA_START_ROW, 1, sourceLastRow - (CONFIG.DATA_START_ROW - 1), sourceSheet.getLastColumn())
    .getValues();

  const targetHeaders = targetSheet
    .getRange(CONFIG.HEADER_ROW, 1, 1, targetLastCol)
    .getValues()[0];

  const targetData = targetSheet
    .getRange(CONFIG.DATA_START_ROW, 1, targetLastRow - (CONFIG.DATA_START_ROW - 1), targetLastCol)
    .getValues();

  // Header index map
  const targetIndex = {};
  targetHeaders.forEach((h, i) => targetIndex[h] = i);

  const keyIndex = targetIndex[CONFIG.UNIQUE_KEY];

  // Build lookup map
  const rowMap = {};
  targetData.forEach((row, i) => {
    rowMap[row[keyIndex]] = i;
  });

  let updatedRows = 0;

  sourceData.forEach(row => {
    const key = row[0]; // first column in target sheet must be UNIQUE_KEY

    if (!key || rowMap[key] === undefined) return;

    const targetRowIndex = rowMap[key];
    let changed = false;

    CONFIG.CHECK_FIELDS.forEach((field, j) => {
      const colIndex = targetIndex[field];
      if (colIndex !== undefined) {
        const newValue = normalize(row[CONFIG.MAIN_FIELDS.length + j]);
        const oldValue = normalize(targetData[targetRowIndex][colIndex]);

        if (newValue !== oldValue) {
          targetSheet
            .getRange(targetRowIndex + CONFIG.DATA_START_ROW, colIndex + 1)
            .setValue(newValue);

          changed = true;
        }
      }
    });

    if (changed) updatedRows++;
  });

  return updatedRows;
}



/**
 * STEP 3: Run full sync
 */
function runGenericSync() {
  const ui = SpreadsheetApp.getUi();

  const updated = syncBackGeneric();
  const remaining = populateIncompleteDataGeneric();

  ui.alert(
    "Sync Completed\n\n" +
    "Updated Rows: " + updated + "\n" +
    "Remaining Incomplete: " + remaining
  );
}
