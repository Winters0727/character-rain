import { getRandomNumber } from "./utils.js";

const counter = document.getElementById("remain-char-counter");

class Char {
  constructor(attrs) {
    this.x = attrs.x;
    this.y = attrs.y;
    this.dy = attrs.dy;
    this.char = attrs.char;
    this.color = [
      getRandomNumber(0, 255),
      getRandomNumber(0, 255),
      getRandomNumber(0, 255),
    ];
    this.dColor = [
      getRandomNumber(1, 10),
      getRandomNumber(1, 10),
      getRandomNumber(1, 10),
    ];

    if (!Char.app && attrs.app) Char.app = attrs.app;

    this.heightLimit = Char.app.height * 0.8;
  }

  updateColor() {
    this.color = this.color.map((value, index) => {
      if (this.dColor[index] > 0) {
        if (value > 255) {
          this.dColor[index] = -Math.abs(this.dColor[index]);
        }
      } else {
        if (value < 0) {
          this.dColor[index] = Math.abs(this.dColor[index]);
        }
      }
      return value + this.dColor[index];
    });
  }

  update() {
    this.y += this.dy;
  }

  draw() {
    this.updateColor();
    Char.app.ctx.fillStyle = `rgba(${this.color.join(", ")}, ${(this.y >
    this.heightLimit
      ? 1 - (this.y - this.heightLimit) / (Char.app.height - this.heightLimit)
      : 1
    ).toFixed(1)})`;
    Char.app.ctx.fillText(this.char, this.x, this.y);
  }
}

export class App {
  constructor(attrs) {
    this.canvas = attrs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.width = attrs.width;
    this.height = attrs.height;
    this.fps = attrs.fps;
    this.fontSize = attrs.fontSize || 32;
    this.fontFamily = attrs.fontFamily || "serif";
    this.interval = attrs.interval;
    this.splitState = "char";
    this.inputs = [];
    this.chars = [];

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  addChars(newInputs) {
    this.inputs = this.inputs.concat(
      newInputs.split(this.splitState === "char" ? "" : " ")
    );
  }

  render() {
    let now, delta, lastCharAdded;
    let then = Date.now();

    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;

    const frame = () => {
      requestAnimationFrame(frame);

      now = Date.now();
      delta = now - then;

      if (delta < this.fps) return;

      if (
        this.inputs.length > 0 &&
        (!lastCharAdded || now - lastCharAdded > this.interval)
      ) {
        const newChar = new Char({
          x: getRandomNumber(this.fontSize, this.width - this.fontSize),
          y: 0,
          dy: getRandomNumber(3, 7),
          char: this.inputs.shift(),
          app: this,
        });

        this.chars.push(newChar);
        lastCharAdded = now;
      }

      this.ctx.clearRect(0, 0, this.width, this.height);

      if (this.chars.length > 0) {
        for (const [charIndex, char] of this.chars.entries()) {
          if (char.y > this.height + this.fontSize) {
            this.chars = this.chars.filter((_, index) => index !== charIndex);
          }

          char.update();
          char.draw();
        }
      }

      then = now - (delta % this.fps);

      counter.innerText = `남은 문자 개수: ${this.chars.length}`;
    };

    requestAnimationFrame(frame);
  }
}
