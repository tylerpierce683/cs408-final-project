// set up canvas
import { AppGlobals } from "./config.js";

const storedGlobals = localStorage.getItem('AppGlobals');
if (storedGlobals) {
  Object.assign(AppGlobals, JSON.parse(storedGlobals));
}

var canvas = document.querySelector("canvas");
var timeLabel = document.getElementById("time");
var scoreLabel = document.getElementById('score');
var gameEndMessage = document.getElementById("beat-level-msg");
var ctx;
var width;
var height;
const balls = [];
var won = false;
var numCurrentBalls = 0;
var evilCircle;

let lambda = document.getElementById("data-table");
let xhr;

if (AppGlobals.competitionMode || AppGlobals.extremeMode) {
  timeLabel.removeAttribute("hidden");
}

console.log("Extreme countdown: " + AppGlobals.extremeCountdown);

ctx = canvas.getContext("2d");

width = (canvas.width = window.innerWidth);
height = (canvas.height = window.innerHeight);
 
document.getElementById("back-to-menu").addEventListener("click", function() {
  window.location.href = "menu.html";
});

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

function updateScore() {
  scoreLabel.innerHTML = `Ball count: ${numCurrentBalls}`;
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
    console.log("difficulty: " + AppGlobals.difficulty);
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
          numCurrentBalls--;
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

  // Won in level mode
  if (numCurrentBalls == 0 && !won && AppGlobals.levelMode) {
    won = true;
    document.getElementsByTagName("canvas")[0].style.display = "none";
    document.getElementById("title").style.display = "none";
    document.getElementById("score").style.display = "none";
    document.getElementById("time").style.display = "none";
    var countdownTimer = 3;
    gameEndMessage.innerHTML = "Level complete! <br> Starting next level in " + countdownTimer + " seconds with " + (AppGlobals.numBalls + 2) + " balls!";
    var countdown = setInterval(function() {
      countdownTimer--;
      gameEndMessage.innerHTML = "Level complete! <br> Starting next level in " + countdownTimer + " seconds with " + (AppGlobals.numBalls + 2) + " balls!";
      if (countdownTimer == 0) {
        clearInterval(countdown);
        AppGlobals.numBalls += 2;
        localStorage.setItem('AppGlobals', JSON.stringify(AppGlobals));
        document.getElementById("title").style.display = "block";
        document.getElementById("score").style.display = "block";
        window.location.reload();
      }
    }, 1000);
  } 
  // Won in competition mode
  else if (numCurrentBalls == 0 && !won && AppGlobals.competitionMode) {
    won = true;
    document.getElementsByTagName("canvas")[0].style.display = "none";
    document.getElementById("title").style.display = "none";
    document.getElementById("score").style.display = "none";
    timeLabel.style.display = "none";
    gameEndMessage.innerHTML = "Congratulations! Your time was " + time + " seconds! <br> Refresh the page to play again!";
    console.log(time);
    document.getElementById("game-end").removeAttribute("hidden");

    //Scoreboard
    xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://ti2yb2ww1f.execute-api.us-east-2.amazonaws.com/scores/competition");
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log("id: " + Date.now().toString());
    xhr.send(JSON.stringify({
      "id": Date.now().toString(),
      "gamemode": "competition",
      "numBalls": AppGlobals.numBalls.toString(),
      "time": gameTimer.toFixed(2)
    }));
    xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
      lambda.innerHTML = "<tr><th>ID</th><th>Number of Balls</th><th>Time</th></tr>";
      if (xhr.status !== 200) {
        lambda.innerHTML += "<tr><td>Error loading data</td></tr>";
      } else if (xhr.response === "[]") {
        lambda.innerHTML += "<tr><td>No data found</td><td>No data found</td><td>No data found</td><td>No data found</td></tr>";
      } else {
        var dataList = JSON.parse(xhr.response);
        for (var i = 0; i < dataList.length; i++) {
          var object = dataList[i];
          var tableRow = "<tr><td>" + object.id + "</td>";
          console.log("scoreID: " + object.id);
          tableRow += "<td>" + object.numBalls + "</td>";
          tableRow += "<td>" + object.time + "</td>";
          lambda.innerHTML += tableRow;
        }
      }
    });
    xhr.open("GET", "https://ti2yb2ww1f.execute-api.us-east-2.amazonaws.com/scores");
    xhr.send();
  } 
  // Won in extreme mode
  else if (numCurrentBalls == 0 && !won && AppGlobals.extremeMode) {
    won = true;
    document.getElementsByTagName("canvas")[0].style.display = "none";
    document.getElementById("title").style.display = "none";
    document.getElementById("score").style.display = "none";
    timeLabel.style.display = "none";
    var countdownTimer = 3;
    var countdown = setInterval(function() {
      countdownTimer--;
      if (countdownTimer == 0) {
        clearInterval(countdown);
        AppGlobals.numBalls += 2;
        AppGlobals.extremeCountdown -= 0.5;
        console.log("got here " + AppGlobals.extremeCountdown)
        localStorage.setItem('AppGlobals', JSON.stringify(AppGlobals));
        document.getElementById("title").style.display = "block";
        document.getElementById("score").style.display = "block";
        window.location.reload();
      }
    }, 1000);
  }
  // Lost in extreme mode
  else if (AppGlobals.extremeMode && numCurrentBalls > 0 && gameTimer <= 0) {
    document.getElementsByTagName("canvas")[0].style.display = "none";
    document.getElementById("title").style.display = "none";
    document.getElementById("score").style.display = "none";
    timeLabel.style.display = "none";
    gameEndMessage.innerHTML = "You ran out of time! <br> Level " + (AppGlobals.numBalls + 1)/2 + " reached!";
    document.getElementById("game-end").removeAttribute("hidden");
  }
}

function addBalls(numberOfBalls) {
  while (balls.length < numberOfBalls) {
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
    numCurrentBalls++;
    updateScore();
  }
}

addBalls(AppGlobals.numBalls);

if (AppGlobals.competitionMode) {
  var gameTimer = 0;
  var countdown = setInterval(function() {
    gameTimer += 0.01;
    timeLabel.innerHTML = `Time: ${gameTimer.toFixed(2)}`;
    if (numCurrentBalls == 0) {
      gameEndMessage.innerHTML = "Congratulations! You ate " + AppGlobals.numBalls + " balls in " + gameTimer.toFixed(2) + " seconds!";
      clearInterval(countdown);
    }
  }, 10);  
}

if (AppGlobals.extremeMode) {
  var gameTimer = AppGlobals.extremeCountdown;
  console.log("gameTimer: " + gameTimer);
  var countdown = setInterval(function() {
    gameTimer -= 0.01;
    timeLabel.innerHTML = `Time: ${gameTimer.toFixed(2)}`;
    if (numCurrentBalls == 0) {
      gameEndMessage.innerHTML = "Congratulations! You ate " + AppGlobals.numBalls + " balls with " + gameTimer.toFixed(2) + " seconds left! <br> The next level will start with " + (AppGlobals.numBalls + 2) + " balls and you'll have " + (AppGlobals.extremeCountdown - 0.5) + " seconds";
      clearInterval(countdown);
    }
  }, 10);  
}

evilCircle = new EvilCircle(50, 50);

loop();




