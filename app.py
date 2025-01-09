from flask import Flask, render_template, redirect, request, session
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

conn = sqlite3.connect("rsga.db", check_same_thread=False)
db = conn.cursor()

session = False # Just for Testing

@app.route("/")
def home():
    return render_template("index.html", session=session)

@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    return render_template("register.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")