/* Console-friendly version - Copy and paste this entire code into the browser console */
/* Original code by matt vogel */
/* v2 - Modified to include Title Case option */
// creates a right click menu plugin to toggle block capitalization between lowercase, UPPERCASE, and Title Case

(function() {
  function isUpper(str) {
    // check if text is uppercase 
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
  }

  function isLower(str) {
    // check if text is lowercase
    return /[a-z]/.test(str) && !/[A-Z]/.test(str);
  }

  function isTitleCase(str) {
    // check if text is in title case (approximately - checks if it has both upper and lower case)
    // and first letter of most words is capitalized
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

  function cBlock(uid) {
    // cycle through capitalization states: Original → UPPERCASE → Title Case → lowercase
    let query = `[:find ?s .
                        :in $ ?uid
                        :where 
              [?e :block/uid ?uid]
              [?e :block/string ?s]
              ]`;
    
    let block_string = window.roamAlphaAPI.q(query,uid);
    let new_string;
    
    // Determine current state and cycle to next
    if (isUpper(block_string)) {
      // UPPERCASE → Title Case
      new_string = toTitleCase(block_string.toLowerCase());
    } else if (isTitleCase(block_string)) {
      // Title Case → lowercase
      new_string = block_string.toLowerCase();
    } else {
      // lowercase or mixed → UPPERCASE
      new_string = block_string.toUpperCase();
    }

    window.roamAlphaAPI.updateBlock({"block": 
                  {"uid": uid,
                    "string": new_string}})
  }

  // Remove any existing command with the same label first (in case you're re-running)
  try {
    roamAlphaAPI.ui.blockContextMenu.removeCommand({
      label: "Toggle Case (Upper/Title/Lower)"
    });
  } catch(e) {
    // Ignore error if command doesn't exist
  }

  // Add the command
  roamAlphaAPI.ui.blockContextMenu.addCommand({
    label: "Toggle Case (Upper/Title/Lower)",
    callback: (e) => cBlock(e['block-uid'])
  });

  console.log("✅ Toggle case plugin loaded successfully - supports uppercase, title case, and lowercase");
  console.log("Right-click on any block to see 'Toggle Case (Upper/Title/Lower)' option");
})();