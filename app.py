from flask import Flask, render_template, jsonify, request
from pathlib import Path
from werkzeug.utils import secure_filename
from datetime import datetime
import json
import re
import uuid
import shutil


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
        match = re.fullmatch(
            r"HL-(\d+)",
            str(sample.get("id", ""))
        )

        if match:
            numbers.append(int(match.group(1)))

    next_number = max(numbers) + 1 if numbers else 1

    return f"HL-{next_number:03d}"


def allowed_file(filename):
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


def clean_text(value):
    return str(value or "").strip()


def parse_optional_float(value):
    value = clean_text(value)

    if not value:
        return None

    try:
        return float(value.replace(",", "."))
    except ValueError:
        return None


def save_uploaded_files(files, sample_id, category):
    saved = []

    folder = UPLOAD_ROOT / sample_id / category
    folder.mkdir(parents=True, exist_ok=True)

    for file in files:

        if not file or not file.filename:
            continue

        if not allowed_file(file.filename):
            continue

        original_name = secure_filename(file.filename)

        if not original_name:
            original_name = f"image_{uuid.uuid4().hex[:8]}.jpg"

        stem = Path(original_name).stem
        suffix = Path(original_name).suffix.lower()

        unique_name = (
            f"{stem}_{uuid.uuid4().hex[:8]}{suffix}"
        )

        destination = folder / unique_name

        file.save(destination)

        saved.append({
            "file": (
                f"/static/uploads/"
                f"{sample_id}/"
                f"{category}/"
                f"{unique_name}"
            ),
            "name": original_name
        })

    return saved


@app.route("/")
def index():
    return render_template("index.html")


@app.route(
    "/api/samples",
    methods=["GET"]
)
def samples():
    return jsonify(load_samples())


@app.route(
    "/api/samples/<sample_id>",
    methods=["GET"]
)
def sample_detail(sample_id):
    samples_data = load_samples()

    for sample in samples_data:
        if sample.get("id") == sample_id:
            return jsonify(sample)

    return jsonify({
        "error": "Образец не найден"
    }), 404


@app.route(
    "/api/samples",
    methods=["POST"]
)
def create_sample():

    samples_data = load_samples()

    sample_id = next_sample_id(samples_data)

    name = clean_text(
        request.form.get("name")
    )

    if not name:
        return jsonify({
            "error": "Укажите название образца"
        }), 400


    sample_photos = save_uploaded_files(
        request.files.getlist("sample_photos"),
        sample_id,
        "sample"
    )

    microphotos_raw = save_uploaded_files(
        request.files.getlist("microphotos"),
        sample_id,
        "micro"
    )

    magnification = clean_text(
        request.form.get("magnification")
    )

    microphotos = []

    for index, photo in enumerate(
        microphotos_raw,
        start=1
    ):
        microphotos.append({
            **photo,
            "label": f"Микрофотография {index}",
            "magnification": magnification,
            "description": ""
        })


    sample = {
        "id": sample_id,

        "name": name,

        "region": clean_text(
            request.form.get("region")
        ),

        "district": clean_text(
            request.form.get("district")
        ),

        "locality": clean_text(
            request.form.get("locality")
        ),

        "date": clean_text(
            request.form.get("date")
        ),

        "source": clean_text(
            request.form.get("source")
        ),

        "latitude": parse_optional_float(
            request.form.get("latitude")
        ),

        "longitude": parse_optional_float(
            request.form.get("longitude")
        ),

        "coordinate_type": clean_text(
            request.form.get("coordinate_type")
        ),

        "description": clean_text(
            request.form.get("description")
        ),

        "sample_photos": sample_photos,

        "microphotos": microphotos,

        "pollen_morphotype": clean_text(
            request.form.get("pollen_morphotype")
        ),

        "presumed_taxon": clean_text(
            request.form.get("presumed_taxon")
        ),

        "confidence": clean_text(
            request.form.get("confidence")
        ),

        "status": (
            clean_text(
                request.form.get("status")
            )
            or
            "Требует дальнейшего исследования"
        ),

        "notes": clean_text(
            request.form.get("notes")
        ),

        "physicochemical": [],

        "created_at": datetime.now().isoformat(
            timespec="seconds"
        ),

        "updated_at": datetime.now().isoformat(
            timespec="seconds"
        )
    }

    samples_data.append(sample)

    save_samples(samples_data)

    return jsonify({
        "success": True,
        "sample": sample,
        "message": f"Паспорт {sample_id} создан"
    }), 201


