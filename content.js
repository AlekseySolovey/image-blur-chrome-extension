class Logger {
  dev = true; // true -> development; false -> production

  log(data, type = "log") {
    if (this.dev == false) return;
    if (typeof console[type] === "undefined") return;
    console[type](data);
  }
}

const cnsl = [
  "log",
  "warn",
  "error",
  "table",
  "assert",
  "clear",
  "count",
  "group",
  "groupCollapsed",
  "groupEnd",
  "info",
  "time",
  "timeEnd",
  "trace",
];

cnsl.forEach((type) => {
  if (typeof Logger.prototype[type] === "function") return;
  Logger.prototype[type] = (msg) => this.log(msg, type);
});

const logger = new Logger();
logger.dev = false;

// Execute and manipulate code when the page loads.

logger.log("Chrome extension is active.");

// TODO: add a listener for a button from the background service worker
//       to blur out images only when you need to and not immediately
// TODO: remove custom css class when the button was toggled off
// TODO: add sliders for image parameters, for example:
//       1 <= imageBlue <= 20 (px)
//       1 <= imageOpacity < 100 (%)
//       0.1 <= imageTransition <= 5 (s)

// Tuned parameters
let imageBlur = 10;
let imageOpacity = 50;
let imageContrast = 50;
let imageTransition = 0.3;

// Custom class with a blur effect and a transition
const cssClass = `._image_blur_class{ \
  filter:blur(${imageBlur}px) opacity(${imageOpacity}%) \
  contrast(${imageContrast}%); \
  transition:${imageTransition}s; transition-timing-function:ease-in; }`;
// revert back to original image
const cssOnHover = "._image_blur_class:hover{filter:none;}";
const mergedCss = cssClass + " " + cssOnHover;

function addBlurEffect() {
  // create and push a new style tag
  const style = document.createElement("style");

  // add the custom css to the new style (only when needed)
  if (style.styleSheet) {
    style.styleSheet.cssText = mergedCss;
  } else {
    style.appendChild(document.createTextNode(mergedCss));
  }
  document.getElementsByTagName("head")[0].appendChild(style);

  // add a new css class to all images
  let images = document.getElementsByTagName("img");
  for (img of images) {
    img.className += " _image_blur_class";
  }
}

function removeBlurEffect() {
  // remove "_image_blur_class" from all images
  let images = document.getElementsByTagName("img");
  for (img of images) {
    if (img.classList.contains("_image_blur_class")) {
      img.classList.remove("_image_blur_class");
    }
  }
}

let isChrome = typeof chrome !== "undefined" && typeof browser === "undefined";
let ext = isChrome ? chrome : browser; // Extension API

chrome.runtime.onMessage.addListener(messageHandler);

// Message listener for background script
function messageHandler(request, sender, sendResponse) {
  if (request.text == "blur-toggle") {
    // run blur code
    if (request.blur) {
      logger.log("Add blur effect");
      addBlurEffect();
    } else {
      logger.log("Remove blur effect");
      removeBlurEffect();
    }
  }
}
