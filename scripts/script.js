function updateSessions(sessionNum) {
  session.textContent = sessionNum;
  if (sessions % 4 !== 0) {
    startBreak();
  } else {
    startLongBreak();
  }
}

function showClock(clock) {

  const timeRemaining = (
    clock.minutes.toString().padStart(2, '0') +
    clock.separator +
    clock.seconds.toString().padStart(2, '0')
  );

  const relevantClock = clocks.find(elem => {
    return elem.classList.contains(clock.type);
  });
  relevantClock.textContent = timeRemaining;
  return timeRemaining;
}

function timerIsUp(clock) {
  return clock.minutes === 0 && clock.seconds === 0;
}

function pausePomodoro() {
  state = 'paused';
  clearInterval(clockUpdateInterval);
  clearInterval(progressBarUpdateInterval);
}

function resetClock(clock) {

  clearInterval(clockUpdateInterval);
  clearInterval(progressBarUpdateInterval);
  clock = {};
}
function stopPomodoro() {
  state = null;
  resetClock();
}

function start(clock) {
  clockUpdateInterval = setInterval(updateClock, 1000);
  const refreshRate = 100;
  progressBarUpdateInterval = setInterval(updateProgressBar, refreshRate);
  function updateProgressBar() {
    timeElapsed += refreshRate;
    const currentTimeRemaining = clock.totalTime - timeElapsed;
    const progressBarWidth = `${(clock.totalTime - currentTimeRemaining) / clock.totalTime * 100}%`;
    progressBar.style.width = progressBarWidth;
  }
  function decreaseMinute() {
    clock.minutes--;
    clock.seconds = 59;
  }

  function updateClock() {
    clock.seconds--;
    if (clock.seconds < 0) {
      decreaseMinute();
    }
    console.log(showClock(clock));
    if (timerIsUp(clock)) {
      clearInterval(clockUpdateInterval);
      progressBar.style.width = '0px';
      clearInterval(progressBarUpdateInterval);
      timeElapsed = 0;
      if (clock.type === 'focus') {
        updateSessions(++sessions);
        return;
      }
      console.log('Break is over');
    }
  }
}

function startPomodoro() {
  state = 'running';
  start(clock);

}

function startBreak() {
  const clock = {
    minutes: 5,
    separator: ':',
    seconds: 0,
    type: 'break'
  }
  time = clock.minutes;
  totalTime = clock.minutes * 60 * 1000;
  timeElapsed = 0;
  start(clock);
}

function startLongBreak() {
  const clock = {
    minutes: 15,
    separator: ':',
    seconds: 0,
    type: 'break'
  }
  clock.minutes = 15;
  clock.seconds = 0;
  type = 'break';
  time = clock.minutes;
  totalTime = clock.minutes * 60 * 1000;
  timeElapsed = 0;
  start(clock);
}


const clocks = [...document.querySelectorAll('.clock')];
const controls = document.querySelector('.controls');
const session = document.querySelector('.sessions p');
const progressBar = document.querySelector('.progress-bar');
let clockUpdateInterval = null;
let state = null;
let sessions = 3;
let time = 1;
let timeElapsed = 0;

const clock = {
  minutes: time,
  separator: ':',
  seconds: 0,
  type: 'focus',
  totalTime: time * 60 * 1000
};

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
