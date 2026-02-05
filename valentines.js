// (same variables as yours)

const gameScreen = document.getElementById('gameScreen');
const questionScreen = document.getElementById('questionScreen');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const successModal = document.getElementById('successModal');
const gameOverModal = document.getElementById('gameOverModal');
const retryButton = document.getElementById('retryButton');

let score = 0;
let timeLeft = 30;
let heartsInterval;
let timerInterval;
let noButtonMoved = false;

function startGame() {
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    const hint = document.querySelector('.game-hint');
    if (hint) hint.style.display = 'none';

    heartsInterval = setInterval(spawnHeart, 800);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) endGame(false);
    }, 1000);
}

function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.innerHTML = '<i class="ri-heart-3-fill heart-icon"></i>';
    heart.style.left = Math.random() * (gameArea.offsetWidth - 40) + 'px';

    const fallDuration = Math.random() * 2 + 3;
    heart.style.animationDuration = fallDuration + 's';

    gameArea.appendChild(heart);

    heart.addEventListener('click', function() {
        score++;
        scoreDisplay.textContent = score;
        heart.remove();
        if (score >= 10) endGame(true);
    });

    setTimeout(() => heart.remove(), fallDuration * 1000);
}

function endGame(won) {
    clearInterval(heartsInterval);
    clearInterval(timerInterval);
    document.querySelectorAll('.falling-heart').forEach(h => h.remove());

    if (won) {
        gameScreen.style.display = 'none';
        questionScreen.style.display = 'block';
    } else {
        gameOverModal.style.display = 'flex';
    }
}

retryButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    startGame();
});

let gameStarted = false;

gameArea.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        startGame();
    }
});


function getRandomPosition() {
    const padding = 20;
    const rect = noButton.getBoundingClientRect();

    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;

    return {
        x: Math.random() * maxX + padding,
        y: Math.random() * maxY + padding
    };
}

function moveNoButton() {
    const pos = getRandomPosition();
    noButton.style.position = 'fixed';
    noButton.style.left = pos.x + 'px';
    noButton.style.top = pos.y + 'px';
    noButtonMoved = true;
}

noButton.addEventListener('mouseenter', moveNoButton);
noButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});


function createFloatingHearts() {
    const bg = document.querySelector('.hearts-background');
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.innerHTML = '<i class="ri-heart-3-line"></i>';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        bg.appendChild(heart);
    }
}

window.addEventListener('load', createFloatingHearts);

yesButton.addEventListener('click', function() {
    successModal.style.display = 'flex';
    successModal.style.justifyContent = 'center';
    successModal.style.alignItems = 'center';

    createSparkles();
});

function createSparkles() {
    const modalContent = document.querySelector('.modal-content');

    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '<i class="ri-sparkling-2-fill sparkle-icon"></i>';
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animation = 'explode 2s forwards';
            sparkle.style.pointerEvents = 'none';
            modalContent.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 2000);
        }, i * 80);
    }
}
