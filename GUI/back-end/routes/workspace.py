from flask import Blueprint, jsonify, request, make_response
import os
from data_collection.constants import PATH_TO_WORKSPACE

route_workspace_bp = Blueprint('workspace', __name__)

@route_workspace_bp.route('/workspace', methods=['POST'])
def create_workspace():
  workspace = request.get_json()

  path = f"{PATH_TO_WORKSPACE}/{workspace}"

  if os.path.exists(path) and os.path.isdir(workspace):
    return make_response(jsonify({'message': 'Workspace already exists!'}), 200)
  
  try:
    os.mkdir(path)
    return make_response(jsonify({'message': 'Workspace created!'}), 200)
  except Exception as e:
    return make_response(jsonify({'message': str(e)}), 400)
  
@route_workspace_bp.route('/workspace', methods=['GET'])
def get_workspaces():
  workspaces = os.listdir(PATH_TO_WORKSPACE)
  return make_response(jsonify({'workspaces': workspaces}), 200)

@route_workspace_bp.route('/workspace/<workspace>', methods=['GET'])
def get_workspace(workspace):
  path = f"{PATH_TO_WORKSPACE}/{workspace}"
  if os.path.exists(path) and os.path.isdir(path):
    all_files = os.listdir(path)
    return make_response(jsonify({'files': all_files}), 200)
  else:
    return make_response(jsonify({'message': 'Workspace not found!'}), 404)
  
@route_workspace_bp.route('/workspace/<workspace>', methods=['DELETE'])
def delete_workspace(workspace):
  path = f"{PATH_TO_WORKSPACE}/{workspace}"
  if os.path.exists(path) and os.path.isdir(path):
    delete_all_files_in_directory(path)
    return make_response(jsonify({'message': 'Workspace deleted!'}), 200)
  else:
    return make_response(jsonify({'message': 'Workspace not found!'}), 404)
  
def delete_all_files_in_directory(path):
  for file_name in os.listdir(path):
    file_path = os.path.join(path, file_name)
    if os.path.isfile(file_path):
      os.remove(file_path)
  os.rmdir(path)