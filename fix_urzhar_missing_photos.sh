#!/usr/bin/env bash

set -u

PROJECT="$HOME/honeylab"
DEST="$PROJECT/static/images/micro"

mkdir -p "$DEST"

find_source() {
    local token="$1"

    find "$HOME/Downloads" "$HOME" /mnt /media \
        -type f \
        \( \
            -iname "*${token}*.jpg" -o \
            -iname "*${token}*.jpeg" -o \
            -iname "*${token}*.png" -o \
            -iname "*${token}*.tif" -o \
            -iname "*${token}*.tiff" \
        \) \
        2>/dev/null \
        | grep -v "$PROJECT/static/" \
        | head -n 1
}

convert_photo() {
    local token="$1"
    local output="$2"

    local source
    source="$(find_source "$token")"

    echo
    echo "Ищем: $token"

    if [ -z "$source" ]; then
        echo "✗ Файл не найден"
        return 1
    fi

    echo "✓ Найден:"
    echo "  $source"

    python3 - "$source" "$DEST/$output" <<'PY'
import sys
from PIL import Image, ImageOps

src = sys.argv[1]
dst = sys.argv[2]

with Image.open(src) as im:
    im = ImageOps.exif_transpose(im)

    if im.mode != "RGB":
        im = im.convert("RGB")

    im.save(
        dst,
        "JPEG",
        quality=96,
        optimize=True
    )

print("✓ Создан браузерный JPG:")
print(" ", dst)
PY
}

convert_photo \
    "16_14_30" \
    "urzhar_16_14_30.jpg"

convert_photo \
    "16_15_27" \
    "urzhar_16_15_27.jpg"

echo
echo "========================================"
echo "ПРОВЕРКА"
echo "========================================"

for f in \
    urzhar_16_14_30.jpg \
    urzhar_16_15_27.jpg
do
    if [ -s "$DEST/$f" ]; then
        echo "✓ $f"
        file "$DEST/$f"
    else
        echo "✗ $f отсутствует"
    fi
done
