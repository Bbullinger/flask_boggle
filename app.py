from boggle import Boggle
from flask import Flask, request, render_template, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "my_password"
debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route("/")
def home_page():
    session["board"] = boggle_game.make_board()
    session["user_words"] = []
    return render_template("index.html")


@app.route("/game")
def game_start():
    print(session["user_words"])
    return render_template("game.html")


@app.route("/valid_word")
def check_validity():
    """
    Recieve user's word and verify it is a valid word, and exists on the game board.
    Return the response in json
    """
    guess = request.args["user_guess"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, guess)
    return jsonify({"result": response})


@app.route("/add_stats", methods=["POST"])
def user_stats():
    high_score = session.get("highscore", 0)
    num_plays = session.get("num_plays", 0)
    score = request.json["score"]
    print(score > high_score)
    session["numplays"] = num_plays + 1
    if score > high_score:
        session["high_score"] = score
    return jsonify(new_best=score > high_score)


# Project says use ajax to prevent refreshing. RIP
# @app.route("/game/add_word", methods=["POST"])
# def submit_word():

#     guess = request.form.get("user_guess")
#     # if boggle_game.check_valid_word(session["board"], guess) == "ok":
#     user_words = session.get("user_words")
#     user_words.append(guess)
#     user_words.append(boggle_game.check_valid_word(session["board"], guess))
#     session["user_words"] = user_words

#     return redirect("/game")
