
const $playerGuess = $('#player-guess');
const $highScore = $('#high-score');
const $foundWords = $('#found-words');
const $points = $('#points');
const $timer = $('#timer');
const $btnSubmit = $('#btn-submit')

console.log(localStorage.getItem('high-score'));
if (!localStorage.getItem('high-score'))
  localStorage.setItem('high-score', 0);

const GUESSED_WORDS = [];
let POINTS = 0;


async function confirmGuess() { 
  const guess = $playerGuess.val()
  const result = await axios({
    url: `/guess/${guess}`,
    method: 'GET',
  });
  console.log(result)
  const res = result.data.result;

  if (res === 'ok') {
    if (GUESSED_WORDS.includes(guess))
      alert(`${guess} has already been found`);
    else {
      GUESSED_WORDS.push(guess);
      $foundWords.append(` ${guess.toUpperCase()}`);
      POINTS += guess.length;
      $points.text(POINTS);
    }
  }
  else if (res == 'not-on-board') 
    alert(`${guess} is not on the board`);
  else
    alert(`${guess} is not a word`);

  $playerGuess.val("");
}

$('.guess-form').on("submit", (evt) =>{
  evt.preventDefault();
  if ($playerGuess.val() !== "")
    confirmGuess();
});

async function startTimer() {
  let time = 1;
  $timer.text(time)
  const int =  setInterval(async () => {
    time--;
    $timer.text(time)

    if (time <= 10)
      $timer.css('color', 'red')

    if (time === 0 ) {
      clearInterval(int);
      $playerGuess.prop('disabled', true);
      $btnSubmit.prop('disabled', true);
      $('#board').css('color', 'grey')
      let msg = await endGame();
      alert(msg)
    }
  }, 1000);
}

async function endGame() { 
  const result = await axios({
    url: '/endgame',
    method: 'POST',
    data: { "points": POINTS}
  });
  console.log(result)
  const high_score = result.data.new_high_score
  let msg = ""
  if (high_score)
    msg = `Game Over!\nNew High Score! ${POINTS}`
  else 
    msg = `Game Over!\nYour score: ${POINTS}`
  return msg;
}

$('#end-game').click(endGame);


startTimer();