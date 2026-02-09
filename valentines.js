// Get elements
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

    // Random rotation for tilt
    const rotation = Math.random() * 60 - 30; // -30 to 30 degrees
    heart.style.transform = `rotate(${rotation}deg)`;

    // Different shades of pink
    const pinkShades = ['#ff4d6d', '#ff6b9d', '#ff85a1', '#ff1744', '#ff4081', '#ff6f91'];
    const randomPink = pinkShades[Math.floor(Math.random() * pinkShades.length)];
    heart.querySelector('.heart-icon').style.color = randomPink;

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
    gameScreen.style.display = 'block';
    const hint = document.querySelector('.game-hint');
    if (hint) hint.style.display = 'block';
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

function spawnYesButton() {
    const newYesBtn = document.createElement('button');
    newYesBtn.className = 'btn btn-yes spawned-yes';
    newYesBtn.textContent = 'Yes';
    
    // Random position on screen
    const pos = getRandomPosition();
    newYesBtn.style.position = 'fixed';
    newYesBtn.style.left = pos.x + 'px';
    newYesBtn.style.top = pos.y + 'px';
    newYesBtn.style.zIndex = '9998';
    newYesBtn.style.animation = 'popIn 0.3s ease-out';
    
    document.body.appendChild(newYesBtn);
    
    // Same click behavior as original Yes button
    newYesBtn.addEventListener('click', function() {
        successModal.style.display = 'flex';
        successModal.style.justifyContent = 'center';
        successModal.style.alignItems = 'center';
        createSparkles();
    });
}

// Replace hover/touch with click to spawn Yes buttons
noButton.addEventListener('click', function(e) {
    e.preventDefault();
    spawnYesButton();
    spawnYesButton(); // Spawn 2 Yes buttons per tap
});

noButton.addEventListener('touchstart', function(e) {
    e.preventDefault();
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

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
    if (event.target === gameOverModal) {
        gameOverModal.style.display = 'none';
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (noButtonMoved) {
        const button = noButton.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (button.right > viewportWidth || button.bottom > viewportHeight) {
            moveNoButton();
        }
    }
});