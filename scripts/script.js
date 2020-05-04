function updateSessions(sessionNum) {
  session.textContent = sessionNum;
  if (sessions % 4 !== 0) {
    startBreak();
  } else {
    startLongBreak();
  }
}

function showClock() {
  const timeRemaining = (
    clock.minutes.toString().padStart(2, '0') +
    clock.separator +
    clock.seconds.toString().padStart(2, '0')
  );

  clockDisplay.textContent = timeRemaining;
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
  progressBar.style.transitionDuration = '1s';
  progressBar.style.width = '0px';
}

function updateProgressBar() {
  timeElapsed += refreshRate;
  const progressBarWidth = `${timeElapsed / clock.totalTime * 100}`;
  progressBar.style.width = progressBarWidth + '%';
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
    showClock(clock);
    if (timerIsUp(clock)) {
      shotclock.play();
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
  resetClock(mode.focus, 'focus');
  resetProgressBar();
  showClock();
  toggleFocusSelection();
  running = false;
}

function startBreak() {
  resetClock(mode.break, 'break');
  start();
}

function startLongBreak() {
  resetClock(mode.longBreak, 'break');
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
const clockDisplay = document.querySelector('.clock');
const controls = document.querySelector('.controls');
const session = document.querySelector('.sessions p');
const progressBar = document.querySelector('.progress-bar');
const timeSelections = document.querySelector('.focus-time-selection');
const modeButtons = [...timeSelections.children];
const shotclock = document.querySelector('audio');
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

    resetClock(mode.focus, 'focus');
    showClock();
  }
});
let mode = modes.short;
let running = false;
let sessions = session.textContent;
let time = 1;
let timeElapsed = 0;
const refreshRate = 100;
const clock = {
  minutes: null,
  separator: ':',
  seconds: 0,
  type: 'focus',
  totalTime: null
};
resetClock(1, 'focus');
controls.addEventListener('click', event => {
  console.log(event);
  if (event.target.className.includes('play')) {
    if (!running) {
      startPomodoro();
    }
  } else if (event.target.className.includes('pause')) {
    pausePomodoro();
  } else if (event.target.className.includes('stop')) {
    stopPomodoro();
  }
});
