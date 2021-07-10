// Listen for browser / page actions and their events.
// Runs as a service worker when Chrome is launched

console.log("Image Blur extension is running.");

let isChrome = typeof chrome !== "undefined" && typeof browser === "undefined";
let ext = isChrome ? chrome : browser; // Extension API

// Tuned default parameters
let imageBlur = 10;
let imageOpacity = 50;
let imageContrast = 50;
let imageTransition = 0.3;
let blur = true;

ext.storage.local.set({ imageBlur });
ext.storage.local.set({ imageOpacity });
ext.storage.local.set({ imageContrast });
ext.storage.local.set({ imageTransition });
ext.storage.local.set({ blur });

//ext.runtime.onInstalled.addListener(() => {});
