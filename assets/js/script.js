const gameContainer = document.querySelector(".gameContainer");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const message = document.querySelector(".message");
const restartBtn = document.getElementById("restartBtn");
const difficultyLevel = document.getElementById("difficultyLevel");
const attemptLevel = document.getElementById("attemptLevel");
const instructions = document.querySelector(".instructions");
const attempts = document.querySelector(".attempts");
const currentScoreE1 = document.getElementById("currentScore");
const bestScoreE1 = document.getElementById("bestScore");
const difficultyLevelSettings = {
    easy: { max: 10 },
    medium: { max: 50 },
    hard: { max: 100 }
}
const attemptLevelSettings = {
    easy: { attempts: 5 },
    medium: { attempts: 3 },
    hard: { attempts: 1 }
}

const difficultyPoints = {
    easy: 1,
    medium: 2,
    hard: 3
}

const attemptPoints = {
    easy: 1,
    medium: 2,
    hard: 3
}

let bestScore = localStorage.getItem("bestScore") || 0;
bestScoreE1.textContent = bestScore;
let currentMax = "";
let currentAttempts = "";
let secretNumber = Math.floor(Math.random() * currentMax) + 1;
attemptLevel.disabled = true;
guessInput.disabled = true;
guessBtn.disabled = true;

difficultyLevel.addEventListener("change", function () {
    const selectedDifficulty = difficultyLevel.value;
    const difficultySettings = difficultyLevelSettings[selectedDifficulty];
    currentMax = difficultySettings.max;
    secretNumber = Math.floor(Math.random() * currentMax) + 1;
    message.textContent = `Guess the number between 1 & ${currentMax}`;
    instructions.textContent = `Guess the number between 1 & ${currentMax}`;
    guessInput.placeholder = `1 - ${currentMax}`;
    guessInput.value = "";
    guessInput.disabled = true;
    guessBtn.disabled = true;
    attemptLevel.disabled = false;
    attemptLevel.focus();
    resetGame();
});

attemptLevel.addEventListener("change", function () {
    const selectedAttempt = attemptLevel.value;
    const attemptSettings = attemptLevelSettings[selectedAttempt];
    currentAttempts = attemptSettings.attempts;
    attempts.textContent = `Attempt left: ${currentAttempts}`;
    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    guessInput.focus();
    resetGame();
});

guessBtn.addEventListener("click", function () {
    const userGuess = Number(guessInput.value);

    if (!userGuess || userGuess < 1 || userGuess > currentMax) {
        message.textContent = `❌ Please enter a number between 1 & ${currentMax}`;
        return;
    }

    if (userGuess === secretNumber) {
        const difficultyScore = difficultyPoints[difficultyLevel.value];
        const attemptScore = attemptPoints[attemptLevel.value];

        const totalScore = difficultyScore + attemptScore;

        animateScore(currentScoreE1, 0, totalScore);

        bestScore = Number(bestScore) + Number(totalScore);
        localStorage.setItem("bestScore", bestScore);
        animateScore(bestScoreE1, bestScore - totalScore, bestScore);

        message.textContent = "🎉 Correct! You guessed the number";
        guessBtn.disabled = true;
        guessInput.disabled = true;

        gameContainer.classList.add("success");

        setTimeout(function () {
            gameContainer.classList.remove("success");
        }, 500);
        return;
    }

    currentAttempts--;
    attempts.textContent = `Attempt left: ${currentAttempts}`;

    if (userGuess > secretNumber) {
        message.textContent = "👆 Too High! Guess again";
    } else {
        message.textContent = "👇 Too Low! Guess again";
    }

    gameContainer.classList.add("shake");

    setTimeout(function () {
        gameContainer.classList.remove("shake");
    }, 400);


    if (currentAttempts === 0) {
        message.textContent = `🚫 Game Over! The number was ${secretNumber}`;
        guessBtn.disabled = true;
        guessInput.disabled = true;
    }
});

function resetGame() {
    selectedAttempt = attemptLevel.value;
    attemptSettings = attemptLevelSettings[selectedAttempt];
    currentAttempts = attemptSettings.attempts;
    attempts.textContent = `Attempt left: ${currentAttempts}`;
    secretNumber = Math.floor(Math.random() * currentMax) + 1;
    guessInput.value = "";
    currentScoreE1.textContent = 0;
    guessInput.disabled = false;
    guessBtn.disabled = false;
    guessInput.focus();
}

function animateScore(element, start, end, duration = 600) {
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / (end - start)));

    const timer = setInterval(function () {
        current += increment;
        element.textContent = current;

        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

restartBtn.addEventListener("click", function () {
    resetGame();
});

guessInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        guessBtn.click();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        resetGame();
    }
});