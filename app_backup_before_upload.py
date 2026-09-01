from flask import Flask, render_template, jsonify
import json
from pathlib import Path

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "samples.json"

SAMPLE_PHOTO_DIRS = {
    "HL-001": "urzhar",
    "HL-002": "akacia",
    "HL-003": "belok",
    "HL-004": "altay",
}


def load_samples():
    if not DATA_FILE.exists():
        return []

    with open(
        DATA_FILE,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def get_sample_photos(sample_id):

    folder_name = SAMPLE_PHOTO_DIRS.get(
        sample_id
    )

    if not folder_name:
        return []

    folder = (
        BASE_DIR
        / "static"
        / "images"
        / "samples"
        / folder_name
    )

    if not folder.exists():
        return []

    allowed = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }

    photos = []

    for path in sorted(folder.iterdir()):

        if (
            not path.is_file()
            or path.suffix.lower()
            not in allowed
        ):
            continue

        photos.append({
            "file": (
                f"/static/images/samples/"
                f"{folder_name}/"
                f"{path.name}"
            ),
            "name": path.name,
        })

    return photos


@app.route("/")
def index():
    return render_template(
        "index.html"
    )


@app.route("/api/samples")
def samples():

    result = load_samples()

    for sample in result:
        sample["sample_photos"] = (
            get_sample_photos(
                sample["id"]
            )
        )

    return jsonify(result)


@app.route("/api/samples/<sample_id>")
def sample_detail(sample_id):

    samples_data = load_samples()

    for sample in samples_data:

        if sample["id"] == sample_id:

            sample["sample_photos"] = (
                get_sample_photos(
                    sample_id
                )
            )

            return jsonify(sample)

    return jsonify({
        "error":
            "Образец не найден"
    }), 404


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
