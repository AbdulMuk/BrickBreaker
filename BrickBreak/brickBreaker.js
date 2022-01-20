const grid = document.querySelector('.grid');
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 16;
const boardWidth = 810;
const boardHeight = 460;
const userWidth = 100;
let userCurrentWidth = userWidth;
const user = document.createElement('div');
const userStart = [350, 16];
let currentPosition = userStart;
const ball = document.createElement('div');
const ballStart = [394, 40];
let ballCurrentPosition = ballStart;
let timerId;
let xDirection = 2;
let yDirection = 2;
let outcome = document.getElementById("outcome");
let scoreDisplay = document.getElementById("score");
let score = 0;
var mySound1, mySound2, winSnd, loseSnd, music;

// create block
class Block {
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
}

// all my blocks
const blocks = [
    new Block(80, 400),
    new Block(630,400),
    new Block(80, 370),
    new Block(190, 370),
    new Block(300, 370),
    new Block(410, 370),
    new Block(520, 370),
    new Block(630, 370),
    new Block(80, 340),
    new Block(190, 340),
    new Block(300, 340),
    new Block(410, 340),
    new Block(520, 340),
    new Block(630, 340),
    new Block(80, 310),
    new Block(190, 310),
    new Block(300, 310),
    new Block(410, 310),
    new Block(520, 310),
    new Block(630, 310),
    new Block(80, 280),
    new Block(190, 280),
    new Block(300, 280),
    new Block(410, 280),
    new Block(520, 280),
    new Block(630, 280)
]

// draw all my blocks
function addBlocks(){
    for (let i = 0; i < blocks.length; i++){
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block);
    }  
}
addBlocks();

// draw user
function drawUser(){
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

// add user
user.classList.add('user');
drawUser();
grid.appendChild(user);

// move user
function moveUser(e){
    switch(e.key){
        case 'ArrowLeft':
            if (currentPosition[0] > 0){
                currentPosition[0] -= 10;
                drawUser();
            }
            break;
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - userCurrentWidth){
                currentPosition[0] += 10;
                drawUser();
            }
            break;
    }
}

document.addEventListener('keydown', moveUser);

// draw ball
function drawBall(){
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// add ball
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

// move ball
function moveBall(){
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    cheackForCollisions();
}

// sound
function sound(src, loop, vol) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = vol;
    if (loop == "y"){
        this.sound.setAttribute("loop", "loop");
    }
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
mySound1 = new sound("hit.mp3", "n", 0.7);
mySound2 = new sound("fire.mp3", "n", 0.7);
music = new sound("music.mp3", "y", 0.1);
winSnd = new sound("win.mp3", "n", 0.2);
loseSnd = new sound("lose.mp3", "n", 0.2);

// start game
function start(){
    timerId = setInterval(moveBall, 20);
    music.play();
}

// stop game
function stop(result){
    music.stop();
    outcome.innerHTML = result;
    clearInterval(timerId);
    document.removeEventListener('keydown', moveUser);
}

// reset
function reset(){
    location.reload();
}

// block collision
function blockCollision(i){
    blocks.splice(i, 1);
    const allBlocks = Array.from(document.querySelectorAll('.block'));
    allBlocks[i].classList.remove('block');
    mySound2.play();
    score++;
    scoreDisplay.innerHTML = score;
    // win
    if (blocks.length == 0){
        stop("You Win!");
        winSnd.play();
    }
}

// check for collisions

function cheackForCollisions(){
    // check for wall collisions
    if ((ballCurrentPosition[0] + ballDiameter) >= boardWidth || 
        ballCurrentPosition[0] <= 0){
        xDirection *= -1;
    }
    else if ((ballCurrentPosition[1] + ballDiameter)>= boardHeight){
        yDirection *= -1;
    }

    // // check for block collision
    for (let i = 0; i < blocks.length; i++){
        if ((ballCurrentPosition[0] + ballDiameter) >= (blocks[i].bottomLeft[0]) &&
            ballCurrentPosition[0] <= (blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) == (blocks[i].bottomLeft[1]) ||
            ballCurrentPosition[1] == (blocks[i].topLeft[1]))){
            yDirection *= -1;
            blockCollision(i);
        }
        else if ((ballCurrentPosition[1] + ballDiameter) >= (blocks[i].bottomLeft[1]) &&
            ballCurrentPosition[1] <= (blocks[i].topLeft[1]) &&
            ((ballCurrentPosition[0] + ballDiameter) == (blocks[i].bottomLeft[0]) ||
            ballCurrentPosition[0] == (blocks[i].bottomRight[0]))){
            xDirection *= -1;
            blockCollision(i);
        }
    }

    // check for user collison
    if ((ballCurrentPosition[0] + ballDiameter) >= (currentPosition[0]) &&
        ballCurrentPosition[0] <= (currentPosition[0] + 100) &&
        ballCurrentPosition[1] == (currentPosition[1] + 14)){
        mySound1.play();
        yDirection *= -1;
    }

    // lose
    if (ballCurrentPosition[1] < 0){
        stop("You Lose!");
        loseSnd.play();
    }
}
