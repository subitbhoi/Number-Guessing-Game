/* =====================================================
   DOM ELEMENTS
===================================================== */
const $ = (selector) => document.querySelector(selector);

const gameContainer = $(".gameContainer");
const message = $(".message");
const instructions = $(".instructions");
const attemptsEl = $(".attempts");

const guessInput = $("#guessInput");
const guessBtn = $("#guessBtn");
const restartBtn = $("#restartBtn");

const difficultyLevel = $("#difficultyLevel");
const attemptLevel = $("#attemptLevel");

const currentScoreEl = $("#currentScore");
const bestScoreEl = $("#bestScore");
const sessionScoreEl = $("#sessionScore");
const roundsPlayedEl = $("#roundsPlayed");
const winsEl = $("#wins");
const lossesEl = $("#losses");

const sessionModal = $("#sessionModal");
const closeModalBtn = $("#closeModalBtn");
const confirmEndSessionBtn = $("#confirmEndSessionBtn");
const endSessionBtn = $("#endSessionBtn");

const modalScore = $("#modalScore");
const modalRounds = $("#modalRounds");
const modalWins = $("#modalWins");
const modalLosses = $("#modalLosses");

const profileModal = $("#profileModal");
const profileNameInput = $("#profileNameInput");
const profileStartBtn = $("#profileStartBtn");
const guestBtn = $("#guestBtn");
const switchProfileBtn = $("#switchProfileBtn");
const activeProfileNameEl = $("#activeProfileName");
const profileListEl = $("#profileList");

/* =====================================================
   CONFIG
===================================================== */
const DIFFICULTY = {
  easy: { max: 10, points: 1 },
  medium: { max: 50, points: 2 },
  hard: { max: 100, points: 3 }
};

const ATTEMPTS = {
  easy: { count: 5, points: 1 },
  medium: { count: 3, points: 2 },
  hard: { count: 1, points: 3 }
};

/* =====================================================
   STATE
===================================================== */
let state = {
  profile: "guest",
  isGuest: true,
  maxNumber: 0,
  attemptsLeft: 0,
  secretNumber: 0,
  currentScore: 0,
  bestScore: 0,
  sessionScore: 0,
  rounds: 0,
  wins: 0,
  losses: 0
};

/* =====================================================
   HELPERS
===================================================== */
function generateSecret(max) {
  return Math.floor(Math.random() * max) + 1;
}

function animateScore(el, start, end, duration = 600) {
  if (start === end) {
    el.textContent = end;
    return;
  }

  const step = end > start ? 1 : -1;
  const range = Math.abs(end - start);
  const interval = Math.max(10, duration / range);

  let value = start;
  const timer = setInterval(() => {
    value += step;
    el.textContent = value;
    if (value === end) clearInterval(timer);
  }, interval);
}

function updateStatsUI() {
  sessionScoreEl.textContent = state.sessionScore;
  roundsPlayedEl.textContent = state.rounds;
  winsEl.textContent = state.wins;
  lossesEl.textContent = state.losses;
}

function disableGameInput(disabled) {
  guessInput.disabled = disabled;
  guessBtn.disabled = disabled;
}

/* =====================================================
   GAME RESET
===================================================== */
function resetGame() {
  state.attemptsLeft = ATTEMPTS[attemptLevel.value]?.count || 0;
  state.secretNumber = generateSecret(state.maxNumber);

  attemptsEl.textContent = `Attempts left: ${state.attemptsLeft}`;
  guessInput.value = "";
  disableGameInput(false);
  message.textContent = `Guess between 1 & ${state.maxNumber}`;
}

