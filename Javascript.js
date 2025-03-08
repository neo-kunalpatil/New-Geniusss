// ---------------- VARIABLES ---------------- //
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timer;
let quizData = [];

// Elements
const quizContainer = document.getElementById("quiz");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-btn");
const timerDisplay = document.getElementById("time-left");
const progressBar = document.getElementById("progress-bar");
const leaderboardBody = document.getElementById("leaderboard-body");
const tabButtons = document.querySelectorAll(".tab-button");

// ---------------- DARK MODE TOGGLE ---------------- //
const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// ---------------- QUIZ QUESTIONS ---------------- //
const questions = {
    physics: [
        { question: "What is the SI unit of force?", options: ["Newton", "Joule", "Watt", "Pascal"], correct: "Newton" },
        { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "1,000 km/s", "3,000 km/s"], correct: "300,000 km/s" }
    ],
    chemistry: [
        { question: "What is the chemical symbol for water?", options: ["O2", "H2O", "CO2", "NaCl"], correct: "H2O" },
        { question: "What is the atomic number of carbon?", options: ["12", "6", "8", "16"], correct: "6" }
    ],
    math: [
        { question: "What is 7 + 8?", options: ["14", "15", "16", "13"], correct: "15" },
        { question: "What is the square root of 81?", options: ["7", "8", "9", "10"], correct: "9" }
    ],
    gk: [
        { question: "Who is the first President of India?", options: ["Dr. Rajendra Prasad", "Nehru", "Gandhi", "Modi"], correct: "Dr. Rajendra Prasad" },
        { question: "Which is the largest ocean?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct: "Pacific" }
    ],
    mixed: []
};

// Combine all questions into the mixed category
questions.mixed = [...questions.physics, ...questions.chemistry, ...questions.math, ...questions.gk];

// ---------------- TAB FUNCTIONALITY ---------------- //
function switchTab(subject) {
    quizData = [...questions[subject]];
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    updateProgressBar();
    startTimer();
    loadQuestion();
}

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        switchTab(button.dataset.subject);
    });
});

// ---------------- START QUIZ ---------------- //
function startQuiz() {
    document.getElementById("home").classList.add("hidden");
    quizContainer.classList.remove("hidden");
    switchTab("mixed");
}

// ---------------- LOAD QUESTION ---------------- //
function loadQuestion() {
    resetOptions();
    if (currentQuestionIndex >= quizData.length) {
        endQuiz();
        return;
    }
    let currentQuestion = quizData[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    currentQuestion.options.forEach(option => {
        let button = document.createElement("button");
        button.classList.add("option");
        button.textContent = option;
        button.addEventListener("click", () => checkAnswer(option, currentQuestion.correct));
        optionsContainer.appendChild(button);
    });
}

// ---------------- CHECK ANSWER ---------------- //
function checkAnswer(selected, correct) {
    let buttons = document.querySelectorAll(".option");
    buttons.forEach(button => {
        if (button.textContent === correct) {
            button.style.background = "green";
        } else if (button.textContent === selected) {
            button.style.background = "red";
        }
        button.disabled = true;
    });

    if (selected === correct) {
        score += 10;
    }

    setTimeout(() => {
        nextQuestion();
    }, 1000);
}

// ---------------- NEXT QUESTION ---------------- //
function nextQuestion() {
    currentQuestionIndex++;
    updateProgressBar();
    loadQuestion();
}

// ---------------- RESET OPTIONS ---------------- //
function resetOptions() {
    optionsContainer.innerHTML = "";
}

// ---------------- START TIMER ---------------- //
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}

// ---------------- UPDATE PROGRESS BAR ---------------- //
function updateProgressBar() {
    let progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressBar.innerHTML = `<div style="width: ${progress}%;"></div>`;
}

// ---------------- END QUIZ ---------------- //
function endQuiz() {
    clearInterval(timer);
    quizContainer.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Score: <strong>${score}</strong></p>
        <button onclick="restartQuiz()">Restart</button>
    `;
    updateLeaderboard();
}

// ---------------- RESTART QUIZ ---------------- //
function restartQuiz() {
    document.location.reload();
}

// ---------------- UPDATE LEADERBOARD ---------------- //
function updateLeaderboard() {
    let playerName = prompt("Enter your name for the leaderboard:") || "Anonymous";
    let playerData = { name: playerName, score: score };

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push(playerData);
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    displayLeaderboard();
}

// ---------------- DISPLAY LEADERBOARD ---------------- //
function displayLeaderboard() {
    leaderboardBody.innerHTML = "";
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.slice(0, 10).forEach((player, index) => {
        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.score}</td>
            </tr>
        `;
        leaderboardBody.innerHTML += row;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayLeaderboard();
});
