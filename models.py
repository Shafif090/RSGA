from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    school = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.Integer, nullable=False)
    section = db.Column(db.String(20), nullable=False)
    shift = db.Column(db.String(10), nullable=False)
    facebook = db.Column(db.String(100))
    instagram = db.Column(db.String(100))
    discord = db.Column(db.String(30))
    password_hash = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='Not verified', nullable=False)
    hub_id = db.Column(db.Integer, db.ForeignKey('hubs.id'))
    created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Hubs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    users = db.relationship('Users', backref='hubs')

class Matches(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    hub_id = db.Column(db.Integer, db.ForeignKey('hubs.id'), nullable=False)
