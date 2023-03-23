const $playerGuess = $('#player-guess');
const $timer = $('#timer');
const $message = $('#message');

class BoggleGame {
  constructor(time=60) {
    this.time = time;
    this.points = 0;
    this.words = [];
    this.startTimer();
    $playerGuess.focus()
  }

  async confirmGuess() { 
    const guess = $playerGuess.val()
    console.log(guess)
    const result = await axios({
      url: `/guess/${guess}`,
      method: 'GET',
    });
    console.log(result)
    const res = result.data.result;

    if (res === 'ok') {
      if (this.words.includes(guess))
        $message.text(`${guess} has already been found`);
      else {
        this.words.push(guess);
        $('#found-words').append(` - ${guess.toUpperCase()}`);
        this.points += guess.length;
        $('#points').text(this.points);
      }
    }
    else if (res == 'not-on-board') 
      $message.text(`${guess} is not on the board`);
    else
      $message.text(`${guess} is not a word`);

    $playerGuess.val("");
  }

  async startTimer() {
    $timer.text(this.time)
    const interval =  setInterval(async () => {
      this.time--;
      $timer.text(this.time)

      if (this.time <= 10)
        $timer.css('color', 'red')

      if (this.time === 0 ) {
        clearInterval(interval);
        $playerGuess.prop('disabled', true);
        $('#btn-submit').prop('disabled', true);
        $('#board').css('color', 'grey')
        let msg = await this.endGame();
        $message.text(msg)
      }
    }, 1000);
  }

  async endGame() { 
    const result = await axios({
      url: '/endgame',
      method: 'POST',
      data: {"points": this.points}
    });
    console.log(result)
    if (result.data.new_high_score)
      return `Game Over!\nNew High Score! ${this.points}`;
    else 
      return `Game Over!\nYour score: ${this.points}`;
  }
}

const boggle = new BoggleGame();

$('.guess-form').on("submit", (evt) =>{
  evt.preventDefault();
  if ($playerGuess.val() !== "")
    boggle.confirmGuess();
});

$('#btn-restart').click(() => boggle = new BoggleGame())
