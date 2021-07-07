// Execute and manipulate code when the page loads.

console.log("Chrome extension is active.");

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

// create and push a new style tag with custom css
const style = document.createElement("style");
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
