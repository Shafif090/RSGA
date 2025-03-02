from flask import Flask, render_template, redirect, request, session
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from models import db, Users, Hubs, Matches

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///rsga.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db.init_app(app)

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
    if request.method == 'POST':
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
        
    else:
        return render_template("register.html", grades=GRADES, shifts=SHIFTS)

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")