// DEBUGGING SCRIPT - Paste this in the console to test if the extension is working

console.log("=== TOGGLE CASE EXTENSION DEBUG ===");

// Test 1: Check if extension loaded
if (window.roamToggleCaseExtension) {
  console.log("✅ Extension object exists");
  console.log("Initialized:", window.roamToggleCaseExtension.initialized);
} else {
  console.log("❌ Extension not found");
}

// Test 2: Check if Roam API is available
if (window.roamAlphaAPI) {
  console.log("✅ Roam API available");
} else {
  console.log("❌ Roam API not found");
}

// Test 3: Try to get focused block
try {
  const focused = window.roamAlphaAPI.ui.getFocusedBlock();
  if (focused) {
    console.log("✅ Can get focused block:", focused);
  } else {
    console.log("⚠️ No block currently focused");
  }
} catch (e) {
  console.log("❌ Error getting focused block:", e);
}

// Test 4: Check context menu commands
try {
  console.log("Testing context menu...");
  console.log("Right-click on a block to see if 'Toggle Case' appears in the menu");
} catch (e) {
  console.log("❌ Error checking context menu:", e);
}

// Test 5: Manual toggle function
window.testToggle = function() {
  console.log("Testing manual toggle...");
  const focused = window.roamAlphaAPI.ui.getFocusedBlock();
  if (focused && focused['block-uid']) {
    console.log("Block UID:", focused['block-uid']);
    
    // Get current text
    let query = `[:find ?s .
                  :in $ ?uid
                  :where 
                  [?e :block/uid ?uid]
                  [?e :block/string ?s]]`;
    
    let text = window.roamAlphaAPI.q(query, focused['block-uid']);
    console.log("Current text:", text);
    
    // Try to toggle
    if (window.roamToggleCaseExtension) {
      window.roamToggleCaseExtension.cBlock(focused['block-uid']);
      console.log("✅ Toggle executed");
    } else {
      console.log("❌ Extension not available");
    }
  } else {
    console.log("❌ No block focused. Click on a block and try again.");
  }
};

console.log("\n📝 INSTRUCTIONS:");
console.log("1. Click on any block in Roam");
console.log("2. Type in console: testToggle()");
console.log("3. This will attempt to toggle the case of that block");
console.log("\n=== END DEBUG ===")