/* =====================================================
   GAME LOGIC
===================================================== */
function handleGuess() {
  const guess = Number(guessInput.value);

  if (!guess || guess < 1 || guess > state.maxNumber) {
    message.textContent = `❌ Enter number 1 - ${state.maxNumber}`;
    return;
  }

  if (guess === state.secretNumber) {
    const score =
      DIFFICULTY[difficultyLevel.value].points +
      ATTEMPTS[attemptLevel.value].points;

    state.currentScore += score;
    state.sessionScore = state.currentScore;
    state.rounds++;
    state.wins++;

    sessionStorage.setItem("currentScore", state.currentScore);
    animateScore(currentScoreEl, Number(currentScoreEl.textContent), state.currentScore);

    if (!state.isGuest && state.currentScore > state.bestScore) {
      state.bestScore = state.currentScore;
      localStorage.setItem(`bestScore_${state.profile}`, state.bestScore);
      animateScore(bestScoreEl, Number(bestScoreEl.textContent), state.bestScore);
    }

    updateStatsUI();
    message.textContent = "🎉 Correct!";
    disableGameInput(true);
    return;
  }

  state.attemptsLeft--;
  attemptsEl.textContent = `Attempts left: ${state.attemptsLeft}`;
  message.textContent = guess > state.secretNumber ? "⬆ Too High" : "⬇ Too Low";

  if (state.attemptsLeft === 0) {
    state.rounds++;
    state.losses++;
    updateStatsUI();
    message.textContent = `💀 Game Over! Number was ${state.secretNumber}`;
    disableGameInput(true);
  }
}

/* =====================================================
   PROFILE
===================================================== */
function loadBestScore(profile) {
  state.bestScore = Number(localStorage.getItem(`bestScore_${profile}`)) || 0;
  bestScoreEl.textContent = state.bestScore;
}

function setProfile(profile) {
  state.profile = profile;
  state.isGuest = profile === "guest";

  state.currentScore = 0;
  state.sessionScore = 0;
  state.rounds = 0;
  state.wins = 0;
  state.losses = 0;

  sessionStorage.clear();
  updateStatsUI();

  activeProfileNameEl.textContent = profile === "guest" ? "Guest" : profile;
  loadBestScore(profile);
}

/* =====================================================
   SESSION MODAL
===================================================== */
function openSessionModal() {
  modalScore.textContent = 0;
  modalRounds.textContent = 0;
  modalWins.textContent = 0;
  modalLosses.textContent = 0;

  animateScore(modalScore, 0, state.sessionScore);
  animateScore(modalRounds, 0, state.rounds, 700);
  animateScore(modalWins, 0, state.wins, 800);
  animateScore(modalLosses, 0, state.losses, 900);

  sessionModal.classList.add("active");
}

function closeSessionModal() {
  sessionModal.classList.remove("active");
}

function endSession() {
  setProfile(state.profile);
  closeSessionModal();
  resetGame();
}

/* =====================================================
   EVENTS
===================================================== */
difficultyLevel.addEventListener("change", () => {
  state.maxNumber = DIFFICULTY[difficultyLevel.value].max;
  attemptLevel.disabled = false;
  guessInput.placeholder = `1 - ${state.maxNumber}`;
});

attemptLevel.addEventListener("change", resetGame);
guessBtn.addEventListener("click", handleGuess);
guessInput.addEventListener("keydown", e => e.key === "Enter" && handleGuess());

restartBtn.addEventListener("click", resetGame);
endSessionBtn.addEventListener("click", openSessionModal);
closeModalBtn.addEventListener("click", closeSessionModal);
confirmEndSessionBtn.addEventListener("click", endSession);

guestBtn.addEventListener("click", () => {
  setProfile("guest");
  closeSessionModal();
});

profileStartBtn.addEventListener("click", () => {
  const name = profileNameInput.value.trim();
  if (!name) return;
  setProfile(name);
  closeSessionModal();
});

switchProfileBtn.addEventListener("click", () => {
  profileModal.classList.add("active");
});

/* =====================================================
   INIT
===================================================== */
window.addEventListener("load", () => {
  setProfile("guest");
  difficultyLevel.disabled = false;
  attemptLevel.disabled = true;
  disableGameInput(true);
});