@app.route(
    "/api/samples/<sample_id>",
    methods=["PUT"]
)
def update_sample(sample_id):

    samples_data = load_samples()

    sample = next(
        (
            item
            for item in samples_data
            if item.get("id") == sample_id
        ),
        None
    )

    if sample is None:
        return jsonify({
            "error": "Образец не найден"
        }), 404


    name = clean_text(
        request.form.get("name")
    )

    if not name:
        return jsonify({
            "error": "Название образца не может быть пустым"
        }), 400


    sample["name"] = name

    sample["region"] = clean_text(
        request.form.get("region")
    )

    sample["district"] = clean_text(
        request.form.get("district")
    )

    sample["locality"] = clean_text(
        request.form.get("locality")
    )

    sample["date"] = clean_text(
        request.form.get("date")
        or sample.get("collection_date")
    )

    sample["collection_date"] = sample["date"]

    sample["source"] = clean_text(
        request.form.get("source")
    )

    sample["latitude"] = parse_optional_float(
        request.form.get("latitude")
    )

    sample["longitude"] = parse_optional_float(
        request.form.get("longitude")
    )

    sample["coordinate_type"] = clean_text(
        request.form.get("coordinate_type")
    )

    sample["description"] = clean_text(
        request.form.get("description")
    )

    sample["pollen_morphotype"] = clean_text(
        request.form.get("pollen_morphotype")
    )

    sample["presumed_taxon"] = clean_text(
        request.form.get("presumed_taxon")
    )

    sample["confidence"] = clean_text(
        request.form.get("confidence")
    )

    sample["status"] = (
        clean_text(
            request.form.get("status")
        )
        or
        "Требует дальнейшего исследования"
    )

    sample["notes"] = clean_text(
        request.form.get("notes")
    )


    new_sample_photos = save_uploaded_files(
        request.files.getlist("sample_photos"),
        sample_id,
        "sample"
    )

    if new_sample_photos:

        current = sample.get(
            "sample_photos",
            []
        )

        if not isinstance(current, list):
            current = []

        sample["sample_photos"] = (
            current + new_sample_photos
        )


    new_micro_raw = save_uploaded_files(
        request.files.getlist("microphotos"),
        sample_id,
        "micro"
    )

    if new_micro_raw:

        current_micro = sample.get(
            "microphotos",
            []
        )

        if not isinstance(current_micro, list):
            current_micro = []

        magnification = clean_text(
            request.form.get("magnification")
        )

        start_number = (
            len(current_micro) + 1
        )

        for number, photo in enumerate(
            new_micro_raw,
            start=start_number
        ):
            current_micro.append({
                **photo,
                "label": (
                    f"Микрофотография {number}"
                ),
                "magnification": magnification,
                "description": ""
            })

        sample["microphotos"] = current_micro


    sample["updated_at"] = (
        datetime.now().isoformat(
            timespec="seconds"
        )
    )

    save_samples(samples_data)

    return jsonify({
        "success": True,
        "sample": sample,
        "message": f"{sample_id} обновлён"
    })


@app.route(
    "/api/samples/<sample_id>",
    methods=["DELETE"]
)
def delete_sample(sample_id):

    samples_data = load_samples()

    index = next(
        (
            i
            for i, item in enumerate(samples_data)
            if item.get("id") == sample_id
        ),
        None
    )

    if index is None:
        return jsonify({
            "error": "Образец не найден"
        }), 404


    removed = samples_data.pop(index)

    save_samples(samples_data)


    upload_folder = (
        UPLOAD_ROOT / sample_id
    )

    if upload_folder.exists():
        shutil.rmtree(
            upload_folder,
            ignore_errors=True
        )


    return jsonify({
        "success": True,
        "sample_id": sample_id,
        "name": removed.get("name", ""),
        "message": f"{sample_id} удалён"
    })


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
