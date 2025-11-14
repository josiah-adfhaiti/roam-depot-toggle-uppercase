/* roam/js version FIXED - More robust loading and error handling */
/* Original code by matt vogel */
/* v4 - Fixed loading issues and improved reliability */

// Use a unique namespace to prevent conflicts
if (!window.roamToggleCaseExtension) {
  window.roamToggleCaseExtension = {
    initialized: false,
    
    isUpper: function(str) {
      return !/[a-z]/.test(str) && /[A-Z]/.test(str);
    },
    
    isLower: function(str) {
      return /[a-z]/.test(str) && !/[A-Z]/.test(str);
    },
    
    isTitleCase: function(str) {
      if (!str || str.length === 0) return false;
      
      if (!(/[a-z]/.test(str) && /[A-Z]/.test(str))) {
        return false;
      }
      
      const words = str.split(/\s+/);
      const capitalizedWords = words.filter(word => {
        if (word.length <= 2) return true;
        return word[0] === word[0].toUpperCase();
      });
      
      return capitalizedWords.length >= words.filter(w => w.length > 2).length * 0.7;
    },
    
    toTitleCase: function(str) {
      const lowercaseWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 
                              'from', 'in', 'into', 'nor', 'of', 'on', 'or', 'so', 
                              'the', 'to', 'up', 'with', 'yet'];
      
      return str.replace(/\w\S*/g, (word, index) => {
        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
        }
        if (lowercaseWords.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      });
    },
    
    cBlock: function(uid) {
      try {
        let query = `[:find ?s .
                            :in $ ?uid
                            :where 
                  [?e :block/uid ?uid]
                  [?e :block/string ?s]
                  ]`;
        
        let block_string = window.roamAlphaAPI.q(query, uid);
        
        if (!block_string || block_string.length === 0) {
          console.log("No block content found for uid:", uid);
          return;
        }
        
        // Ensure block_string is a string
        if (Array.isArray(block_string)) {
          block_string = block_string[0];
        }
        if (Array.isArray(block_string)) {
          block_string = block_string[0];
        }
        
        let new_string;
        
        if (this.isUpper(block_string)) {
          new_string = this.toTitleCase(block_string.toLowerCase());
        } else if (this.isTitleCase(block_string)) {
          new_string = block_string.toLowerCase();
        } else {
          new_string = block_string.toUpperCase();
        }
        
        window.roamAlphaAPI.updateBlock({
          "block": {
            "uid": uid,
            "string": new_string
          }
        });
        
        console.log("Text toggled successfully");
      } catch (error) {
        console.error("Error in cBlock:", error);
      }
    },
    
    toggleCurrentBlock: function() {
      try {
        const focusedBlock = window.roamAlphaAPI.ui.getFocusedBlock();
        if (focusedBlock && focusedBlock['block-uid']) {
          this.cBlock(focusedBlock['block-uid']);
        } else {
          // Try alternative method to get focused block
          const activeElement = document.activeElement;
          const blockElement = activeElement?.closest('.rm-block-main');
          if (blockElement) {
            const blockId = blockElement.querySelector('.rm-block__input')?.id;
            if (blockId) {
              const uid = blockId.replace('block-input-', '');
              this.cBlock(uid);
            } else {
              console.log("No block is currently focused. Click on a block first.");
            }
          }
        }
      } catch (error) {
        console.error("Error toggling current block:", error);
      }
    },
    
    init: function() {
      if (this.initialized) {
        console.log("Toggle case extension already initialized");
        return;
      }
      
      const self = this;
      
      // Remove any existing command
      try {
        roamAlphaAPI.ui.blockContextMenu.removeCommand({
          label: "Toggle Case (Upper/Title/Lower)"
        });
      } catch(e) {
        // Ignore if doesn't exist
      }
      
      // Add the right-click context menu command
      try {
        roamAlphaAPI.ui.blockContextMenu.addCommand({
          label: "Toggle Case (Upper/Title/Lower)",
          callback: (e) => self.cBlock.call(self, e['block-uid'])
        });
        console.log("✅ Right-click menu added successfully");
      } catch (error) {
        console.error("Error adding context menu:", error);
      }
      
      // Add keyboard shortcut handler
      const keyHandler = function(e) {
        // Ctrl+Shift+U
        if (e.ctrlKey && e.shiftKey && e.key === 'U') {
          e.preventDefault();
          e.stopPropagation();
          self.toggleCurrentBlock.call(self);
          return false;
        }
      };
      
      // Remove old listener if it exists
      if (window.roamToggleCaseKeyHandler) {
        document.removeEventListener('keydown', window.roamToggleCaseKeyHandler, true);
      }
      
      // Add new listener with capture phase
      window.roamToggleCaseKeyHandler = keyHandler;
      document.addEventListener('keydown', keyHandler, true);
      
      this.initialized = true;
      
      console.log("✅ Toggle case extension loaded successfully!");
      console.log("⌨️ Keyboard shortcut: Ctrl+Shift+U");
      console.log("📝 Right-click menu: Toggle Case (Upper/Title/Lower)");
      console.log("🔄 Cycles: lowercase → UPPERCASE → Title Case → lowercase");
    }
  };
  
  // Initialize after a delay to ensure Roam is ready
  setTimeout(() => {
    window.roamToggleCaseExtension.init();
  }, 2000);
  
} else {
  // Extension already loaded, just reinitialize
  window.roamToggleCaseExtension.init();
}