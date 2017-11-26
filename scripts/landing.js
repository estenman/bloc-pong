var canvas = document.getElementById("canvas-content");
var canvas_context = canvas.getContext("2d");

function Player() {
  this.xAxis = 785;
  this.yAxis = 225;
  this.width = 10;
  this.height = 50;
}

Player.prototype = {
  render: function(){
    canvas_context.fillRect(this.xAxis, this.yAxis, this.width, this.height);
  }
};

function Computer() {
  this.xAxis = 5;
  this.yAxis = 225;
  this.width = 10;
  this.height = 50;
}

Computer.prototype = {
  render: function(){
    canvas_context.fillRect(this.xAxis, this.yAxis, this.width, this.height);
  }
};

function Ball() {
  this.xAxis = 400;
  this.yAxis = 250;
  this.radius = 10;
  this.startAngle = 0;
  this.endAngle = 2 * Math.PI;
  this.counterClockwise = false;
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
  }
};

function render(){
  var computerPaddle = new Computer();
  var playerPaddle = new Player();
  var pongBall = new Ball();

  computerPaddle.render();
  playerPaddle.render();
  pongBall.render();
}

function centerLine(){
  for (var y = 0.5; y < 500; y+= 5) {
  canvas_context.moveTo(400, y);
  canvas_context.lineTo(400, y+2);
  canvas_context.strokeStyle = 'black';
  canvas_context.stroke();
  };
}

window.onload = function() {
  render();
  centerLine();
}
