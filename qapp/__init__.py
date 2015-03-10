from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from .models import (
    DBSession,
    Base,
    )

def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '1728000',
        })
    event.request.add_response_callback(cors_headers)

from pyramid.events import NewRequest

# from pyramid.request import Request
# from pyramid.request import Response

# def request_factory(environ):
#     request = Request(environ)
#     request.response = Response()
#     request.response.headerlist = []
#     request.response.headerlist.extend(
#         (
#             ('Charset', 'utf8'),
#             ('Access-Control-Allow-Origin', '*'),
#             ('Content-Type', 'application/json')
#         )
#     )
#     return request



def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    config = Configurator(settings=settings)
    config.add_subscriber(add_cors_headers_response_callback, NewRequest)
    # config.set_request_factory(request_factory) # Enable CROS
    config.include('pyramid_chameleon')
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/home')
    config.add_route('submita', '/api/submita')
    config.add_route('submitu', '/api/submitu')
    config.add_route('getq', '/api/getq')
    config.add_route('setq', '/api/setq')
    config.add_route('app', '/')
    config.scan()
    return config.make_wsgi_app()
