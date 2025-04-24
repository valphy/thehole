// Get the game board canvas element and its context
const gameBoard = document.getElementById('game-board');
const ctx = gameBoard.getContext('2d');

// Set the number of tiles on the game board
const tileCount = 20;

// Initialize variables
let tileSize;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let gameOver = false;
let enemies = [];
let lastRenderTime = 0;
const gameSpeed = 100;
let bgCache;

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = 'bg_game.jpg';
backgroundImage.onload = startGame;

// Start the game when the background image is loaded
function startGame() {
  createBgCache();
  resizeCanvas();
  requestAnimationFrame(gameLoop);
}

function createBgCache() {
  bgCache = document.createElement('canvas');
  bgCache.width = backgroundImage.width;
  bgCache.height = backgroundImage.height;
  const bctx = bgCache.getContext('2d');
  bctx.drawImage(backgroundImage, 0, 0);
}

// Resize the game board canvas based on the window size
function resizeCanvas() {
  const max = 600;
  const size = Math.min(window.innerWidth, window.innerHeight, max);
  const dpr = window.devicePixelRatio || 1;
  gameBoard.width = size * dpr;
  gameBoard.height = size * dpr;
  gameBoard.style.width = `${size}px`;
  gameBoard.style.height = `${size}px`;
  ctx.scale(dpr, dpr);
  tileSize = size / tileCount;
  drawGame();
}

window.addEventListener('resize', resizeCanvas);

// Main game loop
function gameLoop(currentTime) {
  if (!gameOver) {
    const deltaTime = currentTime - lastRenderTime;
    if (deltaTime >= gameSpeed) {
      updateSnake();
      updateEnemies();
      checkCollision();
      drawGame();
      lastRenderTime = currentTime;
    }
    requestAnimationFrame(gameLoop);
  }
}

// Update the snake's position and check for collisions
function updateSnake() {
  const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check if the snake goes off the screen
  if (
    newHead.x < 0 ||
    newHead.x >= tileCount ||
    newHead.y < 0 ||
    newHead.y >= tileCount
  ) {
    const randomSide = Math.floor(Math.random() * 3);

    if (randomSide === 0) {
      // Snake appears on the opposite side
      if (newHead.x < 0) {
        newHead.x = tileCount - 1;
      } else if (newHead.x >= tileCount) {
        newHead.x = 0;
      } else if (newHead.y < 0) {
        newHead.y = tileCount - 1;
      } else if (newHead.y >= tileCount) {
        newHead.y = 0;
      }
    } else {
      // Snake appears on one of the two parallel sides
      const validPosition = getValidPosition(newHead);
      newHead.x = validPosition.x;
      newHead.y = validPosition.y;
      direction = validPosition.direction;
    }
  }

  snake.unshift(newHead);

  // Check if the snake eats the food
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } else {
    snake.pop();
  }
}

// Update the enemies' positions and create new enemies
function updateEnemies() {
  // Remove disappeared enemies
  enemies = enemies.filter((enemy) => enemy.duration > 0);

  // Decrease the duration of enemies
  enemies.forEach((enemy) => enemy.duration--);

  // Move the enemies
  enemies.forEach((enemy) => {
    enemy.x += enemy.direction.x;
    enemy.y += enemy.direction.y;

    // Change the direction of enemies when they collide with walls
    if (enemy.x < 0 || enemy.x >= tileCount) {
      enemy.direction.x *= -1;
    }
    if (enemy.y < 0 || enemy.y >= tileCount) {
      enemy.direction.y *= -1;
    }
  });

  // Create new enemies based on the score
  const enemyCount = Math.floor(score / 5);
  while (enemies.length < enemyCount) {
    const enemy = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
      direction: {
        x: Math.random() < 0.5 ? -1 : 1,
        y: Math.random() < 0.5 ? -1 : 1,
      },
      duration: Math.floor(Math.random() * 50) + 50, // Enemy's lifespan (in frames)
    };
    enemies.push(enemy);
  }
}

// Check for collisions between the snake's head and enemies
function checkCollision() {
  const head = snake[0];

  // Check collision with enemies
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (head.x === enemy.x && head.y === enemy.y) {
      gameOver = true;
      break;
    }
  }
}

// Get a valid position for the snake when it goes off the screen
function getValidPosition(head) {
  let validPosition = null;
  let attempts = 0;

  while (!validPosition && attempts < 100) {
    attempts++;
    const newDirection =
      Math.random() < 0.5 ? { x: 0, y: direction.x } : { x: direction.y, y: 0 };
    const newHead = { x: head.x, y: head.y };

    if (newDirection.x === 0) {
      newHead.y = Math.floor(Math.random() * tileCount);
    } else {
      newHead.x = Math.floor(Math.random() * tileCount);
    }

    validPosition = {
      x: newHead.x,
      y: newHead.y,
      direction: newDirection,
    };
  }

  return validPosition || { x: head.x, y: head.y, direction: direction };
}

// Reset the game state
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = { x: 15, y: 15 };
  score = 0;
  gameOver = false;
  enemies = [];
  gameLoop();
}

// Draw the game elements on the canvas
function drawGame() {
  ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
  ctx.drawImage(
    bgCache,
    0,
    0,
    gameBoard.width / (window.devicePixelRatio || 1),
    gameBoard.height / (window.devicePixelRatio || 1)
  );
  drawSnake();
  drawFood();
  drawEnemies();
  drawScore();
  drawGameOver();
}

// Draw the snake on the canvas
function drawSnake() {
  snake.forEach((segment, index) => {
    const overlapCount = snake.filter(
      (s) => s.x === segment.x && s.y === segment.y
    ).length;
    if (overlapCount > 1) {
      ctx.fillStyle = `hsl(0, ${overlapCount * 20}%, 50%)`; // Red tint when overlapping
    } else {
      ctx.fillStyle = '#ffff70'; // Yellow color when not overlapping
    }
    const x = segment.x * tileSize;
    const y = segment.y * tileSize;
    ctx.fillRect(x, y, tileSize, tileSize);
  });
}

// Draw the food on the canvas
function drawFood() {
  ctx.fillStyle = '#ff8c00';
  const foodX = food.x * tileSize;
  const foodY = food.y * tileSize;
  ctx.fillRect(foodX, foodY, tileSize, tileSize);
}

// Draw the enemies on the canvas
function drawEnemies() {
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  enemies.forEach((enemy) => {
    const enemyX = enemy.x * tileSize;
    const enemyY = enemy.y * tileSize;
    ctx.rect(enemyX, enemyY, tileSize, tileSize);
  });
  ctx.fill();
}

// Draw the score on the canvas
function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '16px "Press Start 2P"';
  ctx.fillText(score, 10, 25);
}

// Draw the "Game Over" message on the canvas
function drawGameOver() {
  if (gameOver) {
    ctx.fillStyle = '#fff';
    ctx.font = '24px "Press Start 2P"';
    ctx.fillText(
      'dead',
      gameBoard.clientWidth / 2 - 35,
      gameBoard.clientHeight / 2
    );
  }
}
