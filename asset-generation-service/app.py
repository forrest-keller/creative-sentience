import subprocess
from flask import Flask, request

app = Flask(__name__)

@app.route('/run-generate', methods = ['POST'])
def runGenerate():
    if request.method == 'POST':
        if (request.mimetype == 'text/plain'):
            cmd = "python generate.py " + request.data.decode()
            args = cmd.split(" ")
            res = subprocess.check_output(args)

            return res
        else:
            return 'Content-Type must be text/plain.'
