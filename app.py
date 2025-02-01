from flask import Flask, render_template, redirect, request, session
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import sqlite3

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///rsga.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQLAlchemy(app)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    school = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.Integer, nullable=False)
    section = db.Column(db.String(10), nullable=False)
    shift = db.Column(db.String(7), nullable=False)
    facebook = db.Column(db.String(200), nullable=True)
    instagram = db.Column(db.String(200), nullable=True)
    discord = db.Column(db.String(200), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(5), nullable=False)

GRADES = [
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
]
SHIFTS = [
    "Morning",
    "Day",
]

session = False # Just for Testing

@app.route("/")
def home():
    return render_template("index.html", session=session)

@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    full_name = request.form.get("full_name")
    email = request.form.get("email")
    school = request.form.get("school")
    grade = request.form.get("grade")
    section = request.form.get("section")
    shift = request.form.get("shift")
    facebook = request.form.get("facebook")
    instagram = request.form.get("instagram")
    discord = request.form.get("discord")
    password = request.form.get("password")
    confirm_password = request.form.get("confirm_password")
    
    return render_template("register.html", grades=GRADES, shifts=SHIFTS)

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")