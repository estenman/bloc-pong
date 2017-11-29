var canvas = document.getElementById("canvas-content");
var canvas_context = canvas.getContext("2d");

//Paddle contructor and prototype
function Paddle (x, y) {
  this.xAxis = x;
  this.yAxis = y;
  this.speed = 5;
}

Paddle.prototype = {
  render: function(){
    canvas_context.fillRect(this.xAxis, this.yAxis, this.width, this.height);
  },
  delete: function(){
    canvas_context.clearRect(this.xAxis, this.yAxis, this.width, this.height);
  },
  width: 10,
  height: 50,
  move: function(key){
    if(key == "ArrowUp" && this.yAxis >= this.speed) {
      this.delete();
      this.yAxis -= this.speed;
      animate(step);
    } else if(key == "ArrowDown" && this.yAxis <= 450 - this.speed) {
      this.delete();
      this.yAxis += this.speed;
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
  move: Paddle.move
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
  counterClockwise: false
};

//Creates instances of the paddles and ball
var computerPaddle = new Computer(5, 225);
var playerPaddle = new Player(785, 225);
var pongBall = new Ball(400, 250);

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

//Animation
var animate = window.requestAnimationFrame || function(step) { window.setTimeout(step, 1000/60) };

function step() {
  animate(step);
  render();
};

//Onload and listeners
window.onload = function() {
  centerLine();
  animate(step);
}

window.addEventListener("keydown", function(event) {
  if(event.code == "ArrowUp" || event.code == "ArrowDown") {
    playerPaddle.move(event.code);
  } else {
    alert("Please use the up and down arrows to move the paddle");
  };
}, true);
