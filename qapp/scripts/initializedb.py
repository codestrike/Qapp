import os
import time
import json
import sys
import transaction

from sqlalchemy import engine_from_config

from pyramid.paster import (
  get_appsettings,
  setup_logging,
  )

from pyramid.scripts.common import parse_vars

from ..models import (
  DBSession,
  MyModel,
  Base,
  User,
  Question,
  Answer,
  )


def usage(argv):
  cmd = os.path.basename(argv[0])
  print('usage: %s <config_uri> [var=value]\n'
      '(example: "%s development.ini")' % (cmd, cmd))
  sys.exit(1)


def main(argv=sys.argv):
  if len(argv) < 2:
    usage(argv)
  config_uri = argv[1]
  options = parse_vars(argv[2:])
  setup_logging(config_uri)
  settings = get_appsettings(config_uri, options=options)
  engine = engine_from_config(settings, 'sqlalchemy.')
  DBSession.configure(bind=engine)
  Base.metadata.create_all(engine)
  st = time.time()
  with transaction.manager:
    # MyModel
    model = MyModel(name='one', value=1)
    DBSession.add(model)
    # User
    user = User(name='Chutzpah', branch='CMPN', year=3,
      roll=90, is_diploma=0, about='I created this app!',
      number='9898989898', email='ash.gkwd@gmail.com')
    DBSession.add(user)
    # Querstion
    ops = {'a':'Delhi', 'b':'Nagpur', 'c':'Mumbai', 'd':'Pune'}
    q = Question(question='What is capital of MH ?', answer='c',
      question_type='mcq', options=json.dumps(ops))
    DBSession.add(q)
    # Answer
    ans = [{'q':12, 'a':'Kokan'}, {'q':1, 'a':'c'}]
    answer = Answer(user=1, answers=json.dumps(ans),
      start_time=st, end_time=time.time())
    DBSession.add(answer)
