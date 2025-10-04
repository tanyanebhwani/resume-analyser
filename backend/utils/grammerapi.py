from flask import Flask, request, jsonify
from flask_cors import CORS
import textstat
import language_tool_python

app = Flask(__name__)
CORS(app)  # Allow requests from Node.js

tool = language_tool_python.LanguageTool('en-US')

@app.route("/check", methods=["POST"])
def check_text():
    grammar_issues = []
    try:
        data = request.get_json(force=True)
        text = data.get("text", "")
        print("Flask received:", data, flush=True)
        # Grammar & style check
        matches = tool.check(text)
        for match in matches:
            grammar_issues.append({
                "message": match.message,
                "suggestions": match.replacements,
                "context": match.context,
            })
    except Exception as e:
        print(e)
    # Readability metrics
    readability = {
        "flesch_reading_ease": textstat.flesch_reading_ease(text),
        "flesch_kincaid_grade": textstat.flesch_kincaid_grade(text),
        "coleman_liau_index": textstat.coleman_liau_index(text),
        "gunning_fog": textstat.gunning_fog(text),
        "automated_readability_index": textstat.automated_readability_index(text),
        "dale_chall_score": textstat.dale_chall_readability_score(text),
        "text_standard": textstat.text_standard(text)
    }

    return jsonify({
        "grammar_issues": grammar_issues,
        "readability": readability
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)
