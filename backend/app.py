from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from utils.extractor import extract_text_from_file
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "resumes"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_resume():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    filename = secure_filename(file.filename)  # keeps underscores, strips bad chars
    if filename == "":
        return jsonify({"error": "Invalid filename"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    
    text = extract_text_from_file(filepath)
    
    return jsonify({
        "filename": file.filename,
        "content_preview": text[:500]  # return first 500 chars
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
