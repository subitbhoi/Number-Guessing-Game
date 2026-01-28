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
const profileModal = document.getElementById("profileModal");
const profileNameInput = document.getElementById("profileNameInput");
const profileStartBtn = document.getElementById("profileStartBtn");
const guestBtn = document.getElementById("guestBtn");
const switchProfileBtn = document.getElementById("switchProfileBtn");
const activeProfileNameE1 = document.getElementById("activeProfileName");
const profileListE1 = document.getElementById("profileList");
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

let currentProfile = "guest";
let isGuest = true;
let sessionScore = Number(sessionStorage.getItem("sessionScore")) || 0;
let roundsPlayed = Number(sessionStorage.getItem("roundsPlayed")) || 0;
let wins = Number(sessionStorage.getItem("wins")) || 0;
let losses = Number(sessionStorage.getItem("losses")) || 0;
let bestScore = 0
bestScoreE1.textContent = bestScore;
let currentScore = Number(sessionStorage.getItem("currentScore")) || 0;
currentScoreE1.textContent = currentScore;
let currentMax = "";
let currentAttempts = "";
let secretNumber = "";
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

        if (currentProfile === "guest") {
            bestScore = currentScore;
        } else {
            bestScore = Number(bestScore) + Number(totalScore);
            localStorage.setItem(`bestScore_${currentProfile}`, bestScore);
        };

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
    if (start === end) {
        element.textContent = end;
        return;
    }
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

    modalScore.textContent = 0;
    modalRounds.textContent = 0;
    modalWins.textContent = 0;
    modalLosses.textContent = 0;


    animateScore(modalScore, 0, sessionScore, 600);
    setTimeout(() => {
        animateScore(modalRounds, 0, roundsPlayed, 600);
    }, 150);
    setTimeout(() => {
        animateScore(modalWins, 0, wins, 600);
    }, 300);
    setTimeout(() => {
        animateScore(modalLosses, 0, losses, 600);
    }, 450);

    sessionModal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeSessionModal() {
    sessionModal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

function endSession() {
    sessionScore = 0;
    roundsPlayed = 0;
    wins = 0;
    losses = 0;

    updateSessionSummaryUI();
    closeSessionModal();
    resetGame();

    sessionStorage.clear();

    currentScore = 0;
    sessionStorage.setItem("currentScore", currentScore);
    currentScoreE1.textContent = currentScore;
    
    location.reload();
}

function setProfile(profileName) {
    if (profileName === currentProfile) {
        closeProfileModal();
        return;
    }

    const profiles = getSavedProfiles();
    const isNewProfile = !profiles.includes(profileName);

    if (profileName !== "guest") {
        if (isNewProfile) {
            message.textContent = `Welcome ${profileName}`;
        } else {
            message.textContent = `Welcome back ${profileName}`;
        }
    } else {
        message.textContent = "Welcome Guest";
    }

    sessionStorage.clear();
    currentProfile = profileName;
    isGuest = profileName === "guest";

    currentScore = 0;
    roundsPlayed = 0;
    wins = 0;
    losses = 0;
    sessionScore = 0;

    currentScoreE1.textContent = currentScore;

    difficultyLevel.selectedIndex = 0;
    attemptLevel.selectedIndex = 0;

    instructions.textContent = "Select Difficulty Level and Attempts to continue";
    attempts.textContent = "Attempts left: Select Attempts";

    guessInput.value = "";

    guessInput.placeholder = "Enter your guess";
    guessInput.disabled = true;
    guessBtn.disabled = true;
    difficultyLevel.disabled = false;
    attemptLevel.disabled = true;
    difficultyLevel.focus();

    updateSessionSummaryUI();

   

    if (isGuest) {
        bestScore = 0;
        bestScoreE1.textContent = 0;
        currentScore = 0;
        currentScoreE1.textContent = 0;
    } else {
        bestScore = getBestScoreForProfile(profileName);
        bestScoreE1.textContent = bestScore;
    }

    activeProfileNameE1.textContent = isGuest ? "Guest" : profileName;
    
     if (!isGuest && isNewProfile) {
        saveProfileName(profileName);
    }

    renderProfileList();
    closeProfileModal();
}


function openProfileModal() {
    profileModal.classList.add("active");
    document.body.classList.add("modal-open");

    profileNameInput.value = "";
    profileNameInput.focus();

    renderProfileList();   
}

function closeProfileModal() {
    profileModal.classList.remove("active");
    document.body.classList.remove("modal-open");
     if (bestScore > 0) {
        animateScore(bestScoreE1, 0, Number(bestScore));
    }

    if (currentScore > 0) {
        animateScore(currentScoreE1, 0, Number(currentScore));
    }
}

function loadBestScoreForProfile(profileName) {
    const key = `bestScore_${profileName}`;
    const best = Number(localStorage.getItem(key)) || 0;

    bestScore = best;
    bestScoreE1.textContent = best;
}

function getSavedProfiles() {
    return JSON.parse(localStorage.getItem("profileList")) || [];
}

function saveProfileName(profileName) {
    const profiles = getSavedProfiles();

    if (!profiles.includes(profileName)) {
        profiles.push(profileName);
        localStorage.setItem("profileList", JSON.stringify(profiles));
    }
}

function getBestScoreForProfile(profileName) {
    return Number(localStorage.getItem(`bestScore_${profileName}`)) || 0;
}

function renderProfileList() {
    let profiles = getSavedProfiles();

    profiles = profiles.filter(p => p !== "guest");

    profiles.sort((a, b) => {
        return getBestScoreForProfile(b) - getBestScoreForProfile(a);
    });

    profileListE1.innerHTML = "";

    profiles.forEach(function (profileName) {
        const li = document.createElement("li");
        li.classList.add("profile-item");

        const avatar = createAvatar(profileName);


        if (profileName === profiles[0]) {
            avatar.classList.add("top-profile");
        }

        const nameSpan = document.createElement("span");
        nameSpan.textContent = profileName;
        nameSpan.classList.add("profile-name");

        nameSpan.addEventListener("click", function () {
            setProfile(profileName);
        });

        const scoreSpan = document.createElement("span");
        scoreSpan.classList.add("profile-score");
        scoreSpan.textContent = getBestScoreForProfile(profileName);

        const deleteSpan = document.createElement("span");
        deleteSpan.textContent = "🗑️";
        deleteSpan.classList.add("delete-profile");

        if (profileName === currentProfile) {
            deleteSpan.classList.add("disabled");
        } else {
            deleteSpan.addEventListener("click", function (event) {
                event.stopPropagation();
                if (confirm(`Delete profile "${profileName}"?`)) {
                    deleteProfile(profileName);
                    renderProfileList();
                }
            });
        }

        li.appendChild(avatar);
        li.appendChild(nameSpan);
        li.appendChild(scoreSpan);
        li.appendChild(deleteSpan);
        profileListE1.appendChild(li);
    });
}

function deleteProfile(profileName) {
    const profiles = getSavedProfiles().filter(p => p !== profileName);
    localStorage.setItem("profileList", JSON.stringify(profiles));

    localStorage.removeItem(`bestScore_${profileName}`);
}

function getAvatarColor(profileName) {
    let hash = 0;

    for (let i = 0; i < profileName.length; i++) {
        hash = profileName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

function getAvatarGradient(profileName) {
    let hash = 0;

    for (let i = 0; i < profileName.length; i++) {
        hash = profileName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 40) % 360;

    return `linear-gradient(135deg,
        hsl(${hue1}, 70%, 55%),
        hsl(${hue2}, 70%, 45%)
    )`;
}

function createAvatar(profileName) {
    const avatar = document.createElement("div");
    avatar.classList.add("avatar");

    avatar.innerHTML = `
        <svg class="avatar-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
        </svg>
    `;

    if (profileName === "guest") {
        avatar.style.background =
            "linear-gradient(135deg, #9e9e9e, #616161)";
    } else {
        avatar.style.background = getAvatarGradient(profileName);
    }

    return avatar;
}

function updateActiveProfileUI(profileName) {
    activeProfileNameE1.textContent = profileName;

    activeAvatar.innerHTML = `
        <svg class="avatar-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
        </svg>
    `;

    activeAvatar.style.background =
        profileName === "guest"
            ? "linear-gradient(135deg, #9e9e9e, #616161)"
            : getAvatarGradient(profileName);
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

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && sessionModal.classList.contains("active")) {
        closeSessionModal();
    }
});

sessionModal.addEventListener("click", function (event) {
    if (event.target === sessionModal) {
        closeSessionModal();
    }
});


window.addEventListener("load", function () {
    bestScoreE1.textContent = 0;
    difficultyLevel.selectedIndex = 0;
    attemptLevel.selectedIndex = 0;
    currentScore = 0;
    sessionStorage.setItem("currentScore", currentScore);
    currentScoreE1.textContent = currentScore;
    profileNameInput.focus();
    renderProfileList();
    endSession();
    resetGame();
});

guestBtn.addEventListener("click", function () {

    currentProfile = "guest";
    isGuest = true;

    bestScore = 0;
    bestScoreE1.textContent = 0;
    currentScore = 0;
    currentScoreE1.textContent = 0;

    activeProfileNameE1.textContent = "Guest";

    difficultyLevel.selectedIndex = 0;
    attemptLevel.selectedIndex = 0;

    instructions.textContent = "Select Difficulty Level and Attempts to continue";
    attempts.textContent = "Attempts left: Select Attempts";
    message.textContent = `Welcome`;

    guessInput.value = "";

    guessInput.placeholder = "Enter your guess";
    guessInput.disabled = true;
    guessBtn.disabled = true;
    difficultyLevel.disabled = false;
    attemptLevel.disabled = true;
    difficultyLevel.focus();

    closeProfileModal();
    setProfile("guest");
});

profileStartBtn.addEventListener("click", function () {
    const profileName = profileNameInput.value.trim();

    if (!profileName) {
        profileNameInput.placeholder = "Enter Your Name";
        profileNameInput.classList.add("shake");

        setTimeout(function () {
            profileNameInput.classList.remove("shake");
        }, 400);
        return;
    }
    setProfile(profileName);  
});

document.addEventListener("keydown", function (event) {
    if (!profileModal.classList.contains("active")) return;
    if (event.key === "Enter") {
        event.preventDefault();
        profileStartBtn.click();
    }
    if (event.key === "Escape") {
        event.preventDefault();
        closeProfileModal();
    }
});

switchProfileBtn.addEventListener("click", function () {
    openProfileModal();
});

endSessionBtn.addEventListener("click", openSessionModal);
closeModalBtn.addEventListener("click", closeSessionModal);
confirmEndSessionBtn.addEventListener("click", endSession);
