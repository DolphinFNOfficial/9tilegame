// Constants and Variables
const gridSize = 3;
const tileCount = gridSize * gridSize;
let tiles = [];
let emptyTileIndex = tileCount - 1;
let moveCounter = 0;
let timeElapsed = 0;
let timerInterval;

const puzzleGrid = document.getElementById('puzzle-grid');
const moveCounterElement = document.getElementById('move-counter');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restart-button');

// Initialize Game on Page Load
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    startTimer();
});

// Restart Game
restartButton.addEventListener('click', () => {
    resetGame();
    initGame();
});

// Initialize Game Function
function initGame() {
    createTiles();
    shuffleTiles();
    renderTiles();
}

// Create Tiles
function createTiles() {
    tiles = [];
    for (let i = 1; i < tileCount; i++) {
        const tile = {
            number: i,
            element: createTileElement(i)
        };
        tiles.push(tile);
    }
    // Add the empty tile
    tiles.push({
        number: 0,
        element: createTileElement(0)
    });
    emptyTileIndex = tiles.length - 1;
}

// Create Tile Element
function createTileElement(number) {
    const tileElement = document.createElement('div');
    tileElement.classList.add('puzzle-tile');
    if (number === 0) {
        tileElement.classList.add('empty');
    } else {
        tileElement.innerText = number;
        tileElement.addEventListener('click', () => {
            moveTile(number);
        });
    }
    return tileElement;
}

// Shuffle Tiles with Solvability Check
function shuffleTiles() {
    do {
        tiles.sort(() => Math.random() - 0.5);
    } while (!isSolvable() || isSolved());
    emptyTileIndex = tiles.findIndex(tile => tile.number === 0);
}

// Check if Puzzle is Solvable
function isSolvable() {
    let inversions = 0;
    const tileNumbers = tiles.map(tile => tile.number).filter(num => num !== 0);
    for (let i = 0; i < tileNumbers.length - 1; i++) {
        for (let j = i + 1; j < tileNumbers.length; j++) {
            if (tileNumbers[i] > tileNumbers[j]) inversions++;
        }
    }
    return inversions % 2 === 0;
}

// Render Tiles on the Grid
function renderTiles() {
    puzzleGrid.innerHTML = '';
    tiles.forEach(tile => {
        puzzleGrid.appendChild(tile.element);
    });
}

// Move Tile if Adjacent to Empty Space
function moveTile(number) {
    const tileIndex = tiles.findIndex(tile => tile.number === number);
    if (isAdjacent(tileIndex, emptyTileIndex)) {
        // Swap tiles
        [tiles[tileIndex], tiles[emptyTileIndex]] = [tiles[emptyTileIndex], tiles[tileIndex]];
        renderTiles();
        emptyTileIndex = tileIndex;
        moveCounter++;
        moveCounterElement.innerText = moveCounter;
        if (isSolved()) {
            clearInterval(timerInterval);
            setTimeout(() => alert(`🎉 You solved the puzzle in ${moveCounter} moves and ${formatTime(timeElapsed)}!`), 300);
        }
    }
}

// Check if Two Tiles are Adjacent
function isAdjacent(index1, index2) {
    const x1 = index1 % gridSize;
    const y1 = Math.floor(index1 / gridSize);
    const x2 = index2 % gridSize;
    const y2 = Math.floor(index2 / gridSize);
    return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

// Check if Puzzle is Solved
function isSolved() {
    for (let i = 0; i < tileCount - 1; i++) {
        if (tiles[i].number !== i + 1) return false;
    }
    return true;
}

// Start Timer
function startTimer() {
    clearInterval(timerInterval);
    timeElapsed = 0;
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerElement.innerText = formatTime(timeElapsed);
    }, 1000);
}

// Reset Game
function resetGame() {
    moveCounter = 0;
    moveCounterElement.innerText = moveCounter;
    timerElement.innerText = '00:00';
    clearInterval(timerInterval);
    startTimer();
}

// Format Time as MM:SS
function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
}
