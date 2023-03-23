from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    app.config['TESTING'] = True
        
    def test_game_setup(self):
        """ test if game has board and all display info on page """
        with app.test_client() as client:
            res = client.get('/')
            self.assertIn('board', session)
            self.assertIsNone(session.get('high-score'))
            self.assertIsNone(session.get('play-count'))
            html = res.get_data(as_text=True)
            self.assertIn('<div id="game-data">', html)
            self.assertIn('<div id="div-restart">', html)
            self.assertIn('<div id="timer"></div>', html)
            self.assertIn('<div id="game">', html)
            self.assertIn('<div id="message">', html)         
        
    def test_word_guess(self):
        """ test if guess word works """
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] = [
                    ["T","E","S","T","T"],
                    ["T","E","S","T","T"],
                    ["T","E","S","T","T"],
                    ["T","E","S","T","T"],
                    ["T","E","S","T","T"],
                ]
        res = client.get("/guess/test")
        self.assertEqual(res.json['result'], 'ok')
        
    def test_invalid_word(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] = [
                    ["T","E","S","T","T"],
                    ["T","E","S","T","T"],
                    ["T","E","S","T","T"],
                    ["T","E","S","T","T"],
                    ["T","E","S","T","T"],
                ]
            client.get('/')
            res = client.get('/guess/ssssssss')
            self.assertEqual(res.json['result'], 'not-word')
        
    def test_invalid_guess(self):
        """ test if word is not on board"""
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] = [
                    ["t","e","s","t","t"],
                    ["t","e","s","t","t"],
                    ["t","e","s","t","t"],
                    ["t","e","s","t","t"],
                    ["t","e","s","t","t"],
                ]
            res = client.get("/guess/nope")
            self.assertEqual(res.json['result'], 'not-on-board')
    
    def test_game_over_new_high_score(self):
        with app.test_client() as client:
            res = client.post('/endgame', data={"points":100})
            html = res.get_data(as_text=True)
            self.assertEqual(session.get('play-count'), 1)
            # self.assertIn("New High Score", html)
            # self.assertEqual(res.json["new_high_score"], True)

            
        
    


