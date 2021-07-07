// Listen for browser / page actions and their events.

console.log("Service worker running.");

var isChrome = typeof chrome !== "undefined" && typeof browser === "undefined";
var ext = isChrome ? chrome : browser; // Extension API

// TODO: add an event listener to a button and 
//       execute code in content.js
