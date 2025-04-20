from flask import Flask, render_template, redirect, request, session
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from models import db, Users, Hubs, Matches
from tools import *

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


@app.context_processor
def inject_user():
    return dict(is_logged_in=("user_id" in session))

@app.errorhandler(404)
def page_not_found(e):
    return apology("Page not found", 404)


@app.errorhandler(500)
def page_not_found(e):
    return apology("Internal Server Error", 500)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        # Basic validation
        if not email:
            return apology("Must provide email", 403)
        if not password:
            return apology("Must provide password", 403)

        user = Users.query.filter_by(email=email).first()

        if user and check_password_hash(user.password_hash, password):
            session["user_id"] = user.id
            return redirect("/dashboard")
        else:
            return apology("Invalid credentials", 403)

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == 'POST':
        full_name = request.form.get("full_name")
        email = request.form.get("email")
        phone_number = request.form.get("phone_number")
        school = request.form.get("school")
        grade = request.form.get("grade")
        section = request.form.get("section")
        shift = request.form.get("shift")
        facebook = request.form.get("facebook")
        instagram = request.form.get("instagram")
        discord = request.form.get("discord")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")
        existing_user = Users.query.filter_by(email=email).first()


        # Basic validation
        if not full_name:
            return apology("Must provide Full Name", 403)
        elif not email:
            return apology("Must provide Email", 403)
        elif existing_user:
            return apology("Email already registered", 403)
        elif not phone_number:
            return apology("Must provide Phone Number", 403)
        elif not school:
            return apology("Must provide School", 403)
        elif not grade:
            return apology("Must provide Grade", 403)
        elif not section:
            return apology("Must provide Section", 403)
        elif not shift:
            return apology("Must provide Shift", 403)
        elif not facebook:
            return apology("Must provide Facebook", 403)
        elif not instagram:
            return apology("Must provide Instagram", 403)
        elif not discord:
            return apology("Must provide Discord", 403)
        elif not password:
            return apology("Must provide Password", 403)
        elif not confirm_password:
            return apology("Must provide Confirm Password", 403)
        elif password != confirm_password:
            return apology("Passwords do not match", 403)

        hash_pw = generate_password_hash(password)

        # Save user
        try:
            new_user = Users(
                full_name=full_name,
                email=email,
                phone_number=phone_number,
                school=school,
                grade=grade,
                section=section,
                shift=shift,
                facebook=facebook,
                instagram=instagram,
                discord=discord,
                password_hash=hash_pw
            )

            db.session.add(new_user)
            db.session.commit()

            session["user_id"] = new_user.id
            return redirect("/dashboard")
        
        except Exception as e:
            db.session.rollback()
            return print(f"Registration failed: {str(e)}", 500)

    else:
        return render_template("register.html", grades=GRADES, shifts=SHIFTS)


@app.route("/dashboard")
@login_required
def dashboard():
    user_id = session["user_id"]
    user = Users.query.get(user_id)
    return render_template("dashboard.html", user=user)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")