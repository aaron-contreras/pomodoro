function showClock(clock) {
  return clock.minutes.toString().padStart(2, '0') + clock.separator + clock.seconds.toString().padStart(2, '0');
}

function timerIsUp(clock) {
  return clock.minutes === 0 && clock.seconds === 0;
}
function startPomodoro() {
  const time = +prompt('How many minutes of focus?');
  const clock = {
    minutes: time,
    separator: ':',
    seconds: 0
  }
  
  const countdown = setInterval(decreaseSecond, 1000);
  function decreaseMinute(clock) {
    clock.minutes--;
    clock.seconds = 59;
  }

  function decreaseSecond() {
    clock.seconds--;
    if (clock.seconds < 0) {
      decreaseMinute(clock);
    }
    console.log(showClock(clock));
    if (timerIsUp(clock)) {
      clearInterval(countdown);
    }
  }
}

startPomodoro();
