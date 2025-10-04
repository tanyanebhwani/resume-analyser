from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from utils.extractor import extract_text_from_file
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# UPLOAD_FOLDER = "resumes"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

LANGUAGETOOL_API = "https://api.languagetool.org/v2/check"

@app.route("/check-grammar", methods=["POST"])
def check_grammar():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Call LanguageTool public API
    payload = {
        "text": text,
        "language": "en-US"
    }
    response = request.post(LANGUAGETOOL_API, data=payload)

    if response.status_code != 200:
        return jsonify({"error": "Grammar API request failed"}), 500

    result = response.json()
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5001, debug=True)