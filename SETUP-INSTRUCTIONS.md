# How to Make the Toggle Case Extension Permanent in Roam Research

Follow these steps to have the extension load automatically every time you open Roam.

## Option 1: GitHub Hosting (Recommended)

### Step 1: Upload to GitHub
1. Go to [GitHub.com](https://github.com) and sign in (create a free account if needed)
2. Click the **+** icon (top right) → **New repository**
3. Name it: `roam-toggle-case` (or any name you prefer)
4. Make sure it's set to **Public**
5. Click **Create repository**

### Step 2: Upload Your Extension File
1. Click **"uploading an existing file"** link on the repository page
2. Drag and drop the `extension-roamjs.js` file from this folder
3. Click **Commit changes**

### Step 3: Get the Raw URL
1. Click on the `extension-roamjs.js` file in your repository
2. Click the **Raw** button
3. Copy the URL from your browser's address bar
   - It will look like: `https://raw.githubusercontent.com/YOUR_USERNAME/roam-toggle-case/main/extension-roamjs.js`

### Step 4: Set Up in Roam Research
1. Open your Roam Research database
2. Create a new page called **roam/js** (exactly like that, with the forward slash)
3. On this page, create a code block:
   - Type three backticks: ` ``` `
   - Add a new line
   - Type three backticks again: ` ``` `
4. Put your cursor between the backticks and paste this code:

```javascript
var extension = document.createElement("script");
extension.type = "text/javascript";
extension.src = "YOUR_RAW_GITHUB_URL_HERE";
document.getElementsByTagName("head")[0].appendChild(extension);
```

5. Replace `YOUR_RAW_GITHUB_URL_HERE` with the URL you copied in Step 3
6. Click on the code block, then click on the three dots menu that appears
7. Select **javascript** as the code block type
8. A button will appear saying **"Yes, I know what I'm doing"**
9. Click it to activate the extension

### Step 5: Test It
1. Refresh your Roam Research page
2. Click on any block
3. Press **Ctrl+Shift+U** to toggle case
4. Or right-click and select **"Toggle Case (Upper/Title/Lower)"**

---

## Option 2: Direct Code Embedding (Simpler but Longer)

If you don't want to use GitHub, you can paste the entire code directly:

### Step 1: Set Up roam/js Page
1. Create a new page called **roam/js**
2. Create a code block (three backticks on separate lines)
3. Set the code block type to **javascript**

### Step 2: Paste the Code
1. Open the `extension-roamjs.js` file in a text editor
2. Copy ALL the code
3. Paste it between the backticks in your roam/js page
4. Click **"Yes, I know what I'm doing"**

---

## Troubleshooting

### Extension Not Loading?
- Make sure the page is named exactly `roam/js` (lowercase, with forward slash)
- Check that the code block type is set to `javascript`
- Ensure you clicked "Yes, I know what I'm doing"
- Try refreshing Roam Research

### Keyboard Shortcut Not Working?
- Make sure you have a block focused (cursor visible in the block)
- Check the browser console (F12) for any error messages
- Try the right-click menu to confirm the extension is loaded

### Want to Disable It?
- Go to your roam/js page
- Click the "Yes, I know what I'm doing" button to toggle it off
- Or delete the code block entirely

---

## Features
- **Keyboard Shortcut**: Ctrl+Shift+U
- **Right-Click Menu**: "Toggle Case (Upper/Title/Lower)"
- **Cycles Through**: lowercase → UPPERCASE → Title Case → lowercase
- **Smart Title Case**: Handles articles and prepositions correctly
- **Persistent**: Loads automatically every time you open Roam

---

## Updates
To update the extension:
1. Replace the code in your GitHub repository with the new version
2. Roam will automatically use the updated version on next refresh
3. Or if using direct embedding, replace the code in your roam/js page