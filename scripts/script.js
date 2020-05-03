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
}

function resetClock(clock) {

  clearInterval(clockUpdateInterval);
  clock = {};
}
function stopPomodoro() {
  state = null;
  resetClock();
}

function start(clock) {
  function getTime(clock) {
    return clock.minutes * 60 * 1000 + clock.seconds * 1000;
  }
  const totalTime = getTime(clock);
  clockUpdateInterval = setInterval(updateClock, 1000);
  const refreshRate = 100;
  progressBarUpdateInterval = setInterval(updateProgressBar, refreshRate);
  let timeElapsed = 0; 
  function updateProgressBar() {
    timeElapsed += refreshRate;
    const currentTimeRemaining = totalTime - timeElapsed; 
    const progressBarWidth = `${(totalTime - currentTimeRemaining) / totalTime * 100}%`;
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
  const time = 1;
  const clock = {
    minutes: time,
    separator: ':',
    seconds: 0,
    type: 'focus'
  }
  start(clock);

}

function startBreak() {
  const clock = {
    minutes: 5,
    separator: ':',
    seconds: 0,
    type: 'break'
  }
  start(clock);
}

function startLongBreak() {
  const clock = {
    minutes: 15,
    separator: ':',
    seconds: 0,
    type: 'break'
  }
  start(clock);
}


const clocks = [...document.querySelectorAll('.clock')];
const controls = document.querySelector('.controls');
const session = document.querySelector('.sessions p');
const progressBar = document.querySelector('.progress-bar');
let clockUpdateInterval = null;
let state = null;
let sessions = 3;
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
