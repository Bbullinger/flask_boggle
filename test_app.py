from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    # TODO -- write tests for every view function / feature!
    def setUp(self):
        self.client = app.test_client()
        app.config["TESTING"] = True
        app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]


def test_base(self):
    with self.client:
        self.client.get("/")
        self.assertIn("board", session)
        self.assertEqual(session["user_words"], [])


def test_game(self):
    with self.client:

        response = self.client.get("/game")
        self.assertIn("Time Left:", response.data)
