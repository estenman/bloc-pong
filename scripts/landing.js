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
  this.serveSpeed = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
  this.speed = this.serveSpeed;
  this.serveAngle = Math.floor(Math.random() * ((this.serveSpeed - 5) - 5 + 1)) + 5;
  this.angle = this.serveAngle;
  this.remaining = this.xAxis - this.speed;
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
    this.yAxis = this.yAddOrSubtract ? this.yAxis + this.remaining : this.yAxis - this.remaining;
    ballIsServed = true;
    animate(step);
    //this.ballMove();
  },
  ballMove: function(){
    this.deleteBall();
    this.xAxis += (this.speed - this.angle);
    console.log("************************************************************");
    console.log("The xaxis is " + this.xAxis);
    this.yAxis = this.yAddOrSubtract ? this.yAxis + this.remaining : this.yAxis - this.remaining;
    console.log("The yaxis is " + this.yAxis);

    console.log("1: x < 800-speed-angle-10 : " + this.xAxis  + " < " + (800 - (this.speed -this.angle) - 10) + "=" + (this.xAxis < (800 - (this.speed -this.angle) - 10)));
    console.log("2: x < 0-(speed-angle)+10 : " + this.xAxis + " > " + (0 + (this.speed - this.angle) + 10) + "=" + (this.xAxis > (0 + (this.speed - this.angle) + 10)));
    console.log("3: y < 10+remaining : " + this.yAxis + " > " + 20 + "=" + (this.yAxis > 20));
    console.log("4: y < 500-remaining-10 : " +  + this.yAxis + " < " + 480 + "=" + (this.yAxis < 480));

    //if (this.xAxis < (800 - (this.speed -this.angle) - 10) && this.xAxis >= (0 + (this.speed - this.angle) + 10) && this.yAxis >= (10 + this.remaining) && this.yAxis <= (500 - this.remaining - 10)){
    if (this.xAxis < (800 - (this.speed -this.angle) - 10) && this.xAxis >= (0 + (this.speed - this.angle) + 10) && this.yAxis >= 20 && this.yAxis <= 480){
      console.log("More debugging when all is true.....");
      console.log("xAxis: " + this.xAxis);
      console.log("yAxis: " + this.yAxis);
      console.log("speed: " + this.speed);
      console.log("remaining: " + this.remaining);
      console.log("angle: " + this.angle);
      console.log("top: " + 20);
      console.log("bottom: " + 480);

      console.log('check for top collision:' + this.yAxis + " <= " + (20 + this.remaining*2) + " = " + (this.yAxis <= (20 + this.remaining*2)));
      console.log('check for bottom collision:' + this.yAxis + " >= " + (480 - this.remaining*2) + " = " + (this.yAxis >= (480 - this.remaining*2)));
      //debugger   // TODO:  Let's review how to use the Javascript debugger in our next meeting
      if (this.yAxis <= (20 + this.remaining*2)){
      //if (this.yAxis <= 10){
        //collision detected
        console.log("collided with top");
        this.deleteBall();
        this.xAxis += (this.speed - this.angle);
        this.yAddOrSubtract = true;
        this.yAxis += this.remaining;
        animate(step);
      } else if (this.yAxis >= (480 - this.remaining*2)){
      //} else if (this.yAxis >= 490){
        //collision detected
        console.log("collided with bottom");
        this.deleteBall();
        this.xAxis += (this.speed - this.angle);
        this.yAddOrSubtract = false;
        this.yAxis -= this.remaining;
        animate(step);
      } else {
        console.log("defaulted to else");
        animate(step);
      };
    } else {
      console.log("done");
      //this.deleteBall();
      ballIsServed = false;
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

function step() {
  animate(step);
  if (ballIsServed == true) {
    pongBall.ballMove();
  };
  render();
};



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
