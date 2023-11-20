from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from sqlalchemy.orm import DeclarativeBase
from uuid import uuid4
from sqlalchemy import delete, select
app = Flask(__name__)


class Base(DeclarativeBase):
  pass
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
CORS(app, support_credentials=True)

db = SQLAlchemy(app)

class TimeSlot(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    coach = db.Column(db.String(20), unique=False, nullable=False)
    start = db.Column(db.String(20), unique=False, nullable=False)
    end = db.Column(db.String(20), nullable=False)
    student = db.Column(db.String(20))
    score = db.Column(db.Integer)
    notes = db.Column(db.String(500))
    def __repr__(self) -> str:
         return f"TimeSlot(id={self.id!r}, coach={self.coach!r}, start={self.start!r}, end={self.end!r}, student={self.student!r})"
    def as_dict(self) -> dict:
        dict_to_return = {}
        dict_to_return["id"] = self.id
        dict_to_return["coach"] = self.coach
        dict_to_return["start"] = self.start
        dict_to_return["end"] = self.end
        dict_to_return["student"] = self.student
        dict_to_return["score"] = self.score
        dict_to_return["notes"] = self.notes
        return dict_to_return



@app.route('/timeslots')
@cross_origin(origin='*')
def get_all_slots():
    timeslots = TimeSlot.query.all()
    slots_as_jsons = []
    for timeslot in timeslots:
        slots_as_jsons.append(timeslot.as_dict())
    return slots_as_jsons

@app.route('/timeslots/<id>')
@cross_origin(origin='*')
def get_slots_by_id(id):
    statement = select(TimeSlot).filter_by(coach=id)
    timeslots = db.session.execute(statement).all()
    slots_as_jsons = []
    for timeslot in timeslots:
        slots_as_jsons.append(timeslot[0].as_dict())
    return jsonify(slots_as_jsons)


@app.route('/timeslots', methods=['POST'])
@cross_origin(origin='*')
def add_time_slot():
    slot = TimeSlot()
    request_json = request.get_json()
    slot.id = str(uuid4())
    slot.coach = str(request_json["coach"])
    slot.start = str(request_json["start"])
    slot.end = str(request_json["end"])
    slot.student = ""
    slot.score = None
    slot.notes = ""
    db.session.add(slot)
    db.session.commit()
    return '', 204

@app.route('/timeslots', methods=['DELETE'])
@cross_origin(origin='*')
def remove_time_slot():
    request_json = request.get_json()
    statement = select(TimeSlot).filter_by(id=request_json["id"])
    obj = db.session.execute(statement).one()[0]
    db.session.delete(obj)
    db.session.commit()
    return '', 200

@app.route('/timeslots/<int:student_id>', methods=['PATCH'])
@cross_origin(origin='*')
def book_slot(student_id):
    request_json = request.get_json()
    print(student_id)
    statement = select(TimeSlot).filter_by(id=request_json["id"])
    obj = db.session.execute(statement).one()[0]
    if obj.student == "":
        obj.student = student_id
    db.session.commit()
    return '', 200


@app.route('/timeslots', methods=['PATCH'])
@cross_origin(origin='*')
def set_slots():
    request_json = request.get_json()
    print(request_json)
    statement = select(TimeSlot).filter_by(id=request_json["id"])
    obj = db.session.execute(statement).one()[0]
    obj.score = request_json["score"]
    obj.notes = request_json["notes"]
    db.session.commit()
    return '', 200

with app.app_context():
    db.create_all()
app.run()
