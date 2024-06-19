import { App } from "./app.js";
import { getRandomNumber } from "./utils.js";

const canvas = document.getElementById("rain-canvas");
const input = document.getElementById("characters-input");

const app = new App({
  canvas,
  width: 1024,
  height: 960,
  fps: 1000 / 60,
  interval: 100,
  fontSize: 48,
  fontFamily: "BaeminJua",
});

window.addEventListener("load", () => {
  app.render();
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    app.addChars(input.value);
    input.value = "";
  }
});
