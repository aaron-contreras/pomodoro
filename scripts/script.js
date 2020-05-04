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

function clearIntervals() {
  clearInterval(clockUpdateInterval);
  clearInterval(progressBarUpdateInterval);
}

function resetProgressBar() {
  clearInterval(clockUpdateInterval);
  clearInterval(progressBarUpdateInterval);
  progressBar.style.width = '0px';
}

function updateProgressBar() {
  timeElapsed += refreshRate;
  const currentTimeRemaining = clock.totalTime - timeElapsed;
  const progressBarWidth = `${(clock.totalTime - currentTimeRemaining) / clock.totalTime * 100}%`;
  progressBar.style.width = progressBarWidth;
}

function start() {
  clockUpdateInterval = setInterval(updateClock, 1000);
  progressBarUpdateInterval = setInterval(updateProgressBar, refreshRate);

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
      resetProgressBar();
      if (clock.type === 'focus') {
        updateSessions(++sessions);
        return;
      }
      console.log('Break is over');
    }
  }
}

function resetClock(minutes, type) {
  clock.minutes = minutes;
  clock.seconds = 0;
  clock.type = type;
  time = minutes;
  clock.totalTime = minutes * 60 * 1000;
  timeElapsed = 0;
}

function toggleFocusSelection() {
  modeButtons.forEach(button => {
    if (button.getAttribute('disabled')) {
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('disabled', 'true');
    }
  });
}
function startPomodoro() {
  running = true;
  start();
  toggleFocusSelection();
}

function pausePomodoro() {
  clearIntervals();
  running = false;
}

function stopPomodoro() {
  clearIntervals();
  resetClock(1, 'focus');
  toggleFocusSelection();
  running = false;
}

function startBreak() {
  resetClock(5, 'break');
  start();
}

function startLongBreak() {
  resetClock(15, 'break');
  start();
}
const modes = {
  short: {
    focus: 25,
    break: 5,
    longBreak: 15
  },
  long: {
    focus: 50,
    break: 10,
    longBreak: 15
  }
};

function getMode(event) {
  return event.target.getAttribute('data-duration') === '25' ?
    modes.short :
    modes.long;
}
const clocks = [...document.querySelectorAll('.clock')];
const controls = document.querySelector('.controls');
const session = document.querySelector('.sessions p');
const progressBar = document.querySelector('.progress-bar');
const timeSelections = document.querySelector('.focus-time-selection');
const modeButtons = [...timeSelections.children];
timeSelections.firstElementChild.classList.add('selected-mode');
timeSelections.addEventListener('click', event => {
  if (event.target.nodeName === 'BUTTON') {
    modeButtons.forEach(button => {
      mode = getMode(event);
      button.classList.add('selected-mode');
      if (button !== event.target) {
        button.classList.remove('selected-mode');
      }
    });
  }
  console.log(mode);
});
let mode = null;
let running = false;
let sessions = session.textContent;
let time = 1;
let timeElapsed = 0;
const refreshRate = 100;
const clock = {
  minutes: time,
  separator: ':',
  seconds: 0,
  type: 'focus',
  totalTime: time * 60 * 1000
};
controls.addEventListener('click', event => {
  if (event.target.className === 'start') {
    if (!running) {
      startPomodoro();
    }
  } else if (event.target.className === 'pause') {
    pausePomodoro();
  } else if (event.target.className === 'stop') {
    stopPomodoro();
  }
});

startPomodoro();
