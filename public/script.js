var stopwatch;
var isRunning = false;
var minutes = 0,
  seconds = 0,
  milliseconds = 0;

function startStopwatch() {
  if (!isRunning) {
    stopwatch = setInterval(updateTime, 10); // Update every 10 milliseconds
    document.getElementById("startButton").textContent = "Pause";
    isRunning = true;
  } else {
    clearInterval(stopwatch);
    document.getElementById("startButton").textContent = "Reset";
    isRunning = false;
  }
}

function resetStopwatch() {
  clearInterval(stopwatch);
  document.getElementById("startButton").textContent = "Start";
  isRunning = false;
  minutes = 0;
  seconds = 0;
  milliseconds = 0;
  document.getElementById("display").textContent = "00:00:00";
}

function plus2() {
  const time = document.getElementById("display").textContent;
  let [minutes, seconds, milliseconds] = time.split(":");

  let seconds2 = parseInt(seconds) + 2;
  let displaySeconds = seconds2.toString().padStart(2, "0");

  document.getElementById("display").textContent = `${minutes}:${displaySeconds}:${milliseconds}`;
}

let dnfC = 0;

function dnf() {
  resetStopwatch();
  dnfC++;
  document.getElementById("dnfC").textContent = dnfC;
}

function clr() {
  clearInterval(stopwatch);
  document.getElementById("startButton").textContent = "Start";
  document.getElementById("bval").innerHTML = "";
  document.getElementById("wval").innerHTML = "";
  minutes = 0;
  seconds = 0;
  milliseconds = 0;
  document.getElementById("display").textContent = "00:00:00";
  document.getElementById("avg5").textContent = "";
  document.getElementById("avg10").textContent = "";
  dnfC = 0;
  document.getElementById("dnfC").textContent = dnfC;
}

function updateTime() {
  milliseconds++;
  if (milliseconds === 100) {
    milliseconds = 0;
    seconds++;
  }
  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }

  var displayMinutes = minutes.toString().padStart(2, "0");
  var displaySeconds = seconds.toString().padStart(2, "0");
  var displayMilliseconds = milliseconds.toString().padStart(2, "0");

  document.getElementById("display").textContent = `${displayMinutes}:${displaySeconds}:${displayMilliseconds}`;
}

// Add the getSeparatedTime function
function getSeparatedTime(timeString) {
  const [minutes, seconds, milliseconds] = timeString.split(":");
  return [parseInt(minutes), parseInt(seconds), parseInt(milliseconds)];
}

document.getElementById("clr").addEventListener("click", (event) => {
  event.target.disabled = true;
  clr();
  event.stopPropagation();
  event.preventDefault();
  event.target.disabled = false;
});

document.getElementById("add").addEventListener("click", (event) => {
  event.target.disabled = true;
  plus2();
  event.stopPropagation();
  event.preventDefault();
  event.target.disabled = false;
});

document.getElementById("dnf").addEventListener("click", (event) => {
  event.target.disabled = true;
  dnf();
  event.stopPropagation();
  event.preventDefault();
  event.target.disabled = false;
});

document.addEventListener("keydown", async (e) => {
  if (e.keyCode === 32) {
    if (minutes === 0 && seconds === 0 && milliseconds === 0) {
      e.preventDefault();
      startStopwatch();
    } else {
      if (isRunning) {
        startStopwatch();
      } else {
        const displayTime = document.getElementById("display").textContent;
        let curSeparateValues = getSeparatedTime(displayTime);
        let curBestTime = document.getElementById("bval");
        let curWorstTime = document.getElementById("wval");
        let bestSeparateValues = getSeparatedTime(curBestTime.innerHTML);
        let worstSeparateValues = getSeparatedTime(curWorstTime.innerHTML);

        if (curBestTime.innerHTML === "") {
          curBestTime.innerHTML = displayTime;
        } else if (curSeparateValues[0] < bestSeparateValues[0]) {
          curBestTime.innerHTML = displayTime;
        } else if (
          curSeparateValues[0] === bestSeparateValues[0] &&
          curSeparateValues[1] < bestSeparateValues[1]
        ) {
          curBestTime.innerHTML = displayTime;
        } else if (
          curSeparateValues[1] === bestSeparateValues[1] &&
          curSeparateValues[2] < bestSeparateValues[2]
        ) {
          curBestTime.innerHTML = displayTime;
        }

        if (curWorstTime.innerHTML === "") {
          curWorstTime.innerHTML = displayTime;
        } else if (curSeparateValues[0] > worstSeparateValues[0]) {
          curWorstTime.innerHTML = displayTime;
        } else if (
          curSeparateValues[0] === worstSeparateValues[0] &&
          curSeparateValues[1] > worstSeparateValues[1]
        ) {
          curWorstTime.innerHTML = displayTime;
        } else if (
          curSeparateValues[1] === worstSeparateValues[1] &&
          curSeparateValues[2] > worstSeparateValues[2]
        ) {
          curWorstTime.innerHTML = displayTime;
        }

        try {
          await updateUserData(curBestTime.innerHTML);
        } catch (error) {
          console.error('Error updating user data:', error);
        }

        addTimeAndCalculateAverage();
        resetStopwatch();
      }
    }
  }
});

async function updateUserData(curBestTime) {
  await fetch("/updateUserData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cur_best_time: curBestTime,
      avg5: document.getElementById("avg5").textContent,
      avg10: document.getElementById("avg10").textContent,
    }),
  });
}

const timeArray = [];

function addTimeAndCalculateAverage() {
  const displayDiv = document.getElementById("display");
  const currentTime = displayDiv.textContent;

  timeArray.push(currentTime);

  if (timeArray.length > 10) {
    timeArray.shift();
  }

  let totalMilliseconds = 0;
  for (const time of timeArray) {
    const [minutes, seconds, milliseconds] = time.split(":");
    totalMilliseconds +=
      parseInt(minutes) * 60000 +
      parseInt(seconds) * 1000 +
      parseInt(milliseconds);
  }

  const averageMilliseconds = totalMilliseconds / timeArray.length;
  const averageMinutes = Math.floor(averageMilliseconds / 60000);
  const averageSeconds = Math.floor((averageMilliseconds % 60000) / 1000);
  const averageMillisecondsRemainder = Math.floor(averageMilliseconds % 1000);

  if (timeArray.length === 5) {
    const avg5Input = document.getElementById("avg5");
    avg5Input.textContent = `${averageMinutes}:${averageSeconds}:${averageMillisecondsRemainder}`;
  }

  if (timeArray.length === 10) {
    const avg10Input = document.getElementById("avg10");
    avg10Input.textContent = `${averageMinutes}:${averageSeconds}:${averageMillisecondsRemainder}`;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("/checkLogin");
  const data = await response.json();

  const userHeaderElement = document.getElementById("userHeader");

  if (data.loggedIn) {
    userHeaderElement.innerHTML = `<p class="user">Welcome: ${data.username} <button id="logout">Logout</button></p>`;

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", async function () {
      const logoutResponse = await fetch("/logout");
      const logoutData = await logoutResponse.json();

      if (logoutData.loggedOut) {
        window.location.href = "login.html";
      } else {
        alert("Error during logout");
      }
    });
  } else {
    userHeaderElement.innerHTML = `<button id="login"><a href="login.html">LOGIN</a></button>`;
  }
});
