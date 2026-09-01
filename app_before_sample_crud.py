from flask import Flask, render_template, jsonify, request
from pathlib import Path
from werkzeug.utils import secure_filename
from datetime import datetime
import json
import re
import uuid


app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "samples.json"
UPLOAD_ROOT = BASE_DIR / "static" / "uploads"

UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".tif",
    ".tiff"
}


def load_samples():
    if not DATA_FILE.exists():
        return []

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_samples(samples):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(DATA_FILE, "w", encoding="utf-8") as file:
        json.dump(
            samples,
            file,
            ensure_ascii=False,
            indent=2
        )


def next_sample_id(samples):
    numbers = []

    for sample in samples:
        sample_id = str(sample.get("id", ""))

        match = re.fullmatch(
            r"HL-(\d+)",
            sample_id
        )

        if match:
            numbers.append(
                int(match.group(1))
            )

    next_number = (
        max(numbers) + 1
        if numbers
        else 1
    )

    return f"HL-{next_number:03d}"


def allowed_file(filename):
    suffix = Path(filename).suffix.lower()
    return suffix in ALLOWED_EXTENSIONS


def save_uploaded_files(
    files,
    sample_id,
    category
):
    saved = []

    folder = (
        UPLOAD_ROOT
        / sample_id
        / category
    )

    folder.mkdir(
        parents=True,
        exist_ok=True
    )

    for file in files:

        if not file:
            continue

        if not file.filename:
            continue

        if not allowed_file(
            file.filename
        ):
            continue

        original_name = (
            secure_filename(
                file.filename
            )
        )

        if not original_name:
            original_name = (
                f"image_{uuid.uuid4().hex[:8]}.jpg"
            )

        stem = Path(
            original_name
        ).stem

        suffix = Path(
            original_name
        ).suffix.lower()

        unique_name = (
            f"{stem}_"
            f"{uuid.uuid4().hex[:8]}"
            f"{suffix}"
        )

        destination = (
            folder
            / unique_name
        )

        file.save(destination)

        relative_url = (
            f"/static/uploads/"
            f"{sample_id}/"
            f"{category}/"
            f"{unique_name}"
        )

        saved.append({
            "file": relative_url,
            "name": original_name
        })

    return saved


def parse_optional_float(value):
    if value is None:
        return None

    value = str(value).strip()

    if not value:
        return None

    try:
        return float(
            value.replace(",", ".")
        )
    except ValueError:
        return None


def clean_text(value):
    if value is None:
        return ""

    return str(value).strip()


@app.route("/")
def index():
    return render_template(
        "index.html"
    )


@app.route(
    "/api/samples",
    methods=["GET"]
)
def samples():
    return jsonify(
        load_samples()
    )


@app.route(
    "/api/samples/<sample_id>",
    methods=["GET"]
)
def sample_detail(sample_id):
    samples_data = load_samples()

    for sample in samples_data:

        if (
            sample.get("id")
            == sample_id
        ):
            return jsonify(sample)

    return jsonify({
        "error":
            "Образец не найден"
    }), 404


@app.route(
    "/api/samples",
    methods=["POST"]
)
def create_sample():

    samples_data = load_samples()

    sample_id = next_sample_id(
        samples_data
    )

    name = clean_text(
        request.form.get("name")
    )

    if not name:
        return jsonify({
            "error":
                "Укажите название образца"
        }), 400


    sample_photos = (
        save_uploaded_files(
            request.files.getlist(
                "sample_photos"
            ),
            sample_id,
            "sample"
        )
    )


    microphotos_raw = (
        save_uploaded_files(
            request.files.getlist(
                "microphotos"
            ),
            sample_id,
            "micro"
        )
    )


    magnification = clean_text(
        request.form.get(
            "magnification"
        )
    )

    microphotos = []

    for index, photo in enumerate(
        microphotos_raw,
        start=1
    ):
        microphotos.append({
            **photo,
            "label":
                f"Микрофотография {index}",
            "magnification":
                magnification,
            "description": ""
        })


    latitude = parse_optional_float(
        request.form.get("latitude")
    )

    longitude = parse_optional_float(
        request.form.get("longitude")
    )


    presumed_taxon = clean_text(
        request.form.get(
            "presumed_taxon"
        )
    )

    pollen_morphotype = clean_text(
        request.form.get(
            "pollen_morphotype"
        )
    )

    confidence = clean_text(
        request.form.get(
            "confidence"
        )
    )

    status = clean_text(
        request.form.get("status")
    )

    if not status:
        status = (
            "Требует дальнейшего исследования"
        )


    sample = {

        "id":
            sample_id,

        "name":
            name,

        "region":
            clean_text(
                request.form.get(
                    "region"
                )
            ),

        "district":
            clean_text(
                request.form.get(
                    "district"
                )
            ),

        "locality":
            clean_text(
                request.form.get(
                    "locality"
                )
            ),

        "date":
            clean_text(
                request.form.get(
                    "date"
                )
            ),

        "source":
            clean_text(
                request.form.get(
                    "source"
                )
            ),

        "latitude":
            latitude,

        "longitude":
            longitude,

        "coordinate_type":
            clean_text(
                request.form.get(
                    "coordinate_type"
                )
            ),

        "description":
            clean_text(
                request.form.get(
                    "description"
                )
            ),

        "sample_photos":
            sample_photos,

        "microphotos":
            microphotos,

        "pollen_morphotype":
            pollen_morphotype,

        "presumed_taxon":
            presumed_taxon,

        "confidence":
            confidence,

        "status":
            status,

        "notes":
            clean_text(
                request.form.get(
                    "notes"
                )
            ),

        "physicochemical":
            [],

        "created_at":
            datetime.now().isoformat(
                timespec="seconds"
            )
    }


    samples_data.append(sample)

    save_samples(
        samples_data
    )


    return jsonify({
        "success": True,
        "sample": sample,
        "message":
            f"Паспорт {sample_id} создан"
    }), 201


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
