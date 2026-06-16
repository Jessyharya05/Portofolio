import json
import os
from datetime import datetime
from flask import Flask, render_template, jsonify, request, abort

app = Flask(__name__)

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "data.json")


# ─── Helpers ────────────────────────────────────────────────────────────────

def load_data():
    """Load portfolio data from JSON file."""
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_data(data):
    """Persist portfolio data back to JSON file."""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# ─── Page Routes ────────────────────────────────────────────────────────────

@app.route("/")
def index():
    data = load_data()
    return render_template("index.html", profile=data["profile"])


# ─── API Routes ─────────────────────────────────────────────────────────────

@app.route("/api/data")
def api_data():
    """Return the full portfolio dataset as JSON."""
    return jsonify(load_data())


@app.route("/api/projects")
def api_projects():
    """Return projects, optionally filtered by category."""
    data = load_data()
    category = request.args.get("category", "").strip()
    projects = data["projects"]
    if category and category.lower() != "all":
        projects = [p for p in projects if p["category"].lower() == category.lower()]
    return jsonify(projects)


@app.route("/api/skills")
def api_skills():
    data = load_data()
    return jsonify(data["skills"])


@app.route("/api/stats")
def api_stats():
    data = load_data()
    return jsonify(data["stats"])


@app.route("/api/timeline")
def api_timeline():
    data = load_data()
    return jsonify(data["timeline"])


@app.route("/api/contact", methods=["POST"])
def api_contact():
    """Save a contact message to the JSON store."""
    payload = request.get_json(silent=True)
    if not payload:
        abort(400)

    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip()
    message = payload.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"success": False, "error": "All fields are required."}), 422

    data = load_data()
    data["messages"].append(
        {
            "id": len(data["messages"]) + 1,
            "name": name,
            "email": email,
            "message": message,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
    )
    save_data(data)
    return jsonify({"success": True, "message": f"Thanks {name}! Message received. 🎉"})


# ─── Entry Point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n>>> Portfolio server running at  http://127.0.0.1:5000\n")
    app.run(debug=True, host="127.0.0.1", port=5000)
