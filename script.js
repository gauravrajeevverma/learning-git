const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const startButton = document.getElementById('startButton');
const countdownDisplay = document.getElementById('countdown');

let bird = {
    x: 50,
    y: 0,
    radius: 20,
    velocity: 0,
    gravity: 0.36,
    jump: -7.7
};

let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 1.5;

let score = 0;
let gameOver = false;
let gameStarted = false;

function setCanvasSize() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
    bird.y = canvas.height / 2;
    pipeGap = canvas.height * 0.25;
    pipeWidth = canvas.width * 0.1;
    bird.radius = canvas.width * 0.05;
}

setCanvasSize();

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);
    });
}

function generatePipes() {
    let topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        scored: false
    });
}

function movePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });
    if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
        pipes.shift();
    }
}

function checkCollision() {
    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        gameOver = true;
        return;
    }

    pipes.forEach(pipe => {
        if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth) {
            if (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > pipe.topHeight + pipeGap) {
                gameOver = true;
            }
        }
        if (bird.x > pipe.x + pipeWidth && bird.x < pipe.x + pipeWidth + pipeSpeed && !pipe.scored) {
            score++;
            pipe.scored = true;
        }
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + score, 10, 50);
}

function update() {
    if (!gameStarted) return;

    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        resetButton.style.display = 'block';
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        generatePipes();
    }

    movePipes();
    checkCollision();

    drawPipes();
    drawBird();
    drawScore();

    requestAnimationFrame(update);
}

canvas.addEventListener('touchstart', () => {
    if (gameStarted && !gameOver) {
        bird.velocity = bird.jump;
    }
});

function resetGame() {
    bird = {x: 50, y: canvas.height / 2, radius: bird.radius, velocity: 0, gravity: 0.36, jump: -7.7};
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
    resetButton.style.display = 'none';
    startCountdown();
}

resetButton.addEventListener('click', resetGame);

function startCountdown() {
    let countdown = 3;
    countdownDisplay.style.display = 'block';

    const countdownInterval = setInterval(() => {
        countdownDisplay.textContent = countdown;
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            gameStarted = true;
            update();
        }
    }, 1000);
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    resetGame();
});