var canvas = document.getElementById("canvas-content");
var canvas_context = canvas.getContext("2d");

//Paddle contructor and prototype
function Paddle (x, y) {
  this.xAxisPaddle = x;
  this.yAxisPaddle = y;
  this.paddleSpeed = 20;
}

Paddle.prototype = {
  render: function(){
    canvas_context.fillRect(this.xAxisPaddle, this.yAxisPaddle, this.width, this.height);
  },
  width: 10,
  //height: 50,
  height: 100,
  paddleMove: function(key){
    if(key == "ArrowUp" && this.yAxisPaddle >= this.paddleSpeed) {
      this.yAxisPaddle -= this.paddleSpeed;
      animate(step);
    } else if(key == "ArrowDown" && this.yAxisPaddle <= 450 - this.paddleSpeed) {
      this.yAxisPaddle += this.paddleSpeed;
      animate(step);
    } else {
      alert("You are out of room");
    };
  }
};

//Player paddle constructor and prototype
function Player(x, y) {
  return new Paddle(x, y);
}

Player.prototype = {
  render: Paddle.render,
  paddleMove: Paddle.move
};

//Computer paddle constructor and prototype
function Computer(x, y) {
  return new Paddle(x, y);
}

Computer.prototype = {
  render: Paddle.render
};

//Ball constructor and prototype
function Ball(x, y) {
  this.xAxis = x;
  this.yAxis = y;
  this.xSpeed = Math.random() * 2 + 0.25;
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
    this.xAxis += this.xSpeed;
    this.yAxis += this.ySpeed;
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
    console.log("right: " + right);
    console.log("top: " + top);
    console.log("left: " + left);
    console.log("bottom: " + bottom);

    //Check for Top or Bottom collisions
    if(top < 5) {
      this.yAxis = 5;
      this.ySpeed = -this.ySpeed;
    } else if(bottom > canvas.height - this.radius) {
      this.yAxis = canvas.height - 5;
      this.ySpeed = -this.ySpeed;
    }

    //Check for Paddle collisions
    console.log("xAxisPaddle: " + playerPaddle.xAxisPaddle);
    console.log("yAxisPaddle: " + playerPaddle.yAxisPaddle);
    console.log("width: " + playerPaddle.width);
    console.log("height: " + playerPaddle.height);
    console.log("xspeed: " + this.xSpeed);
    console.log("yspeed: " + this.ySpeed);

    if(right > (playerPaddle.xAxisPaddle) &&
      top > (playerPaddle.yAxisPaddle) &&
      bottom < (playerPaddle.yAxisPaddle + playerPaddle.height)) {
      this.xSpeed = -this.xSpeed;   // Change the direction
      this.ySpeed = -this.ySpeed;
      this.xAxis = canvas.width - 20; // Update x axis position
    }
    if(left < (computerPaddle.xAxisPaddle + computerPaddle.width) &&
      top > (computerPaddle.yAxisPaddle) &&
      bottom < (computerPaddle.yAxisPaddle + computerPaddle.height)) {
      this.xSpeed = -this.xSpeed;
      this.ySpeed = -this.ySpeed;
      this.xAxis = 20; // Update x axis position
    }

    // A player scored
    if(this.xAxis < 10 || this.xAxis > canvas.width - 10) {
      console.log("score");
      ballIsServed = false;
      canvas_context.clearRect(0, 0, canvas.width, canvas.height);
      computerPaddle.xAxisPaddle = 5;
      computerPaddle.yAxisPaddle = 225;
      playerPaddle.xAxisPaddle = 785;
      playerPaddle.yAxisPaddle = 225;
      pongBall.xAxis = 30;
      pongBall.yAxis = 250;
      render();
    }
  }
};

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

//Creates center line on canvas
function centerLine(){
  for (var y = 0.5; y < 500; y+= 5) {
  canvas_context.moveTo(400, y);
  canvas_context.lineTo(400, y+2);
  canvas_context.strokeStyle = 'black';
  canvas_context.stroke();
  };
}

//Flag for if ball served
var ballIsServed = false;

//Animation
var animate = window.requestAnimationFrame || function(step) {
   window.setTimeout(step, 1000/60) };

function step() {
  canvas_context.clearRect(0, 0, canvas.width, canvas.height);
  render();
  if (ballIsServed == true) {
    pongBall.ballMove();
  } else {
    window.cancelAnimationFrame;
  }
  animate(step);
};

//Onload and listeners
window.onload = function() {
  centerLine();
  render();
  //animate(step);
}

window.addEventListener("keydown", function(event) {
  if(event.code == "ArrowUp" || event.code == "ArrowDown") {
    playerPaddle.paddleMove(event.code);
  } else {
    alert("Please use the up and down arrows to move the paddle");
  };
}, true);

var playButton = document.getElementById("play-button");

playButton.addEventListener("click", function() {
  pongBall.ballServe();
});
