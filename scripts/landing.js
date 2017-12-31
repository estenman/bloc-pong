var canvas = document.getElementById("canvas-content");
var canvas_context = canvas.getContext("2d");

//Paddle contructor and prototype
function Paddle (x, y) {
  this.xAxisPaddle = x;
  this.yAxisPaddle = y;
}

Paddle.prototype = {
  render: function(){
    canvas_context.fillRect(this.xAxisPaddle, this.yAxisPaddle, this.width, this.height);
  },
  width: 10,
  height: 75,
  move: function(key, paddleSpeed){
    if(key == "ArrowUp" && this.yAxisPaddle >= paddleSpeed) {
      this.yAxisPaddle -= paddleSpeed;
    } else if(key == "ArrowDown" && this.yAxisPaddle <= 450 - paddleSpeed) {
      this.yAxisPaddle += paddleSpeed;
    }
  },
  update: function(pongBall){
    if (pongBall.ySpeed < 0){
      this.move("ArrowUp", .25);
    } else {
      this.move("ArrowDown", .25);
    }
  }
};

//Player paddle constructor and prototype
function Player(x, y) {
  return new Paddle(x, y);
}

Player.prototype = {
  render: Paddle.render
};

//Computer paddle constructor and prototype
function Computer(x, y) {
  return new Paddle(x, y);
}

Computer.prototype = {
  render: Paddle.render,
  update: Paddle.update
};

//Ball constructor and prototype
function Ball(x, y) {
  this.xAxis = x;
  this.yAxis = y;
  this.xSpeed = Math.random() * 2 + 1;
  this.ySpeed = Math.random() * 2 + -2;
}

Ball.prototype = {
  render: function(){
    canvas_context.beginPath();
    canvas_context.arc(this.xAxis, this.yAxis, this.radius, this.startAngle, this.endAngle, this.counterClockwise);
    canvas_context.closePath();
    canvas_context.strokeStyle = 'black';
    canvas_context.stroke();
    canvas_context.fillStyle = 'black';
    canvas_context.fill();
  },
  radius: 10,
  startAngle: 0,
  endAngle: 2 * Math.PI,
  counterClockwise: false,
  ballServe: function(){
    ballIsServed = true;
    animate(step);
  },
  ballMove: function(){
    this.xAxis += this.xSpeed;
    this.yAxis += this.ySpeed;

    var right = this.xAxis + 5;
    var top = this.yAxis + 5;
    var left = this.xAxis - 5;
    var bottom = this.yAxis - 5;

    //Check for Top or Bottom collisions
    if(top < 5) {
      this.yAxis = 5;
      this.ySpeed = -this.ySpeed;
    } else if(bottom > canvas.height - this.radius) {
      this.yAxis = canvas.height - 5;
      this.ySpeed = -this.ySpeed;
    }

    //Check for Paddle collisions
    if(right > (playerPaddle.xAxisPaddle) &&
      top > (playerPaddle.yAxisPaddle) &&
      bottom < (playerPaddle.yAxisPaddle + playerPaddle.height)) {
      this.xSpeed = -this.xSpeed;   // Change the direction
      this.ySpeed = -this.ySpeed * (Math.random() * (2-.1) + .1); // Change the direction and angle
      this.xAxis = canvas.width - 20; // Update x axis position
    }
    if(left < (computerPaddle.xAxisPaddle + computerPaddle.width) &&
      top > (computerPaddle.yAxisPaddle) &&
      bottom < (computerPaddle.yAxisPaddle + computerPaddle.height)) {
      this.xSpeed = -this.xSpeed;
      this.ySpeed = -this.ySpeed * (Math.random() * (2-.1) + .1);
      this.xAxis = 20; // Update x axis position
    }

    // A player scored
    if(this.xAxis < 10 || this.xAxis > canvas.width - 10) {
      if(this.xAxis < 10) {
        playerScore += 1;
        playerScoreDisplay.innerHTML = playerScore;
      } else {
        computerScore += 1
        computerScoreDisplay.innerHTML = computerScore;
      };
      restart();
    }
  }
};

//Restart after a score function
function restart () {
  if(playerScore == 11 || computerScore == 11){
    gameOverDisplay.style.display = "block";
    if(playerScore == 11){
      gameOverMessage.innerHTML = "You won!"
    } else {
      gameOverMessage.innerHTML = "You lost!"
    }
    computerScore = 0;
    playerScore = 0;
    ballIsServed = false;
    console.log("game over");
  } else {
    computerPaddle = new Computer(5, 225);
    playerPaddle = new Player(785, 225);
    pongBall = new Ball(30, 250);
  }
}

//Creates instances of the paddles and ball
var computerPaddle = new Computer(5, 225);
var playerPaddle = new Player(785, 225);
var pongBall = new Ball(30, 250);

//Renders the paddles and ball
function render(){
  computerPaddle.render();
  playerPaddle.render();
  pongBall.render();
}

//Flag for if ball served
var ballIsServed = false;

//Scoring variables
var computerScore = 0;
var playerScore = 0;

//Animation
var animate = window.requestAnimationFrame || function(step) {
   window.setTimeout(step, 1000/60) };

function step() {
  canvas_context.clearRect(0, 0, canvas.width, canvas.height);
  render();
  if (ballIsServed == true && pongBall.xSpeed > 0) {
    pongBall.ballMove();
    animate(step);
  } else if (ballIsServed == true && pongBall.xSpeed < 0) {
    pongBall.ballMove();
    computerPaddle.update(pongBall);
    animate(step);
  } else {
    window.cancelAnimationFrame;
  }
};

//Onload and listeners
window.onload = function() {
  render();
  gameOverDisplay.style.display = "none";
}

window.addEventListener("keydown", function(event) {
  if(event.code == "ArrowUp" || event.code == "ArrowDown") {
    playerPaddle.move(event.code, 20);
  }
}, true);

var playButton = document.getElementById("play-button");
var computerScoreDisplay = document.getElementById("computer-score");
var playerScoreDisplay = document.getElementById("player-score");
var gameOverDisplay = document.getElementById("game-over");
var gameOverMessage = document.getElementById("game-over-message");

playButton.addEventListener("click", function() {
  pongBall.ballServe();
});
