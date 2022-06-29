import os
from shlex import split
import subprocess
from flask import Flask, request
from google.cloud import storage
from dotenv import load_dotenv

load_dotenv()

bucket_name = os.environ["ASSET_BUCKET_NAME"]
generate_file_name = "src/generate/generate.py"
conf_file_name = "src/generate/checkpoints/vqgan_imagenet_f16_16384.yaml"
ckpt_file_name = "src/generate/checkpoints/vqgan_imagenet_f16_16384.ckpt"


app = Flask(__name__)

storage_client = storage.Client()

@app.route('/generate-asset', methods = ['POST'])
def runGenerate():
    if request.method == 'POST':
        if (request.mimetype == 'application/json'):
            request_body = request.get_json()

            id = request_body['id']
            width = request_body['width']
            height = request_body['height']
            cycles = request_body['cycles']
            prompt_string = request_body['prompt_string']

            output_file_name = '{0}.jpg'.format(id)
            template_cmd = 'python {0} -o {1} -s {2} {3} -i {4} -p "{5}" -conf {6} -ckpt {7}'
            cmd = template_cmd.format(generate_file_name, output_file_name, width, height, cycles, prompt_string, conf_file_name, ckpt_file_name)

            # Generate image
            res = subprocess.check_output(split(cmd))

            # Upoad image
            bucket = storage_client.get_bucket(bucket_name)
            blob = bucket.blob(output_file_name)
            blob.upload_from_filename(output_file_name)

            # Remove local copy
            os.remove(output_file_name)

            return res
        else:
            return 'Content-Type not supported.'
