### THIS FILE IS ONLY FOR EXAMPLE PURPOSES ###
from flask import Blueprint, jsonify

route_users_bp = Blueprint('users', __name__)

@route_users_bp.route('/users', methods=['GET'])
def get_users():
  return jsonify(
    {
      'users': [
        'Mantvydas',
        'Tomas',
        'Lukas'
      ]
    }
  )
