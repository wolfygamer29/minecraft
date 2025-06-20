from flask import Flask, render_template, jsonify
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pages/imgGen')
def imgGen():
    return render_template('/pages/imgGen.html')

@app.route('/pages/textGen')
def textGen():
    return render_template('/pages/textGen.html')

@app.route('/pages/codie')
def codie():
    return render_template('/pages/codie.html')

@app.route('/env')
def get_env():
    return jsonify({
        'hugging_face_key': os.getenv('hugging_face_key'),
        'cloudinaryCloudname': os.getenv('cloudinaryCloudname'),
        'sightengine_api_user': os.getenv('sightengine_api_user'),
        'sightengine_api_secret': os.getenv('sightengine_api_secret'),
        'sightengine_workflow': os.getenv('sightengine_workflow'),
        'sightengine_listID': os.getenv('sightengine_listID'),
        'elevenlabs_api_key': os.getenv('elevenlabs_api_key')
    })


if __name__ == '__main__':
    app.run(debug=True)