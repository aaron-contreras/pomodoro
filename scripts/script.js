function showClock(clock) {

  const timeRemaining = clock.minutes.toString().padStart(2, '0') + clock.separator + clock.seconds.toString().padStart(2, '0');
  clockHeading.textContent = timeRemaining;
  return timeRemaining;
}

function timerIsUp(clock) {
  return clock.minutes === 0 && clock.seconds === 0;
}

function pausePomodoro() {
  state = 'paused';
  clearInterval(intervalId);
}

function stopPomodoro() {
  state = null;
  resetClock();
}
function startPomodoro() {
  state = 'running';
  const time = 25;
  const clock = {
    minutes: time,
    separator: ':',
    seconds: 0
  }

  intervalId = setInterval(updateClock, 1000);
  function decreaseMinute(clock) {
    clock.minutes--;
    clock.seconds = 59;
  }

  function updateClock() {
    clock.seconds--;
    if (clock.seconds < 0) {
      decreaseMinute(clock);
    }
    console.log(showClock(clock));
    if (timerIsUp(clock)) {
      clearInterval(intervalId);
    }
  }
}



const clockHeading = document.querySelector('.clock');
const controls = document.querySelector('.controls');
let intervalId = null;
let state = null;
controls.addEventListener('click', event => {
  if (event.target.className === 'start') {
    if (state !== 'running') {
      startPomodoro();
    }
  } else if (event.target.className === 'pause') {
    pausePomodoro();
  } else if (event.target.className === 'stop') {
    stopPomodoro();
  }
});

startPomodoro();
