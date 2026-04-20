/**
 * Core validation logic to ensure required fields are filled.
 * @param {Object} e The event object from the onEdit trigger.
 */
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const row = range.getRow();
  
  // 1. CONFIGURATION: Set your rules here
  const TARGET_SHEET_NAME = "Your_Sheet_Name_Here"; 
  const START_ENFORCEMENT_ROW = 10; // Skip headers or historical data
  const REQUIRED_COLUMN_INDEXES = [1, 2, 5]; // e.g., Columns A, B, and E
  
  // 2. SAFETY CHECKS: Exit if the edit happened where we don't care
  if (sheet.getName() !== TARGET_SHEET_NAME) return;
  if (row < START_ENFORCEMENT_ROW) return;

  // 3. LOGIC: Check for empty values in required columns
  const rowValues = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  let missingFields = [];

  REQUIRED_COLUMN_INDEXES.forEach(colIndex => {
    // colIndex - 1 because JavaScript arrays are 0-indexed
    const cellValue = rowValues[colIndex - 1];
    
    if (cellValue === "" || cellValue === null || cellValue === undefined) {
      const colName = sheet.getRange(1, colIndex).getValue(); // Assumes headers are in Row 1
      missingFields.push(colName);
    }
  });

  // 4. ACTION: Alert the user if something is missing
  if (missingFields.length > 0) {
    // Highlight the row or cell to grab attention
    range.setBackground("#ffcccc"); 
    
    // Show a popup (Note: SpreadsheetApp.getUi() only works for the person editing)
    SpreadsheetApp.getUi().alert(
      "Missing Information", 
      "Please fill in the following required fields in row " + row + ":\n\n" + missingFields.join(", "),
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } else {
    // Reset background if requirements are met
    range.setBackground(null);
  }
}
