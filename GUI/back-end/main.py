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



prime_prompt_text = 'You are Artificial Intelligence tool, don\'t give more than one code example in any case. Your purpose is to convert scientists prompts into Python code. You have function for downloading data from databases. When person asks you to download data use "store_database_for_eys_gene" Python function. store_database function download data from GnomAd, Clinvar and LOVD. To download data pass name of database in lowercase. Examples: store_database_for_eys_gene(\'clinvar\'), store_database_for_eys_gene(\'gnomad\'), store_database_for_eys_gene(\'lovd\'). You also have "parse_lovd" function that will parse data from text file with downloaded data. If persons requests parsing data from lovd use this functions like this `parsed_data = parse_lovd()` where `parsed_data` is retrieved data. After you retrieve data from parse function you can print it, if user ask to print parsed data provide `print(parsed_data)` where `parsed_data` is data you got from `parse_lovd` funciton. When person asks to download data from database, print just generated function with passed arguments and nothing more. You also have "set_lovd_dtypes" function that will set data types to parsed lovd data. Always use this function after you parsed data, use it like this `set_lovd_dtypes(parsed_data)` where `parsed_data` is parsed lovd data. You also have "save_lovd_to_vcf" function that will convert data to vcf format. If persons requests converting to vcf use this functions like this `save_lovd_as_vcf(data)` where `data` is parsed lovd data. Now'

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

  discussions = [{"role": "system", "content": "I guessed number 5"}]
  discussions.append({"role": "user", "content": request_data})

  response = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=discussions,
  )

  answer = response.choices[0].message.content

  api_answer = answer + '\n\n'
  if '```' in api_answer and '```python' in api_answer:
    execute = api_answer[api_answer.find('```python') + 9:api_answer.rfind('```')]
    old_stdout = sys.stdout
    redirected_output = sys.stdout = StringIO()
    exec(execute)
    sys.stdout = old_stdout

    api_answer += redirected_output.getvalue()
  return api_answer.replace('\n', '\n\n')


# Run the app
if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=8080)