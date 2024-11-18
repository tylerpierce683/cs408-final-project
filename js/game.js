// set up canvas
import { AppGlobals } from "./config.js";

print("difficulty: " + AppGlobals.keyControl);
var canvas = document.querySelector("canvas");
var scoreLabel = document.getElementById('score');
var ctx;
var width;
var height;
const balls = [];
var won = false;
var numBalls = 0;
var evilCircle;

ctx = canvas.getContext("2d");

width = (canvas.width = window.innerWidth);
height = (canvas.height = window.innerHeight);
 
// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

function updateScore() {
  scoreLabel.innerHTML = `Ball count: ${numBalls}`;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = true;
  }
}


class EvilCircle extends Shape {
  constructor(x, y) {
    print("difficulty: " + AppGlobals.difficulty);
    switch (AppGlobals.difficulty) {
      case "easy":
        super(x, y, AppGlobals.EASY_VELOCITY, AppGlobals.EASY_VELOCITY);
        break;
      case "medium":
        super(x, y, AppGlobals.MED_VELOCITY, AppGlobals.MED_VELOCITY);
        break;
      case "hard":
        super(x, y, AppGlobals.HARD_VELOCITY, AppGlobals.HARD_VELOCITY);
        break;
      default:
        super(x, y, 20, 20);
        break;
    }
    
    this.color = 'rgb(255, 255, 255)';
    switch (AppGlobals.difficulty) {
      case "easy":
        this.size = AppGlobals.EASY_SIZE;
        break;
      case "medium":
        this.size = AppGlobals.MED_SIZE;
        break;
      case "hard":
        this.size = AppGlobals.HARD_SIZE;
        break;
    }
    if (AppGlobals.keyControl) {
      window.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "a":
            this.x -= this.velX;
            break;
          case "d":
            this.x += this.velX;
            break;
          case "w":
            this.y -= this.velY;
            break;
          case "s":
            this.y += this.velY;
            break;
        }
      });
    } else if (AppGlobals.mouseControl) {
      switch (AppGlobals.difficulty) {
        case "easy":
          window.addEventListener('mousemove', (e) => {
            this.x = e.clientX;
            this.y = e.clientY;
          });
          break;
        case "medium":
        case "hard":
          window.addEventListener('mousemove', (e) => {
            if (this.x < e.clientX) {
              this.x += this.velX;
            } else if (this.x > e.clientX) {
              this.x -= this.velX;
            } else if (this.y < e.clientY) {
              this.y += this.velY;
            } else if (this.y > e.clientY) {
              this.y -= this.velY;
            }
          });
          break;
        default:
          console.log("error");
      }
      
    }
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }

    if (this.x - this.size <= 0) {
      this.x += this.size;
    }

    if (this.y + this.size >= height) {
      this.y -= this.size;
    }

    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }

  
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          numBalls--;
          updateScore();
        }
      }
    }
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;

  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && this.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

function loop() {

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }

    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();
  }

  requestAnimationFrame(loop);

  if (numBalls == 0 && !won) {
    alert("Congratulations! You won! Close this dialogue and refresh the page to play again!");
    won = true;
  }
}

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
  // ball position always drawn at least one ball width
  // away from the edge of the canvas, to avoid drawing errors
  random(0 + size, width - size),
  random(0 + size, height - size),
  random(-7, 7),
  random(-7, 7),
  randomRGB(),
  size
  );

  balls.push(ball);
  numBalls++;
  updateScore();
}
  
evilCircle = new EvilCircle(50, 50);

loop();


