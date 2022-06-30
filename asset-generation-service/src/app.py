import os
from shlex import split
import subprocess
from flask import Flask, request
from google.cloud import storage
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

storage_client = storage.Client()


@app.route('/generate-asset', methods=['POST'])
def runGenerate():
    if request.method == 'POST':
        if (request.mimetype == 'application/json'):
            request_body = request.get_json()
            output_file_name = '{0}.jpg'.format(request_body["id"])
            template_cmd = 'python {0} -o {1} -s {2} {3} -i {4} -p "{5}" -conf {6} -ckpt {7}'
            cmd = template_cmd.format(
                os.environ["GENERATE_FILE_PATH"],
                output_file_name,
                request_body['width'],
                request_body['height'],
                request_body['cycles'],
                request_body['prompt_string'],
                os.environ["CONF_FILE_PATH"],
                os.environ["CKPT_FILE_PATH"]
            )

            res = subprocess.check_output(split(cmd))

            bucket = storage_client.get_bucket(os.environ["ASSET_BUCKET_NAME"])
            blob = bucket.blob(output_file_name)
            blob.upload_from_filename(output_file_name)

            os.remove(output_file_name)

            return res
        else:
            return 'Content-Type not supported.'
