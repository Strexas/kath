### THIS FILE IS ONLY FOR EXAMPLE PURPOSES ###
from flask import Blueprint, jsonify

route_profiles_bp = Blueprint('profiles', __name__)

@route_profiles_bp.route('/profiles', methods=['GET'])
def get_profiles():
  return jsonify(
    {
      'profiles': [
        'Dom',
        'Helo',
        'Syn'
      ]
    }
  )