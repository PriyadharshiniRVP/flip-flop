const gameBoard = document.getElementById("gameBoard");
const moveCountDisplay = document.getElementById("moveCount");
const timerDisplay = document.getElementById("timer");
const difficultySelect = document.getElementById("difficulty");
const startButton = document.getElementById("startGame");

let emojis = ["🍎", "🍌", "🍇", "🍉", "🍓", "🥝", "🍒", "🍍"];

let cardsArray = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

startButton.addEventListener("click", startGame);

function startGame() {
    const pairs = parseInt(difficultySelect.value);
    resetGame();

    cardsArray = [...emojis.slice(0, pairs), ...emojis.slice(0, pairs)];
    cardsArray.sort(() => Math.random() - 0.5);

    gameBoard.innerHTML = "";

    // Dynamic grid columns
    gameBoard.style.gridTemplateColumns = `repeat(${Math.sqrt(pairs * 2)}, 100px)`;

    cardsArray.forEach(emoji => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = emoji;
        gameBoard.appendChild(card);
    });
}

gameBoard.addEventListener("click", function(e) {
    const clickedCard = e.target;

    if (!clickedCard.classList.contains("card")) return;
    if (lockBoard) return;
    if (clickedCard === firstCard) return;
    if (clickedCard.classList.contains("matched")) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    clickedCard.classList.add("flipped");
    clickedCard.innerText = clickedCard.dataset.value;

    if (!firstCard) {
        firstCard = clickedCard;
        return;
    }

    secondCard = clickedCard;
    moves++;
    moveCountDisplay.innerText = moves;

    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        resetTurn();
        checkWin();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.innerText = "";
            secondCard.innerText = "";
            resetTurn();
        }, 800);
    }
});

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function resetGame() {
    moves = 0;
    timer = 0;
    gameStarted = false;
    moveCountDisplay.innerText = 0;
    timerDisplay.innerText = 0;
    clearInterval(timerInterval);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.innerText = timer;
    }, 1000);
}

function checkWin() {
    const matchedCards = document.querySelectorAll(".matched");
    if (matchedCards.length === cardsArray.length) {
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`🎉 You won!\nMoves: ${moves}\nTime: ${timer}s`);
        }, 300);
    }
}
