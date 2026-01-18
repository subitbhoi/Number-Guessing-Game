const gameContainer = document.querySelector(".gameContainer");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const message = document.querySelector(".message");
const restartBtn = document.getElementById("restartBtn");
const difficultyLevel = document.getElementById("difficultyLevel");
const attemptLevel = document.getElementById("attemptLevel");
const instructions = document.querySelector(".instructions");
const attempts = document.querySelector(".attempts");
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
    guessInput.disabled = false;
    guessBtn.disabled = false;
    guessInput.focus();
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