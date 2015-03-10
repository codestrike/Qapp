from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from .models import *


@view_config(route_name='home', renderer='templates/mytemplate.pt')
def my_view(request):
    try:
        one = DBSession.query(MyModel).filter(MyModel.name == 'one').first()
    except DBAPIError:
        return Response(conn_err_msg, content_type='text/plain', status_int=500)
    return {'one': one, 'project': 'qapp'}


conn_err_msg = """\
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to run the "initialize_qapp_db" script
    to initialize your database tables.  Check your virtual
    environment's "bin" directory for this script and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.

After you fix the problem, please restart the Pyramid application to
try it again.
"""

@view_config(route_name='app', renderer='templates/app.pt')
def show_qapp(request):
    return {'title':'Admin Panel of CodeStrike #221B'}

@view_config(route_name='getq', renderer='json')
def getq(request):
    return [q.to_dict() for q in DBSession.query(Question).all()]

@view_config(route_name='setq', renderer='json')
def setq(request):
    data = dict(request.json_body)
    if DBSession.add(Question(question=data['question'], answer=data['answer'],
      question_type=data['question_type'], options=json.dumps(data['options']))):
        return {'status':'success'}
    return {'status':'Failed to add question'}

@view_config(route_name='submita', renderer='json')
def submita(renderer):
    data = dict(request.json_body)
    DBSession.add(Answer(user=data["id"], answers=str(data["answers"]), 
        start_time=data["start_time"], end_time=data["end_time"]))
    return {'status':'success'}

@view_config(route_name='submitu', renderer='json')
def submitu(renderer):
    data = dict(request.json_body)
    DBSession.add(User(name=data["name"], branch=data["branch"], year=data["year"],
      roll=data["roll"], is_diploma=data["is_diploma"], about=data["about"],
      number=data["number"], email=data["email"]))
    return {'status':'success', 'userid': DBSession.query(User).filter(User.number==data.number).first()['id']}
