from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import openai
from pygments.lexers import q

from router import router_bp

# Determine the environment
environment = os.getenv('ENVIRONMENT', 'development')
if environment == 'production':
  dotenv_path = '.env.production'
else:
  dotenv_path = '.env.development'

# Load environment variables
load_dotenv(dotenv_path)

# Set environment variables
origins = os.getenv('ORIGINS')

# Create a Flask app
app = Flask(__name__)

# Routing
app.register_blueprint(router_bp('/api/v1'))

# Configurations
cors = CORS(app, origins=origins)

@app.route('/api/v1/request', methods=['POST'])
def process():
  request_data = request.get_json()
  if not request_data:
    return ''

  openai.api_key = "sk-proj-FCpUZQtdF7z9gBjMfbgVT3BlbkFJUSgsIUYLbmGrfcZ3SJ4k"


  response = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": request_data}],
  )

  return response.choices[0].message.content

# Run the app
if __name__ == '__main__':
  app.run(debug=True, port=8080)