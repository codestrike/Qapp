import time
import json

from sqlalchemy import (
  Column,
  Index,
  Integer,
  Text,
  DateTime,
  )

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
  scoped_session,
  sessionmaker,
  )

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class MyModel(Base):
  __tablename__ = 'models'
  id = Column(Integer, primary_key=True)
  name = Column(Text)
  value = Column(Integer)

Index('my_index', MyModel.name, unique=True, mysql_length=255)

class Question(Base):
  """Storea all questions and their options with correct answer"""
  __tablename__ = 'questions'
  id = Column(Integer, primary_key=True)
  question = Column(Text)
  question_type = Column(Text)
  options = Column(Text) # JSON object i.e. python dict
  answer = Column(Text) # One of the key from options JSON String

  def to_dict(self, with_answers=False):
    toDict = {
      'id': self.id,
      'question': self.question,
      'question_type': self.question_type,
      'options': json.loads(self.options)
    }
    if with_answers:
      toDict['answer'] = self.answer
    return toDict

class User(Base):
  """Stores record of all participants of test"""
  __tablename__ = 'users'
  id = Column(Integer, primary_key=True)
  name = Column(Text)
  branch = Column(Text)
  year = Column(Integer)
  roll = Column(Integer)
  is_diploma = Column(Integer)
  about = Column(Text)
  number = Column(Text)
  email = Column(Text)

  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'branch': self.branch,
      'year': self.year,
      'roll': self.roll,
      'is_diploma': self.is_diploma,
      'about': self.about,
      'number': self.number,
      'email': self.email
    }

class Answer(Base):
  """Responce of all participants"""
  __tablename__ = 'answers'
  id = Column(Integer, primary_key=True)
  user = Column(Integer)
  answers = Column(Text) # JSON array [of objects {q:Questions.id, a:Questions.options}, ...]
  start_time = Column(Text, default=time.time)
  end_time = Column(Text, default=time.time)

  def to_dict(self):
    return {
      'user': self.user,
      'answers': json.loads(self.answers),
      'start_time': self.start_time,
      'end_time': self.end_time,
      'duration': int(self.end_time) - int(self.start_time)
    }