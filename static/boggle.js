const $user_words = $("#user_words");
const $user_guess = $("#user_guess");
const $guess_form = $("#guess_form");
const $invalid_message = $("#invalid_message");
const $score = $("#score");
const $game_time = $("#game_time");

class Board {
  constructor(htmlBoard, seconds = 60) {
    this.htmlBoard = htmlBoard;
    $guess_form.on("submit", this.submitAndCheck.bind(this));
    this.scoredWords = new Set();
    this.score = 0;
    this.seconds = seconds;
    this.timer = 0;
    this.gameTime = setInterval(this.gameTime.bind(this), 1000);
  }
  async submitAndCheck(e) {
    //This function handles user guesses at what word are on the board, sending those
    //guesses to backend to verify if the word is real, and on the board
    e.preventDefault();

    //logic to prevent user entering words after timer expires
    if (this.timer != this.seconds) {
      //clear error message, collect guess value, and reset input
      $invalid_message.empty();
      const guess = $user_guess.val();
      $user_guess.val("");

      //Do nothing if there was no guess, and alert user of repeated word
      if (guess === "") {
        return;
      }

      //sends guess to back end to check for validity of word, returning result as error
      //message to user
      if (this.scoredWords.has(guess)) {
        this.addMessage($invalid_message, "Word already scored.");
        return;
      }
      const response = await axios.get("/valid_word", {
        params: { user_guess: guess },
      });

      if (response.data.result === "not-word") {
        this.addMessage($invalid_message, "Not a valid word.");
      } else if (response.data.result === "not-on-board") {
        this.addMessage($invalid_message, "Word not on board.");
      } else {
        $user_words.append(`<li>${guess}</li>`);
        this.scoredWords.add(guess);
        this.score += guess.length;
        $score.empty();
        this.addMessage($score, `Score: ${this.score}`);
      }
    }
  }
  addMessage(parentElement, message) {
    parentElement.append(`<p>${message}</p>`);
  }
  async gameTime() {
    this.timer += 1;
    if (this.timer === this.seconds) {
      this.addMessage($invalid_message, "Time's up!");
      await this.finalScore();
      clearInterval(this.gameTime);
    }
    $game_time.empty();
    this.addMessage($game_time, `Time Left:${this.seconds - this.timer}`);
  }
  async finalScore() {
    $user_words.hide();
    const response = await axios.post("/add_stats", { score: this.score });
    console.log(response, response.data.new_best);
    if (response.data.new_best) {
      this.addMessage($game_time, `New record! ${score}`);
    } else {
      this.addMessage($game_time, `Final Score: ${score}`);
    }
  }
}
