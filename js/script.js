/*
Classic Pong - Darren Dunne - 06/14/16
*/

/* jshint -W104 */ // warning about use of "const"

var canvas;
var ctx;
var ballX = 50;
var ballXSpeed = 10;
var ballY = 50;
var ballYSpeed = 10;
var pad1Y = 250;
var pad2Y = 250;

var gameOver = false;

var player1Score = 0;
var player2Score = 0;
const PAD_HEIGHT = 100;
const PAD_WIDTH = 10;
const NUM_BALLS = 3;

// click to restart the game
function handleMouseClick(evt) {
  if (gameOver) {
    player1Score = 0;
    player2Score = 0;
    gameOver = false;
    resetBall();
  }
}

window.onload = function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext('2d');
  ctx.font = "30px Arial";
  var fps = 30;
  setInterval(mainLoop, 1000 / fps);

  // start tracking the mouse movement for player 1
  canvas.addEventListener('mousemove', function (evt) {
    var mousePos = calcMousePos(evt);
    pad1Y = mousePos.y - PAD_HEIGHT / 2;

  });

  // listen for the click at the end of the game
  canvas.addEventListener('click', function (evt) {
    handleMouseClick(evt);
  });

};

function mainLoop() {
  moveAll();
  drawAll();
}

// do lazy tracking (so computer doesn't win all the time)
function moveComputer() {
  var pad2YCenter = pad2Y + (PAD_HEIGHT / 2);
  if (pad2YCenter < ballY - 30) {
    pad2Y += 5;
  } else {
    pad2Y -= 5;
  }
}

function moveAll() {
  if (gameOver) {
    return;
  }
  moveComputer();
  ballX += ballXSpeed;
  ballY += ballYSpeed;

  if (ballX > canvas.width) {
    if (ballY > pad2Y && ballY < pad2Y + PAD_HEIGHT) {
      ballXSpeed = -ballXSpeed;
      var deltaY = ballY - (pad2Y + PAD_HEIGHT / 2);
      ballYSpeed = deltaY * 0.33;

    } else {
      player1Score++;
      resetBall();
    }
  }
  if (ballX < 0) {
    if (ballY > pad1Y && ballY < pad1Y + PAD_HEIGHT) {
      ballXSpeed = -ballXSpeed;
      var deltaY = ballY - (pad1Y + PAD_HEIGHT / 2);
      ballYSpeed = deltaY * 0.33;

    } else {
      player2Score++;
      resetBall();
    }
  }
  if (ballY > canvas.height) {
    ballYSpeed = -ballYSpeed;
  } else if (ballY < 0) {
    ballYSpeed = -ballYSpeed;
  }

}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 20) {
    drawRect(canvas.width / 2 - 1, i, 2, 10, 'white');
  }
}


// main draw routine
function drawAll() {
  drawRect(0, 0, canvas.width, canvas.height, 'black');

  if (gameOver) {
    ctx.fillStyle = 'white';
    if (player1Score >= NUM_BALLS || player2Score >= NUM_BALLS) {
      drawCenteredText("Mouse click to restart", canvas.height - 100, 'blue');
      var winText = "Player " + (player1Score > player2Score ? 1 : 2) + " wins!";
      drawCenteredText(winText, 200, 'yellow');
    }
  } else {
    drawNet();
    drawRect(0, pad1Y, PAD_WIDTH, PAD_HEIGHT, 'white');
    drawRect(canvas.width - PAD_WIDTH, pad2Y, PAD_WIDTH, PAD_HEIGHT, 'white');

    drawCircle(ballX, ballY, 10, 'red');
    ctx.fillText(player1Score, 100, 100);
    ctx.fillText(player2Score, canvas.width - 100, 100);
  }
}

function resetBall() {
  if (player2Score >= NUM_BALLS || player1Score >= NUM_BALLS) {
    gameOver = true;
  } else {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballXSpeed = -ballXSpeed;
  }
}

/* Utility Functions */

function drawRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}

function drawCircle(x, y, radius, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.fill();

}

function drawCenteredText(txt, yloc, color) {
  var textMetrics = ctx.measureText(txt);
  var textWid = textMetrics.width;
  ctx.fillStyle = color;
  ctx.fillText(txt, canvas.width / 2 - (textWid / 2), yloc);
}

// figure out the mouse position in the canvas, acccounting for scrolling window, etc...
function calcMousePos(evt) {
  var mX = evt.clientX - canvas.getBoundingClientRect().left - document.documentElement.scrollLeft;
  var mY = evt.clientY - canvas.getBoundingClientRect().top - document.documentElement.scrollTop;
  return {
    x: mX,
    y: mY
  };
}
