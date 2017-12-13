var canvas = document.getElementById("canvas-content");
var canvas_context = canvas.getContext("2d");

//Paddle contructor and prototype
function Paddle (x, y) {
  this.xAxis = x;
  this.yAxis = y;
  this.paddleSpeed = 5;
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
  paddleMove: function(key){
    if(key == "ArrowUp" && this.yAxis >= this.paddleSpeed) {
      this.delete();
      this.yAxis -= this.paddleSpeed;
      animate(step);
    } else if(key == "ArrowDown" && this.yAxis <= 450 - this.paddleSpeed) {
      this.delete();
      this.yAxis += this.paddleSpeed;
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
  //this.serveSpeed = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
  this.serveSpeed = 5;
  this.speed = this.serveSpeed;
  //this.serveAngle = Math.floor(Math.random() * ((this.serveSpeed - 5) - 5 + 1)) + 5;
  this.serveAngle = Math.floor(Math.random() * (this.serveSpeed - 2 + 1)) + 2;
  this.angle = this.serveAngle;
  this.distanceMoveOnY = this.xAxis - this.speed;
  this.yAddOrSubtract = true;
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
  deleteBall: function() {
    canvas_context.beginPath();
    canvas_context.clearRect(this.xAxis - this.radius - 1, this.yAxis - this.radius - 1, this.radius * 2 + 2, this.radius * 2 + 2);
    canvas_context.closePath();
  },
  radius: 10,
  startAngle: 0,
  endAngle: 2 * Math.PI,
  counterClockwise: false,
  ballServe: function(){
    this.deleteBall();
    this.xAxis += (this.serveSpeed - this.serveAngle);
    var AddOrSubtract = (Math.random() < 0.5);
    this.yAddOrSubtract = AddOrSubtract;
    this.yAxis = this.yAddOrSubtract ? this.yAxis + this.distanceMoveOnY : this.yAxis - this.distanceMoveOnY;
    ballIsServed = true;
    animate(step);
  },
  ballMove: function(){
    var distanceMoveOnX = this.speed - this.angle;

    //Establish iner border using the ball diameter and twice the distance move in a step
    var innerRightBorder = 800 - distanceMoveOnX * 2 - 20;
    var innerLeftBorder = distanceMoveOnX * 2 + 20;
    var innerTopBorder = this.distanceMoveOnY * 2 + 20;
    var innerBottomBorder = 500 - this.distanceMoveOnY * 2 - 20;
    console.log("innerRightBorder: " + innerRightBorder);
    console.log("innerLeftBorder: " + innerLeftBorder);
    console.log("innerTopBorder: " + innerTopBorder);
    console.log("innerBottomBorder: " + innerBottomBorder);
    //Change from serve to moving
    this.deleteBall();
    this.xAxis += distanceMoveOnX;
    this.yAxis = this.yAddOrSubtract ? this.yAxis + this.distanceMoveOnY : this.yAxis - this.distanceMoveOnY;
    console.log("the x axis: " + this.xAxis);
    console.log("the y axis: " + this.yAxis);
    //debugger   // TODO:
    //If ball edge is within the inner border keep moving in same direction
    if (this.xAxis < innerRightBorder && this.xAxis > innerLeftBorder && this.yAxis > innerTopBorder && this.yAxis < innerBottomBorder) {
      animate(step);
    //If ball edge is outside the inner border on the x axis stop game and add a score
    } else if (this.xAxis >= innerRightBorder || this.xAxis <= innerLeftBorder) {
        console.log("score");
        if (this.xAxis >=innerRightBorder){
          this.xAxis += (790 - this.xAxis);
        } else {
          this.xAxis -= (this.xAxis - 10);
        };
        ballIsServed = false;
        this.deleteBall();
    //If ball edge is outside the inner border on the y axis but not the x axis deflect
    } else if (this.yAxis <= innerTopBorder && this.xAxis < innerRightBorder && this.xAxis > innerLeftBorder) {
      console.log("*************************************")
      console.log("deflect from top");
      //this.yAxis -= this.yAxis - 10;
      this.deleteBall();
      this.yAddOrSubtract = true;
      animate(step);
    } else if (this.yAxis >= innerBottomBorder && this.xAxis < innerRightBorder && this.xAxis > innerLeftBorder) {
      console.log("*************************************")
      console.log("deflect from bottom");
      this.deleteBall();
      this.yAddOrSubtract = false;
      animate(step);
    //If ball outside the playing area stop the game
    } else {
      console.log("shutting down");
      ballIsServed = false;
      //stopAnimate(myRequest);
      this.deleteBall();
    };
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
var animate = window.requestAnimationFrame || function(step) { window.setTimeout(step, 1000/60) };
//var stopAnimate = window.cancelAnimationFrame

//var myReq;

function step() {
  animate(step);
  if (ballIsServed == true) {
    pongBall.ballMove();
  };
  render();
};

//myReq = requestAnimationFrame(step);

//Onload and listeners
window.onload = function() {
  centerLine();
  animate(step);
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
