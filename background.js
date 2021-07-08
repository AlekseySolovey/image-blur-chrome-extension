// Listen for browser / page actions and their events.
// Runs as a service worker when Chrome is launched

console.log("Image Blur extension is running.");

let isChrome = typeof chrome !== "undefined" && typeof browser === "undefined";
let ext = isChrome ? chrome : browser; // Extension API

// TODO: add an event listener to a button and
//       execute code in content.js

let action = isChrome ? chrome.action : browser.browserAction;

action.onClicked.addListener(buttonClicked);

let blur = true;

function buttonClicked(tab) {
  let msg = {
    text: "blur-toggle",
    blur: blur,
  };
  blur = !blur; // toggle between true and false
  chrome.tabs.sendMessage(tab.id, msg);
}
