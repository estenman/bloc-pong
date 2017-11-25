var canvas = document.getElementById("canvas-content");
var playButton = document.getElementById("play-button");

window.onload = function() {
  playButton.addEventListener('click', function() {
    playButton.innerHTML = "Pause";
  });
}
