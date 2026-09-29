/* =========================
   DATE
========================= */

const date = new Date();

const options = {
    day: "numeric",
    month: "long",
    year: "numeric"
};

document.getElementById("todayDate").textContent =
    date.toLocaleDateString("en-IN", options);

document.getElementById("todayDay").textContent =
    date.toLocaleDateString("en-IN", {
        weekday: "long"
    });


/* =========================
   DARK MODE
========================= */

function toggleTheme() {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        darkMode
    );

    document.getElementById("themeBtn").textContent =
        darkMode ? "☀️" : "🌙";
}


if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark");

    document.getElementById("themeBtn").textContent =
        "☀️";
}


/* =========================
   DAILY SCHEDULE
========================= */

function saveSchedule() {

    const study =
        Number(document.getElementById("studyHours").value) || 0;

    const activity =
        Number(document.getElementById("activityHours").value) || 0;

    const sleep =
        Number(document.getElementById("sleepHours").value) || 0;

    const free =
        Number(document.getElementById("freeHours").value) || 0;


    const total =
        study + activity + sleep + free;


    if (total > 24) {

        alert(
            "Your plan is more than 24 hours. Please adjust it!"
        );

        return;
    }


    const schedule = {
        study,
        activity,
        sleep,
        free
    };


    localStorage.setItem(
        "schedule",
        JSON.stringify(schedule)
    );


    updateDashboard();

    alert("Today's plan saved! 🎉");
}


/* =========================
   LOAD SCHEDULE
========================= */

function loadSchedule() {

    const saved =
        localStorage.getItem("schedule");

    if (!saved) return;

    const schedule =
        JSON.parse(saved);


    document.getElementById("studyHours").value =
        schedule.study;

    document.getElementById("activityHours").value =
        schedule.activity;

    document.getElementById("sleepHours").value =
        schedule.sleep;

    document.getElementById("freeHours").value =
        schedule.free;


    updateDashboard();
}


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    const study =
        Number(document.getElementById("studyHours").value) || 0;

    const activity =
        Number(document.getElementById("activityHours").value) || 0;

    const sleep =
        Number(document.getElementById("sleepHours").value) || 0;

    const free =
        Number(document.getElementById("freeHours").value) || 0;


    document.getElementById("studyDisplay")
        .textContent = study;

    document.getElementById("activityDisplay")
        .textContent = activity;

    document.getElementById("sleepDisplay")
        .textContent = sleep;


    const total =
        study + activity + sleep + free;


    let progress = 0;

    if (total > 0) {

        progress =
            Math.min((total / 24) * 100, 100);

    }


    document.getElementById("progressFill")
        .style.width = progress + "%";

    document.getElementById("progressPercent")
        .textContent =
        Math.round(progress) + "%";


    const message =
        document.getElementById("balanceMessage");


    if (total === 0) {

        message.textContent =
            "Create your schedule to see your progress.";

    }

    else if (total < 20) {

        message.textContent =
            "You still have some unplanned time. Add useful activities.";

    }

    else if (total <= 24) {

        message.textContent =
            "Your day is planned. Now focus on consistency! 🚀";

    }

}


/* =========================
   GOALS
========================= */

let goals =
    JSON.parse(
        localStorage.getItem("goals")
    ) || [];


function addGoal() {

    const input =
        document.getElementById("goalInput");

    const text =
        input.value.trim();


    if (text === "") {

        alert("Write a goal first!");

        return;
    }


    const goal = {

        id: Date.now(),

        text: text,

        completed: false

    };


    goals.push(goal);

    input.value = "";

    saveGoals();

    displayGoals();

}


function displayGoals() {

    const list =
        document.getElementById("goalList");

    list.innerHTML = "";


    goals.forEach(function(goal) {

        const item =
            document.createElement("div");


        item.className = "goal-item";


        if (goal.completed) {

            item.classList.add("completed");

        }


        item.innerHTML = `

            <input
                type="checkbox"
                ${goal.completed ? "checked" : ""}
                onchange="toggleGoal(${goal.id})"
            >

            <span>
                ${goal.text}
            </span>

            <button
                class="goal-delete"
                onclick="deleteGoal(${goal.id})"
            >
                Delete
            </button>

        `;


        list.appendChild(item);

    });


    updateGoalProgress();

}


function toggleGoal(id) {

    goals =
        goals.map(function(goal) {

            if (goal.id === id) {

                goal.completed =
                    !goal.completed;

            }

            return goal;

        });


    saveGoals();

    displayGoals();

}


function deleteGoal(id) {

    goals =
        goals.filter(function(goal) {

            return goal.id !== id;

        });


    saveGoals();

    displayGoals();

}


function saveGoals() {

    localStorage.setItem(
        "goals",
        JSON.stringify(goals)
    );

}


function updateGoalProgress() {

    if (goals.length === 0) {

        document.getElementById("goalDisplay")
            .textContent = 0;

        return;

    }


    const completed =
        goals.filter(function(goal) {

            return goal.completed;

        }).length;


    const percent =
        Math.round(
            (completed / goals.length) * 100
        );


    document.getElementById("goalDisplay")
        .textContent = percent;

}


/* =========================
   FOCUS TIMER
========================= */

let timeLeft = 25 * 60;

let timerInterval = null;


function updateTimer() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    document.getElementById("timer")
        .textContent =

        String(minutes).padStart(2, "0")
        + ":"
        +
        String(seconds).padStart(2, "0");

}


function startTimer() {

    if (timerInterval !== null) return;


    timerInterval =
        setInterval(function() {

            if (timeLeft > 0) {

                timeLeft--;

                updateTimer();

            }

            else {

                clearInterval(timerInterval);

                timerInterval = null;

                alert("Focus session complete! 🎉");

            }

        }, 1000);

}


function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

}


function resetTimer() {

    pauseTimer();

    timeLeft = 25 * 60;

    updateTimer();

}


/* =========================
   MOTIVATION
========================= */

const quotes = [

    "Small progress every day creates big results.",

    "Your future is created by what you do today.",

    "Focus on progress, not perfection.",

    "Discipline turns goals into achievements.",

    "One focused hour can change your whole day.",

    "Start small. Stay consistent. Keep improving.",

    "Your habits build your future."

];


function newQuote() {

    const random =
        Math.floor(
            Math.random() * quotes.length
        );


    document.getElementById("quote")
        .textContent = quotes[random];

}


/* =========================
   START APP
========================= */

loadSchedule();

displayGoals();

updateTimer();