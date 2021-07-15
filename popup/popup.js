// Handle extension settings and functions

console.log("Popup is active");

let isChrome = typeof chrome !== "undefined" && typeof browser === "undefined";
let ext = isChrome ? chrome : browser; // Extension API

// document.addEventListener("DOMContentLoaded", () => {});

const sliders = {
  imageBlur: {
    slider: document.getElementById("imageBlur"),
    amount: document.getElementById("imageBlurAmount"),
  },
  imageOpacity: {
    slider: document.getElementById("imageOpacity"),
    amount: document.getElementById("imageOpacityAmount"),
  },
  imageContrast: {
    slider: document.getElementById("imageContrast"),
    amount: document.getElementById("imageContrastAmount"),
  },
  imageTransition: {
    slider: document.getElementById("imageTransition"),
    amount: document.getElementById("imageTransitionAmount"),
  },
};

// preaload default settings from background.js
for (let option in sliders) {
  ext.storage.local.get(option, (response) => {
    sliders[option].slider.value = response[option];
    sliders[option].amount.innerHTML = response[option];
  });
}

// add onchange listeners to sliders
// if changed: save new values to storage
for (let option in sliders) {
  sliders[option].slider.onchange = (e) => {
    sliders[option].amount.innerHTML = sliders[option].slider.value;
    let val = { [option]: sliders[option].slider.value };
    ext.storage.local.set(val);
  };
}

const button = document.getElementById("blurImages");
button.addEventListener("click", buttonClicked);

function buttonClicked(event) {
  let query = { currentWindow: true, active: true };

  // send the message to the current tab
  ext.tabs.query(query).then((tabs) => {
    ext.storage.local.get("blur", ({ blur }) => {
      let msg = {
        text: "blur-toggle",
        blur: blur,
      };
      blur = !blur; // toggle between true and false
      ext.storage.local.set({ blur });
      // content.js has a listener with messageHandler()
      ext.tabs.sendMessage(tabs[0].id, msg);
    });
  });
}
