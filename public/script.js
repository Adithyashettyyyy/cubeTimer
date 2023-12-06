var stopwatch;
      var isRunning = false;
      var minutes = 0,
        seconds = 0,
        milliseconds = 0;
      let m;

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
        // isRunning = !isRunning;
      }

      function resetStopwatch() {
        clearInterval(stopwatch);
        document.getElementById("startButton").textContent = "Start";
        isRunning = false;
        // hours = 0;
        minutes = 0;
        seconds = 0;
        milliseconds = 0;
        document.getElementById("display").textContent = "00:00:00";
      }

      function plus2(){
        const time = document.getElementById("display").textContent;
        let totalMilliseconds = 0;
        // _sec = time.substring(3, 5);
        // parseInt(_sec);
        // _sec += 2;
        let [minutes, seconds, milliseconds] = time.split(":");
        // totalMilliseconds += (parseInt(minutes) * 60000 + parseInt(seconds) * 1000 + parseInt(milliseconds));
        // makeproper(minutes,seconds,milliseconds);
        let seconds2 = parseInt(seconds);
        seconds2 += 2;
        let displaySeconds = seconds2 < 10 ? "0" + seconds2 : seconds2;
        document.getElementById("display").textContent = `${minutes}:${displaySeconds}:${milliseconds}`;
      }

      let dnfC = 0;2
      function dnf(){
        resetStopwatch();
        dnfC++;
        document.getElementById("dnfC").textContent = dnfC;
      }

      function clr() {
        clearInterval(stopwatch);
        document.getElementById("startButton").textContent = "Start";
        document.getElementById('bval').innerHTML = "";
        document.getElementById('wval').innerHTML = "";
        // hours = 0;
        // isRunning = false;
        minutes = 0;
        seconds = 0;
        milliseconds = 0;
        document.getElementById("display").textContent = "00:00:00";
        document.getElementById("avg5").textContent = "";
        document.getElementById("avg10").textContent = "";
        dnfC = 0;
        document.getElementById("dnfC").textContent = dnfC;

        //  document.getElementById("clr").removeEventListener("click");
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
        // if (minutes === 60) {
        //   minutes = 0;
        //   hours++;
        // }
        // var displayHours = hours < 10 ? "0" + hours : hours;
        var displayMinutes = minutes < 10 ? "0" + minutes : minutes;
        var displaySeconds = seconds < 10 ? "0" + seconds : seconds;
        var displayMilliseconds =
          milliseconds < 10 ? "0" + milliseconds : milliseconds;
        document.getElementById("display").textContent =
          displayMinutes + ":" + displaySeconds + ":" + displayMilliseconds;
      }
      
        
      function randomShuffle() {
        const cubeNotations = "R U L D F B R' U' L' D' F' B' R2 U2 L2 D2 F2 B2";
        const notationsArray = cubeNotations.split(" ");
        let randomNotations = "";
        for (let i = 0; i < 20; i++) {
          const randomIndex = Math.floor(Math.random() * notationsArray.length);
          randomNotations += notationsArray[randomIndex] + " ";
        }
        document.getElementById("random-notations").textContent =
          randomNotations;
      }

      function getSeparatedTime(value) {
        mili_sec = value.substring(6);
        _sec = value.substring(3, 5);
        _min = value.substring(0, 2);
        return [parseInt(_min), parseInt(_sec), parseInt(mili_sec)];
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

      // window.onkeydown = function (event) {
      document.addEventListener("keydown", (e) => {
        if (e.keyCode === 32) {
          if (minutes == 0 && seconds == 0 && milliseconds == 0) {
            e.preventDefault();
            // isRunning = false;
            startStopwatch();
          } else {
            if (isRunning) {
              startStopwatch();
              
            

            } else {
              m = document.getElementById("display").textContent;
              cur_time = document.getElementById("display").textContent;
              let cur_separate_values = getSeparatedTime(cur_time);
              let cur_best_time = document.getElementById("bval");
              let cur_worst_time = document.getElementById("wval");
              let best_separate_values = getSeparatedTime(
                cur_best_time.innerHTML
              );
              let worst_separate_values = getSeparatedTime(
                cur_worst_time.innerHTML
              );
              if (cur_best_time.innerHTML == "") {
                cur_best_time.innerHTML = cur_time;
              } else if (cur_separate_values[0] < best_separate_values[0]) {
                cur_best_time.innerHTML = cur_time;
              } else if (
                cur_separate_values[0] == best_separate_values[0] &&
                cur_separate_values[1] < best_separate_values[1]
              ) {
                cur_best_time.innerHTML = cur_time;
              } else if (
                cur_separate_values[1] == best_separate_values[1] &&
                cur_separate_values[2] < best_separate_values[2]
              ) {
                cur_best_time.innerHTML = cur_time;
              }

              if (cur_worst_time.innerHTML == "") {
                cur_worst_time.innerHTML = cur_time;
              } else if (cur_separate_values[0] > worst_separate_values[0]) {
                cur_worst_time.innerHTML = cur_time;
              } else if (
                cur_separate_values[0] == worst_separate_values[0] &&
                cur_separate_values[1] > worst_separate_values[1]
              ) {
                cur_worst_time.innerHTML = cur_time;
              } else if (
                cur_separate_values[1] == worst_separate_values[1] &&
                cur_separate_values[2] > worst_separate_values[2]
              ) {
                cur_worst_time.innerHTML = cur_time;
              }
              addTimeAndCalculateAverage();
              resetStopwatch();
            }
          }
        }
      });

      
      // }

      // Define an array to store the times
const timeArray = [];

// Function to add a time to the array and calculate the average
function addTimeAndCalculateAverage() {
  console.log(100);
  const displayDiv = document.getElementById("display");
  const currentTime = displayDiv.textContent;

  // Add the current time to the array
  timeArray.push(currentTime);

  // Remove the oldest time if there are more than 5 in the array
  if (timeArray.length > 10) {
    timeArray.shift();
  }

  // Calculate the average of the times in the array
  let totalMilliseconds = 0;
  for (const time of timeArray) {
    const [minutes, seconds, milliseconds] = time.split(":");
    totalMilliseconds += (parseInt(minutes) * 60000 + parseInt(seconds) * 1000 + parseInt(milliseconds));
  }
  const averageMilliseconds = totalMilliseconds / timeArray.length;

  // Convert the average back to the time format
  const averageMinutes = Math.floor(averageMilliseconds / 60000);
  const averageSeconds = Math.floor((averageMilliseconds % 60000) / 1000);
  const averageMillisecondsRemainder = Math.floor(averageMilliseconds % 1000);

  // Display the average in the web page with the correct format
  if(timeArray.length == 5){
    const avg5Input = document.getElementById("avg5");
    avg5Input.textContent = `${averageMinutes}:${averageSeconds}:${averageMillisecondsRemainder}`;
  }

  if(timeArray.length == 10){
    const avg10Input = document.getElementById("avg10");
    avg10Input.textContent = `${averageMinutes}:${averageSeconds}:${averageMillisecondsRemainder}`;
  }
}

// ... Your existing code ...

document.addEventListener("DOMContentLoaded", async function () {
  // Check if the user is logged in
  const response = await fetch("/checkLogin");
  const data = await response.json();

  const userHeaderElement = document.getElementById("userHeader");

  if (data.loggedIn) {
    // If logged in, update the header with the user's username
    userHeaderElement.innerHTML = `<p class="user">Welcome: ${data.username} <button id="logout">Logout</button></p>`;
    
    // Add an event listener for the logout button
    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", async function () {
      // Send a request to the server to logout
      const logoutResponse = await fetch("/logout");
      const logoutData = await logoutResponse.json();

      if (logoutData.loggedOut) {
        // Redirect to the login page or update the UI as needed
        window.location.href = "login.html";
      } else {
        alert("Error during logout");
      }
    });
  } else {
    // If not logged in, add the login button
    userHeaderElement.innerHTML = `<button id="login"><a href="login.html">LOGIN</a></button>`;
  }
});


