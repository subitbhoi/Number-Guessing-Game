const gameContainer = document.querySelector(".gameContainer");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const message = document.querySelector(".message");
const restartBtn = document.getElementById("restartBtn");

let secretNumber = Math.floor(Math.random() * 10) + 1;
let attemptsLeft = 3;

let attempt = document.querySelector(".attempt");

guessBtn.addEventListener("click", function () {
    const userGuess = Number(guessInput.value);

    if (!userGuess || userGuess < 1 || userGuess > 10) {
        message.textContent = "❌ Please enter a number between 1 & 10";
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

    attemptsLeft--;
    attempt.textContent = attemptsLeft;

    if (userGuess > secretNumber) {
        message.textContent = "👆 Too High! Guess again";
    } else {
        message.textContent = "👇 Too Low! Guess again";
    }

    gameContainer.classList.add("shake");

    setTimeout(function () {
        gameContainer.classList.remove("shake");
    }, 400);


    if (attemptsLeft === 0) {
        message.textContent = `🚫 Game Over! The number was ${secretNumber}`;
        guessBtn.disabled = true;
        guessInput.disabled = true;
    }
});

restartBtn.addEventListener("click", function () {
    secretNumber = Math.floor(Math.random() * 10) + 1;
    attemptsLeft = 3;

    attempt.textContent = attemptsLeft;
    message.textContent = "Guess a number between 1 & 10";
    guessInput.value = "";
    guessBtn.disabled = false;
    guessInput.disabled = false;
    guessInput.focus();
});

guessInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        guessBtn.click();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        restartBtn.click();
    }
});