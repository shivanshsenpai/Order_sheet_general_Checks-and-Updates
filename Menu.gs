function onOpen() {
  const ui = SpreadsheetApp.getUi();

  const MENU_CONFIG = {
    title: "⚙️ Data Manager",

    items: [
      { label: "🚀 Run Full Sync (Recommended)", func: "runGenericSync" },

      { separator: true },

      { label: "📥 Refresh Incomplete List", func: "populateIncompleteDataGeneric" },
      { label: "📤 Push Updates Back", func: "syncBackGeneric" },

      { separator: true },

      { label: "🧹 Clean & Rebuild List", func: "populateIncompleteDataGeneric" }
    ]
  };

  const menu = ui.createMenu(MENU_CONFIG.title);

  MENU_CONFIG.items.forEach(item => {
    if (item.separator) {
      menu.addSeparator();
    } else {
      menu.addItem(item.label, item.func);
    }
  });

  menu.addToUi();
}
