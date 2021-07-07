// Listen for browser / page actions and their events.

console.log("Service worker running.");

var isChrome = typeof chrome !== "undefined" && typeof browser === "undefined";
var ext = isChrome ? chrome : browser; // Extension API


