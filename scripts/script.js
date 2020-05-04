function updateSessions(sessionNum) {
  if (sessionNum === 0) {
    while (session.firstChild) {
      if (session.lastChild.nodeName === 'H3') {
        break;
      }
      session.removeChild(session.lastChild);
    }
    const para = document.createElement('p');
    para.textContent = '0';
    session.appendChild(para);
    return;
  }
  if ([...session.children].some(child => child.nodeName === 'P')) {
    session.removeChild(session.firstElementChild.nextElementSibling);
  }

  if (sessions % 4 !== 0) {
    startBreak();
  } else {
    startLongBreak();
  }
  session.appendChild(tomato.cloneNode());
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
  progressBar.style.transition = '1s';
  progressBar.style.width = '0px';
  transitionDuration = 1;
}

let transitionDuration = 1;
function updateProgressBar() {
  timeElapsed += refreshRate;
  const difference = clock.totalTime - (clock.minutes * 60 * 1000 + clock.seconds * 1000);
  // Update the progress bar if tab becomes inactive
  if (timeElapsed < difference) timeElapsed = difference;
  if (progressBar.style.transition &&
    timeElapsed > clock.totalTime * 0.1 && transitionDuration > 0) {
    console.log('in');
    transitionDuration -= 0.01;
    if (transitionDuration < 0.01) {
      transitionDuration = 0;
    }
    progressBar.style.transition = `${transitionDuration}s`;
  }
  const progressBarWidth = `${timeElapsed / (clock.totalTime) * 100}`;
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
      resetClock(mode.focus, 'focus');
    }
  }
}

function resetClock(minutes, type) {
  modeTag.textContent = type === 'focus' ?
    'Stop looking at me and focus!' :
    'Good job! Take a break';
  clock.minutes = minutes;
  clock.seconds = 0;
  clock.type = type;
  time = minutes;
  clock.totalTime = minutes * 60 * 1000;
  timeElapsed = 0;
}

function removeFocusSelection() {
  modeButtons.forEach(button => {
    button.setAttribute('disabled', 'true');
  });
}

function enableFocusSelection() {
  modeButtons.forEach(button => {
    button.removeAttribute('disabled');
  });
}

function startPomodoro() {
  running = true;
  start();
  removeFocusSelection();
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
    focus: 1,
    break: 5,
    longBreak: 15
  },
  long: {
    focus: 50,
    break: 10,
    longBreak: 30
  }
};

function getMode(event) {
  return event.target.getAttribute('data-duration') === '25' ?
    modes.short :
    modes.long;
}
const clockDisplay = document.querySelector('.clock');
const controls = document.querySelector('.controls');
const session = document.querySelector('.sessions');
const progressBar = document.querySelector('.progress-bar');
const timeSelections = document.querySelector('.focus-time-selection');
const modeButtons = [...timeSelections.children];
const shotclock = document.querySelector('audio');
const modeTag = document.querySelector('.timer p');
timeSelections.firstElementChild.classList.add('selected-mode');
timeSelections.addEventListener('click', event => {
  if (event.target.nodeName === 'BUTTON') {
    modeButtons.forEach(button => {
      mode = getMode(event);
      updatePomodoroSettings();
      button.classList.add('selected-mode');
      if (button !== event.target) {
        button.classList.remove('selected-mode');
      }
    });

    resetClock(mode.focus, 'focus');
    showClock();
  }
});
const settings = ['Focus', 'Break', 'Long break'];
function updatePomodoroSettings() {
  let index = 0;
  for (let key in mode) {
    pomodoroSettings[index].textContent = (
      `${settings[index]}: ${mode[key]} min`
    );
    index++;
  }
}
const pomodoroSettings = document.querySelectorAll('.pomodoro-settings p');
const tomato = document.createElement('img');
tomato.setAttribute('src', "https://img.icons8.com/plasticine/100/000000/tomato.png");
console.log(pomodoroSettings);
let mode = modes.short;
updatePomodoroSettings();
let running = false;
let sessions = 0;
let time = 1;
let timeElapsed = 0;
const refreshRate = 100;
let clockUpdateInterval = null;
let progressBarUpdateInterval = null;
const clock = {
  minutes: null,
  separator: ':',
  seconds: 0,
  type: 'focus',
  totalTime: null
};
resetClock(mode.focus, 'focus');
function clearAll() {
  stopPomodoro();
  enableFocusSelection();
  updateSessions(sessions = 0);
  modeButtons.forEach(button => {
    button.classList.remove('selected-mode');
  });
}
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
  } else if (event.target.className.includes('trash')) {
    clearAll();
  }
});
