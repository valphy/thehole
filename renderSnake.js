function drawGame() {
    // Очищаем канвас
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);

    // Рисуем фоновое изображение
    const backgroundWidth = gameBoard.width;
    const backgroundHeight = gameBoard.height;
    ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height, 0, 0, backgroundWidth, backgroundHeight);

    // Вызываем функции отрисовки элементов игры
    drawSnake();
    drawFood();
    drawEnemies();
    drawScore();
    drawGameOver();
}