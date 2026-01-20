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
const sessionScoreE1 = document.getElementById("sessionScore");
const roundsPlayedE1 = document.getElementById("roundsPlayed");
const winsE1 = document.getElementById("wins");
const lossesE1 = document.getElementById("losses");
const endSessionBtn = document.getElementById("endSessionBtn");
const sessionModal = document.getElementById("sessionModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const confirmEndSessionBtn = document.getElementById("confirmEndSessionBtn");
const modalScore = document.getElementById("modalScore");
const modalRounds = document.getElementById("modalRounds");
const modalWins = document.getElementById("modalWins");
const modalLosses = document.getElementById("modalLosses");
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

let sessionScore = Number(sessionStorage.getItem("sessionScore")) || 0;
let roundsPlayed = Number(sessionStorage.getItem("roundsPlayed")) || 0;
let wins = Number(sessionStorage.getItem("wins")) || 0;
let losses = Number(sessionStorage.getItem("losses")) || 0;
let bestScore = localStorage.getItem("bestScore") || 0;
bestScoreE1.textContent = bestScore;
let currentScore = Number(sessionStorage.getItem("currentScore")) || 0;
currentScoreE1.textContent = currentScore;
message.textContent = `Best Score: ${bestScore}`;
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

        guessInput.classList.add("shake");

        setTimeout(function () {
            guessInput.classList.remove("shake");
        }, 400);
        return;
    }

    if (userGuess === secretNumber) {
        const difficultyScore = difficultyPoints[difficultyLevel.value];
        const attemptScore = attemptPoints[attemptLevel.value];

        const totalScore = difficultyScore + attemptScore;
        currentScore = Number(currentScore) + Number(totalScore);
        sessionStorage.setItem("currentScore", currentScore);


        animateScore(currentScoreE1, 0, currentScore);

        bestScore = Number(bestScore) + Number(totalScore);
        localStorage.setItem("bestScore", bestScore);
        animateScore(bestScoreE1, bestScore - totalScore, bestScore);

        roundsPlayed++;
        wins++
        sessionScore = currentScore;

        sessionStorage.setItem("roundsPlayed", roundsPlayed);
        sessionStorage.setItem("wins", wins);
        sessionStorage.setItem("sessionScore", sessionScore);

        updateSessionSummaryUI();

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

        roundsPlayed++;
        losses++;

        sessionStorage.setItem("roundsPlayed", roundsPlayed);
        sessionStorage.setItem("losses", losses);

        updateSessionSummaryUI();

        guessBtn.disabled = true;
        guessInput.disabled = true;
    }
});

function resetGame() {
    selectedAttempt = attemptLevel.value;
    const attemptSettings = attemptLevelSettings[selectedAttempt];
    currentAttempts = attemptSettings.attempts;
    attempts.textContent = `Attempt left: ${currentAttempts}`;
    secretNumber = Math.floor(Math.random() * currentMax) + 1;
    message.textContent = `Score: ${currentScore} & Best Score: ${bestScore}`;
    currentScoreE1.textContent = currentScore;
    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    guessInput.focus();
}

function animateScore(element, start, end, duration = 1000) {
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

function updateSessionSummaryUI() {
    sessionScoreE1.textContent = sessionScore;
    roundsPlayedE1.textContent = roundsPlayed;
    winsE1.textContent = wins;
    lossesE1.textContent = losses;
}

function openSessionModal() {
    modalScore.textContent = sessionScore;
    modalRounds.textContent = roundsPlayed;
    modalWins.textContent = wins;
    modalLosses.textContent = losses;

    sessionModal.classList.add("active");
}

function closeSessionModal() {
    sessionModal.classList.remove("active");
}

function endSession() {
    sessionStorage.clear();

    sessionScore = 0;
    roundsPlayed = 0;
    wins = 0;
    losses = 0;
    updateSessionSummaryUI();
    closeSessionModal();

    resetGame();
}



restartBtn.addEventListener("click", function () {
    resetGame();
    if (bestScore > 0) {
        animateScore(bestScoreE1, 0, Number(bestScore));
    };
    if (currentScore > 0) {
        animateScore(currentScoreE1, 0, Number(currentScore));
    };
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

window.addEventListener("load", function () {
    if (bestScore > 0) {
        animateScore(bestScoreE1, 0, Number(bestScore));
    }
    difficultyLevel.selectedIndex = 0;
    attemptLevel.selectedIndex = 0;
    currentScore = 0;
    sessionStorage.setItem("currentScore", currentScore);
    currentScoreE1.textContent = currentScore;
});

endSessionBtn.addEventListener("click", openSessionModal);
closeModalBtn.addEventListener("click", closeSessionModal);
confirmEndSessionBtn.addEventListener("click", endSession);
