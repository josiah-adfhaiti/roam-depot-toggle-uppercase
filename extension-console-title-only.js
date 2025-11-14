/* Console version - TITLE CASE TOGGLE ONLY - Copy and paste this entire code into the browser console */
/* Original code by matt vogel */
/* v3 - Simplified to only toggle Title Case */
// Toggles between Title Case and original case

(function() {
  function isTitleCase(str) {
    // check if text is already in title case
    if (!str || str.length === 0) return false;
    
    // Must have both upper and lower case letters
    if (!(/[a-z]/.test(str) && /[A-Z]/.test(str))) {
      return false;
    }
    
    // Check if words generally start with capitals
    const words = str.split(/\s+/);
    const capitalizedWords = words.filter(word => {
      // Skip short words that might be articles/prepositions
      if (word.length <= 2) return true;
      // Check if first letter is uppercase
      return word[0] === word[0].toUpperCase();
    });
    
    // If most significant words are capitalized, consider it title case
    return capitalizedWords.length >= words.filter(w => w.length > 2).length * 0.7;
  }

  function toTitleCase(str) {
    // Convert string to title case
    // List of words that should remain lowercase in title case (unless they're the first word)
    const lowercaseWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 
                            'from', 'in', 'into', 'nor', 'of', 'on', 'or', 'so', 
                            'the', 'to', 'up', 'with', 'yet'];
    
    return str.replace(/\w\S*/g, (word, index) => {
      // Always capitalize the first word
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      }
      // Check if the word should remain lowercase
      if (lowercaseWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      // Capitalize the first letter, lowercase the rest
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
  }

  function toggleTitleCase(uid) {
    // Toggle between Title Case and lowercase
    let query = `[:find ?s .
                        :in $ ?uid
                        :where 
              [?e :block/uid ?uid]
              [?e :block/string ?s]
              ]`;
    
    let block_string = window.roamAlphaAPI.q(query,uid);
    let new_string;
    
    // Toggle between title case and lowercase
    if (isTitleCase(block_string)) {
      // If already in title case, convert to lowercase
      new_string = block_string.toLowerCase();
    } else {
      // Convert to title case
      new_string = toTitleCase(block_string);
    }

    window.roamAlphaAPI.updateBlock({"block": 
                  {"uid": uid,
                    "string": new_string}})
  }

  function toggleCurrentBlock() {
    // Get the currently focused block
    const focusedBlock = window.roamAlphaAPI.ui.getFocusedBlock();
    if (focusedBlock && focusedBlock['block-uid']) {
      toggleTitleCase(focusedBlock['block-uid']);
    } else {
      console.log("No block is currently focused. Click on a block first.");
    }
  }

  // Remove any existing command with the same label first (in case you're re-running)
  try {
    roamAlphaAPI.ui.blockContextMenu.removeCommand({
      label: "Toggle Title Case"
    });
  } catch(e) {
    // Ignore error if command doesn't exist
  }

  // Add the right-click context menu command
  roamAlphaAPI.ui.blockContextMenu.addCommand({
    label: "Toggle Title Case",
    callback: (e) => toggleTitleCase(e['block-uid'])
  });

  // Add keyboard shortcut (Ctrl+Shift+T for Title)
  document.addEventListener('keydown', function(e) {
    // Check if Ctrl+Shift+T is pressed
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
      e.preventDefault(); // Prevent default browser behavior
      toggleCurrentBlock();
    }
  });

  console.log("✅ Title Case toggle plugin loaded successfully!");
  console.log("📝 Right-click menu: 'Toggle Title Case'");
  console.log("⌨️ Keyboard shortcut: Ctrl+Shift+T (while focused on a block)");
  console.log("🔄 Toggles between: Title Case ↔ lowercase");
})();