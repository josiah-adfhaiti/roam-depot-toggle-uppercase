// roam/js code block loader - This code goes in your roam/js page
// It loads the extension from GitHub (after you upload it there)

var extension = document.createElement("script");
extension.type = "text/javascript";
extension.src = "https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/roam-toggle-case/main/extension-roamjs.js";
document.getElementsByTagName("head")[0].appendChild(extension);