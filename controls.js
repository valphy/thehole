document.addEventListener('keydown', handleKeydown);

function handleKeydown(e) {
  const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (!allowedKeys.includes(e.code)) {
    if (gameOver && e.code === 'Enter') {
      resetGame();
    }
    return;
  }

  switch (e.code) {
    case 'ArrowUp':
      if (direction.y !== 1) {
        direction.x = 0;
        direction.y = -1;
      }
      break;
    case 'ArrowDown':
      if (direction.y !== -1) {
        direction.x = 0;
        direction.y = 1;
      }
      break;
    case 'ArrowLeft':
      if (direction.x !== 1) {
        direction.x = -1;
        direction.y = 0;
      }
      break;
    case 'ArrowRight':
      if (direction.x !== -1) {
        direction.x = 1;
        direction.y = 0;
      }
      break;
  }
}
