function convertMinutesToMs(minutes) {
  return minutes * 60 * 1000;
}
function getFocusTimeInMilliseconds() {
  const duration = prompt('How long would you like your session to last');
  return convertMinutesToMs(duration);
}

function startPomodoro() {
  const time = getFocusTimeInMilliseconds();
  let timeRemaining = time;
  const countdownFunction = setInterval(countdown, 1000);
  function countdown() {
    console.log(timeRemaining);
    timeRemaining -= 1000;
    if (timeRemaining < 0) {
      clearInterval(countdownFunction);
    }
  }
  
}

startPomodoro();
