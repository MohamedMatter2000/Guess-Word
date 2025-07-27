const hintEl = document.querySelector(".hint span");
const lettersContainer = document.querySelector(".words");
const typingInput = document.querySelector("input");
const resetButton = document.querySelector("button");
const guessesLeftEl = document.querySelector(".guess-left span");
const wrongLettersEl = document.querySelector(".wrong-letter span");
const popupContainer = document.querySelector(".popup-container");
const popupMessage = document.getElementById("popup-message");
const popupWordInfo = document.getElementById("popup-word-info");

let currentWord;
let correctLetters = [];
let incorrectLetters = [];
let maxGuesses;

function randomWord() {
  const randomItem = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = randomItem.word;
  maxGuesses = currentWord.length >= 5 ? 8 : 6;
  correctLetters = [];
  incorrectLetters = [];
  hintEl.innerText = randomItem.hint;
  guessesLeftEl.innerText = maxGuesses;
  wrongLettersEl.innerText = "";
  lettersContainer.innerHTML = currentWord
    .split("")
    .map(() => `<span></span>`)
    .join("");
}
function handleGameOver(isVictory) {
  setTimeout(() => {
    if (isVictory) {
      popupMessage.innerText = "Congrats! You Won!";
      popupWordInfo.innerHTML = `You found the word: <b>${currentWord}</b>`;
    } else {
      popupMessage.innerText = "Game Over!";
      popupWordInfo.innerHTML = `The correct word was: <b>${currentWord}</b>`;
      for (let i = 0; i < currentWord.length; i++) {
        lettersContainer.querySelectorAll("span")[i].innerText = currentWord[i];
      }
    }
    popupContainer.classList.add("show");
    setTimeout(() => {
      popupContainer.classList.remove("show");
      randomWord();
    }, 3000);
  }, 300);
}

function initGame(e) {
  const key = e.target.value.toLowerCase();
  if (popupContainer.classList.contains("show")) return;
  if (
    key.match(/^[a-z]+$/) &&
    !incorrectLetters.includes(key) &&
    !correctLetters.includes(key)
  ) {
    if (currentWord.includes(key)) {
      correctLetters.push(key);
      for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === key) {
          lettersContainer.querySelectorAll("span")[i].innerText = key;
        }
      }
    } else {
      maxGuesses--;
      incorrectLetters.push(key);
    }
    guessesLeftEl.innerText = maxGuesses;
    wrongLettersEl.innerText = incorrectLetters.join(", ");
  }
  typingInput.value = "";
  const uniqueLettersInWord = [...new Set(currentWord.split(""))];
  if (correctLetters.length === uniqueLettersInWord.length) {
    handleGameOver(true);
  } else if (maxGuesses < 1) {
    handleGameOver(false);
  }
}
randomWord();
typingInput.addEventListener("input", initGame);
resetButton.addEventListener("click", randomWord);
lettersContainer.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => {
  if (!popupContainer.classList.contains("show")) {
    typingInput.focus();
  }
});
