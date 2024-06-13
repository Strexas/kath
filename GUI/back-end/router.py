from flask import Blueprint
from routes import route_workspace_bp, route_users_bp, route_profiles_bp

def router_bp(prefix):
  router_bp = Blueprint('router', __name__, url_prefix=prefix)

  # Register routes
  ### THESE LINES ARE ONLY FOR EXAMPLE PURPOSES ###
  router_bp.register_blueprint(route_users_bp)
  router_bp.register_blueprint(route_profiles_bp)
  router_bp.register_blueprint(route_workspace_bp)
  #################################################

  return router_bp