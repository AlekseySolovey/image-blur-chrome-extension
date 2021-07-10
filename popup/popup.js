// Handle extension settings and functions

console.log("Popup is active");

let isChrome = typeof chrome !== "undefined" && typeof browser === "undefined";
let ext = isChrome ? chrome : browser; // Extension API

document.addEventListener("DOMContentLoaded", () => {
  ["imageBlur", "imageOpacity", "imageContrast", "imageTransition"].forEach(
    (option) => {
      ext.storage.local.get(option, (response) => {
        document.getElementById(option).value = response[option];
      });
    }
  );
});

const imageBlurInput = document.getElementById("imageBlur");
const imageOpacityInput = document.getElementById("imageOpacity");
const imageContrastInput = document.getElementById("imageContrast");
const imageTransitionInput = document.getElementById("imageTransition");

imageBlurInput.addEventListener("input", (event) => {
  let imageBlur = Number(event.target.value);
  ext.storage.local.set({ imageBlur });
});
imageOpacityInput.addEventListener("input", (event) => {
  let imageOpacity = Number(event.target.value);
  ext.storage.local.set({ imageOpacity });
});
imageContrastInput.addEventListener("input", (event) => {
  let imageContrast = Number(event.target.value);
  ext.storage.local.set({ imageContrast });
});
imageTransitionInput.addEventListener("input", (event) => {
  let imageTransition = Number(event.target.value);
  ext.storage.local.set({ imageTransition });
});

const button = document.getElementById("blurImages");
button.addEventListener("click", buttonClicked);

function buttonClicked(event) {
  let query = { currentWindow: true, active: true };

  ext.tabs.query(query).then((tabs) => {
    ext.storage.local.get("blur", ({ blur }) => {
      let msg = {
        text: "blur-toggle",
        blur: blur,
      };
      blur = !blur; // toggle between true and false
      ext.storage.local.set({ blur });
      ext.tabs.sendMessage(tabs[0].id, msg);
    });
  });
}
