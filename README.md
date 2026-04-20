# Order Sheet General Checks and Updates

A Google Sheets automation suite designed to manage order data with validation, synchronization, and data integrity checks. This project provides Google Apps Script modules for handling incomplete records, mandatory field validation, and seamless data sync between sheets.

## 📋 Overview

This repository contains three core modules for Google Sheets:

- **Incomplete.gs** - Identifies and manages incomplete orders
- **Mandatory.gs** - Validates required fields in real-time
- **Menu.gs** - Provides user-friendly menu interface

Perfect for managing order fulfillment workflows where data consistency and completeness are critical.

## 🚀 Features

✅ **Real-time Field Validation** - Enforces mandatory fields with immediate feedback  
✅ **Incomplete Record Tracking** - Automatically identifies orders missing required data  
✅ **Bi-directional Sync** - Sync updates from target sheet back to source sheet  
✅ **Configurable Validation Rules** - Easy-to-modify field and sheet configurations  
✅ **User-Friendly Menu Interface** - One-click operations for common tasks  
✅ **Data Normalization** - Automatic handling of null/undefined values  

## 📁 Project Structure

```
Order_sheet_general_Checks-and-Updates/
├── Incomplete.gs      # Manages incomplete record tracking and syncing
├── Mandatory.gs       # Real-time validation for required fields
├── Menu.gs            # Custom menu interface
└── README.md          # This file
```

## 🔧 Setup & Configuration

### Prerequisites
- Google Sheets document
- Access to Google Apps Script editor

### Installation

1. Open your Google Sheets document
2. Go to **Extensions → Apps Script**
3. Copy the code from `Incomplete.gs`, `Mandatory.gs`, and `Menu.gs` into separate script files
4. Update the configuration in `Incomplete.gs`:

```javascript
const CONFIG = {
  SOURCE_SHEET: "SourceSheet",        // Your source data sheet
  TARGET_SHEET: "TargetSheet",        // Your target/working sheet
  HEADER_ROW: 2,                      // Row containing headers
  DATA_START_ROW: 3,                  // Row where data begins
  UNIQUE_KEY: "UniqueID",             // Unique identifier field (e.g., OrderID)
  MAIN_FIELDS: ["Field1", "Field2", "Field3"],  // Primary fields to extract
  CHECK_FIELDS: ["FieldA", "FieldB", "FieldC"] // Fields to validate for completeness
};
```

5. Update `Mandatory.gs` configuration:

```javascript
const TARGET_SHEET_NAME = "Your_Sheet_Name_Here";
const START_ENFORCEMENT_ROW = 10;        // Skip headers
const REQUIRED_COLUMN_INDEXES = [1, 2, 5]; // Columns to enforce (A, B, E)
```

6. Save and reload the sheet - the **⚙️ Data Manager** menu will appear

## 📖 Usage

### Available Operations

#### 🚀 Run Full Sync (Recommended)
Executes the complete workflow:
1. Syncs updates from target sheet back to source
2. Populates incomplete records list
3. Shows summary of changes

```
⚙️ Data Manager → 🚀 Run Full Sync (Recommended)
```

#### 📥 Refresh Incomplete List
Identifies all incomplete orders and populates the target sheet.

```
⚙️ Data Manager → 📥 Refresh Incomplete List
```

#### 📤 Push Updates Back
Syncs any updates made in the target sheet back to the source sheet, matching by Unique ID.

```
⚙️ Data Manager → 📤 Push Updates Back
```

#### 🧹 Clean & Rebuild List
Clears and rebuilds the incomplete records list from scratch.

```
⚙️ Data Manager → 🧹 Clean & Rebuild List
```

### How It Works

**Incomplete Records Detection:**
- Scans all rows in the source sheet
- Identifies rows where any CHECK_FIELDS are empty
- Copies matching rows to the target sheet for review/completion
- Returns count of incomplete records

**Mandatory Field Validation:**
- Triggers automatically when editing cells
- Checks if required columns contain values
- Highlights cell in red (#ffcccc) if validation fails
- Shows alert with list of missing required fields

**Data Synchronization:**
- Reads updated data from target sheet
- Matches records using the UNIQUE_KEY
- Updates source sheet with changes
- Reports number of rows updated

## 🎯 Use Cases

- **Order Management**: Track incomplete orders awaiting information
- **Data Quality**: Enforce mandatory field completion before processing
- **Batch Updates**: Review and update incomplete orders in dedicated sheet
- **Audit Trail**: Maintain synchronized source and working sheets

## 📝 Code Modules

### Incomplete.gs
Handles identification and syncing of incomplete records.

**Key Functions:**
- `normalize(value)` - Cleans and standardizes cell values
- `populateIncompleteDataGeneric()` - Finds incomplete records
- `syncBackGeneric()` - Syncs updates back to source sheet
- `runGenericSync()` - Runs complete workflow

### Mandatory.gs
Real-time validation on sheet edits.

**Key Functions:**
- `onEdit(e)` - Triggered on cell edit, validates required fields

### Menu.gs
Creates the user interface menu.

**Key Functions:**
- `onOpen()` - Creates ⚙️ Data Manager menu on sheet open

## ⚙️ Advanced Configuration

### Changing Validation Rules
Edit the `REQUIRED_COLUMN_INDEXES` array in `Mandatory.gs` (uses 1-based column numbers):
```javascript
const REQUIRED_COLUMN_INDEXES = [1, 2, 5]; // Columns A, B, E
```

### Adding More Validation Fields
Extend `CHECK_FIELDS` in `Incomplete.gs` CONFIG:
```javascript
CHECK_FIELDS: ["FieldA", "FieldB", "FieldC", "FieldD"]
```

### Custom Alert Colors
Change the highlight color in `Mandatory.gs`:
```javascript
range.setBackground("#ffcccc"); // Light red - change hex code as needed
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Menu not appearing | Save the script and refresh the sheet (F5) |
| Validation not triggering | Ensure `TARGET_SHEET_NAME` matches your sheet name exactly |
| Sync not working | Verify UNIQUE_KEY column exists and contains unique values |
| Column index errors | Double-check REQUIRED_COLUMN_INDEXES uses 1-based numbering |

## 💡 Tips

- Always test on a copy of your sheet first
- Keep source sheet as read-only backup
- Review incomplete records regularly
- Use descriptive field names for easier troubleshooting
- Backup your data before running sync operations

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Created by **shivanshsenpai**

## 🤝 Contributing

Feel free to fork, modify, and customize this project for your needs!

---

**Last Updated**: April 20, 2026