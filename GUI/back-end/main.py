from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

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

# Run the app
if __name__ == '__main__':
  app.run(debug=True, port=8080)