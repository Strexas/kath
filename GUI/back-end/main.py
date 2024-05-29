import logging

from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys
from io import StringIO
import openai
from data_collection import *

from router import router_bp


prime_prompt_text = "You are KATH tool. Your purpose is to convert scientists prompts into Python code. You have function for downloading data from databases. When person asks you to download data use \"store_database\" Python function. store_database function download data from GnomAd, Clinvar and LOVD. To download data pass name of database in lowercase. Examples: store_database('clinvar'), store_database('gnomad'), store_database('lovd'). When person asks to download data from database, print just generated function with passed arguments and nothing more. You have \"merge_lovd_with_clinvar\" and \"merge_lovd_with_gnomad\" functions. If persons requests merging of data use this function without parameters. You also have \"convert_to_vcf\" function that will convert data to vcf format. If persons requests converting to vcf use this functionsn without parameters. You also have \"process_with_splcice_ai\" funciton to process data with SpliceAI tool. It returns processed data. When you use this function provide variable to save data. Example, \"processed_data = process_with_splice_ai\". Returned object has \"display\" method. Use it to display data when person asks to display processed data. Now download data from clinvar and lovd. Merge data, convert to vcf format and pass to SpliceAI. Display results."

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
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/api/v1/request', methods=['POST'])
def process():
  request_data = request.get_json()
  print("Got data")
  logging.info(request_data)
  if not request_data:
    return ''

  with open("key") as f:
    openai.api_key = f.readline().strip()

  discussions = [{"role": "system", "content": prime_prompt_text}]
  discussions.append({"role": "user", "content": request_data})

  response = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=discussions,
  )

  answer = response.choices[0].message.content

  api_answer = answer + '\n\n'
  if '```' in api_answer and '```python' in api_answer:
    execute = 'from data_collection import *\n\n' + api_answer[api_answer.find('```python') + 9:api_answer.rfind('```')]
    # old_stdout = sys.stdout
    # redirected_output = sys.stdout = StringIO()
    # exec(execute)
    # sys.stdout = old_stdout
    #
    # api_answer += redirected_output.getvalue()
    api_answer = execute
  return api_answer.replace('\n', '\n\n')


# Run the app
if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=8080)