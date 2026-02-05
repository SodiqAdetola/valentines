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
const buttonsContainer = document.querySelector('.buttons-container');

// Game variables
let score = 0;
let timeLeft = 30;
let gameInterval;
let timerInterval;
let heartsInterval;
let noButtonMoved = false;

// Start the game
function startGame() {
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    
    // Remove hint
    const hint = document.querySelector('.game-hint');
    if (hint) hint.style.display = 'none';
    
    // Start spawning hearts
    heartsInterval = setInterval(spawnHeart, 800);
    
    // Start timer
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// Spawn a falling heart
function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = ['💖', '💕', '💝', '💗'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * (gameArea.offsetWidth - 40) + 'px';
    
    const fallDuration = Math.random() * 2 + 3; // 3-5 seconds
    heart.style.animationDuration = fallDuration + 's';
    
    gameArea.appendChild(heart);
    
    // Click handler
    heart.addEventListener('click', function() {
        if (!this.classList.contains('clicked')) {
            this.classList.add('clicked');
            score++;
            scoreDisplay.textContent = score;
            
            setTimeout(() => this.remove(), 300);
            
            if (score >= 10) {
                endGame(true);
            }
        }
    });
    
    // Remove heart after it falls
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, fallDuration * 1000);
}

// End the game
function endGame(won) {
    clearInterval(heartsInterval);
    clearInterval(timerInterval);
    
    // Remove all hearts
    const hearts = gameArea.querySelectorAll('.falling-heart');
    hearts.forEach(heart => heart.remove());
    
    if (won) {
        // Show question screen
        gameScreen.style.display = 'none';
        questionScreen.style.display = 'block';
    } else {
        // Show game over modal
        gameOverModal.style.display = 'block';
    }
}

// Retry button
retryButton.addEventListener('click', function() {
    gameOverModal.style.display = 'none';
    gameScreen.style.display = 'block';
    const hint = document.querySelector('.game-hint');
    if (hint) hint.style.display = 'block';
    startGame();
});

// Start game on first click in game area
gameArea.addEventListener('click', function() {
    if (score === 0 && timeLeft === 30) {
        startGame();
    }
}, { once: true });

// Function to get random position for the "No" button
function getRandomPosition() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const button = noButton.getBoundingClientRect();
    
    const padding = 20;
    const maxX = viewportWidth - button.width - padding;
    const maxY = viewportHeight - button.height - padding;
    
    const randomX = Math.max(padding, Math.random() * maxX);
    const randomY = Math.max(padding, Math.random() * maxY);
    
    return { x: randomX, y: randomY };
}

// Move "No" button
function moveNoButton() {
    const position = getRandomPosition();
    noButton.style.position = 'fixed';
    noButton.style.left = position.x + 'px';
    noButton.style.top = position.y + 'px';
    noButtonMoved = true;
}

// "No" button hover/touch handlers
noButton.addEventListener('mouseenter', moveNoButton);
noButton.addEventListener('touchstart', function(e) {
    e.preventDefault();
    moveNoButton();
});

// "Yes" button click handler
yesButton.addEventListener('click', function() {
    successModal.style.display = 'block';
    createSparkles();
});

// Create sparkle effects
function createSparkles() {
    const modalContent = document.querySelector('.modal-content');
    const sparkleEmojis = ['✨', '⭐', '🌟', '💫'];
    
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = (Math.random() * 15 + 20) + 'px';
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

// Create floating hearts background
function createFloatingHearts() {
    const heartsBackground = document.querySelector('.hearts-background');
    const hearts = ['💖', '💕', '💝'];
    
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
        heart.style.opacity = '0.3';
        heart.style.animation = `float ${Math.random() * 2 + 5}s infinite ease-in-out`;
        heart.style.animationDelay = Math.random() * 2 + 's';
        heartsBackground.appendChild(heart);
    }
}

// Initialize on page load
window.addEventListener('load', createFloatingHearts);

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