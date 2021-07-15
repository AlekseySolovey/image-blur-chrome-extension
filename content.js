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
logger.dev = true;

// Execute and manipulate code when the page loads.

logger.log("Chrome extension is active.");

let isChrome = typeof chrome !== "undefined" && typeof browser === "undefined";
let ext = isChrome ? chrome : browser; // Extension API

// TODO: add sliders for image parameters, for example:
//       1 <= imageBlue <= 20 (px)
//       1 <= imageOpacity < 100 (%)
//       0.1 <= imageTransition <= 5 (s)

const toPromise = (callback) => {
  const promise = new Promise((resolve, reject) => {
    try {
      callback(resolve, reject);
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

let mergedCss = "";

function updateImageSettings() {
  let promises = [];
  ["imageBlur", "imageOpacity", "imageContrast", "imageTransition"].forEach(
    (option) => {
      promises.push(
        toPromise((resolve, reject) => {
          chrome.storage.local.get(option, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            }
            let res = {};
            res[option] = response[option];
            resolve(res);
          });
        })
      );
    }
  );

  return Promise.all(promises).then((data) => {
    var settings = data.reduce(function (map, obj) {
      let [key] = Object.keys(obj);
      map[key] = obj[key];
      return map;
    }, {});
    mergedCss = setCSS(settings);
    return mergedCss;
  });
}

function setCSS(settings) {
  const cssClass = `._image_blur_class{ \
    filter:blur(${settings.imageBlur}px) opacity(${settings.imageOpacity}%) \
    contrast(${settings.imageContrast}%); \
    transition:${settings.imageTransition}s; transition-timing-function:ease-in; }`;
  // revert back to original image
  const cssOnHover = "._image_blur_class:hover{filter:none;}";
  const mergedCss = cssClass + " " + cssOnHover;
  return mergedCss;
}

// create and push a new style tag
const style = document.createElement("style");
// add the custom css to the new style (only when needed)
let defaultCssClass = "._image_blur_class{} ._image_blur_class:hover{}";
if (style.styleSheet) {
  style.styleSheet.cssText = defaultCssClass;
} else {
  style.appendChild(document.createTextNode(defaultCssClass));
}
document.getElementsByTagName("head")[0].appendChild(style);

let customStyles = [];
let styles = document.getElementsByTagName("style");
for (i in Object.values(styles)) {
  let s = styles[i];
  if (s && s.innerHTML && s.innerText.includes("._image_blur_class")) {
    customStyles.push(s);
  }
}

function addBlurEffect() {
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

ext.runtime.onMessage.addListener(messageHandler);

// Message listener for background script
function messageHandler(request, sender, sendResponse) {
  updateImageSettings().then((data) => {
    let [style] = customStyles;
    style.innerText = data;
    //console.log("Content request:", request);
    if (request.text == "blur-toggle") {
      // run blur code
      if (request.blur) {
        //logger.log("Add blur effect");
        addBlurEffect();
      } else {
        //logger.log("Remove blur effect");
        removeBlurEffect();
      }
    }
  });
}
