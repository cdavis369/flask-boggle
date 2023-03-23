from boggle import Boggle
from flask import Flask, render_template, request, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = '<8675309>'
toolbar = DebugToolbarExtension(app)

boggle_game = Boggle()
high_score = 0

@app.route('/')
def view_boggle_board():
  """ make a new board, store it in session, and render the template """
  board = boggle_game.make_board()
  session['board'] = board
  return render_template("index.html", board=board)

@app.route('/guess/<guess>')
def check_board_for_guess(guess):
  """ check if word is valid and on the board """
  board = session['board']
  result = boggle_game.check_valid_word(board, guess)
  return jsonify({"result": result})

@app.route("/endgame", methods=['POST'])
def handle_game_over():
  session['play-count'] = session.get('play-count', 0) + 1
  session['high-score'] = session.get("high-score", 0)
  points = request.json['points']
  high_score = session.get("high-score", 0)
  if points > high_score:
    session['high-score'] = points
    return jsonify(new_high_score=True)
  
  return jsonify({"new_high_scor":False, "high_score":high_score})  
      