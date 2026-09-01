#!/usr/bin/env bash

set -u

PROJECT="$HOME/honeylab"
DOWNLOADS="$HOME/Downloads"

SAMPLES="$PROJECT/static/images/samples"
MICRO="$PROJECT/static/images/micro"

mkdir -p "$SAMPLES" "$MICRO"

echo
echo "===================================================="
echo " HoneyLab — полный импорт фотографий"
echo "===================================================="
echo


find_file() {
    local pattern="$1"

    find "$DOWNLOADS" "$HOME" \
        -type f \
        -iname "$pattern" \
        2>/dev/null \
        | grep -v "$PROJECT/static/" \
        | head -n 1
}


copy_sample() {

    local pattern="$1"
    local dest="$2"
    local title="$3"

    src="$(find_file "$pattern")"

    if [ -n "$src" ]; then

        cp "$src" "$SAMPLES/$dest"

        echo "✓ $title"
        echo "  $src"
        echo "  -> $SAMPLES/$dest"
        echo

    else

        echo "✗ НЕ НАЙДЕНО: $title"
        echo "  шаблон: $pattern"
        echo

    fi
}


copy_micro() {

    local pattern="$1"
    local dest="$2"
    local title="$3"

    src="$(find_file "$pattern")"

    if [ -z "$src" ]; then

        echo "✗ НЕ НАЙДЕНО: $title"
        echo "  шаблон: $pattern"
        echo
        return

    fi


    extension="${src##*.}"
    extension="$(echo "$extension" | tr '[:upper:]' '[:lower:]')"


    if [ "$extension" = "jpg" ] || \
       [ "$extension" = "jpeg" ]; then

        cp "$src" "$MICRO/$dest"

    else

        python3 - "$src" "$MICRO/$dest" <<'PY'
import sys
from PIL import Image

source = sys.argv[1]
destination = sys.argv[2]

image = Image.open(source)

if image.mode != "RGB":
    image = image.convert("RGB")

image.save(
    destination,
    "JPEG",
    quality=95
)
PY

    fi


    echo "✓ $title"
    echo "  $src"
    echo "  -> $MICRO/$dest"
    echo
}


echo "================ ФОТО БАНОК ================="
echo

copy_sample \
    "Urzhar.jpeg" \
    "urzhar_honey.jpeg" \
    "Уржарский мёд"

copy_sample \
    "Akacia.jpeg" \
    "akacia_honey.jpeg" \
    "Акациевый мёд"

copy_sample \
    "Belok.jpeg" \
    "belok_honey.jpeg" \
    "Белокурихинский мёд"

copy_sample \
    "Altay.jpeg" \
    "altay_honey.jpeg" \
    "Алтайский мёд"


echo
echo "============= УРЖАР — МИКРОФОТО ============="
echo

copy_micro \
    "*16_04_06*" \
    "urzhar_16_04_06.jpg" \
    "Уржар 16_04_06"

copy_micro \
    "*16_32_19*" \
    "urzhar_16_32_19.jpg" \
    "Уржар 16_32_19"

copy_micro \
    "*16_14_30*" \
    "urzhar_16_14_30.jpg" \
    "Уржар 16_14_30"

copy_micro \
    "*16_15_27*" \
    "urzhar_16_15_27.jpg" \
    "Уржар 16_15_27"


echo
echo "============ АКАЦИЯ — МИКРОФОТО ============="
echo

copy_micro \
    "*14_49_16*" \
    "acacia_14_49_16.jpg" \
    "Акация 14_49_16"

copy_micro \
    "*15_26_36*" \
    "acacia_15_26_36.jpg" \
    "Акация 15_26_36"


echo
echo "========== БЕЛОКУРИХА — МИКРОФОТО ==========="
echo

copy_micro \
    "*14_41_42*" \
    "belokurikha_14_41_42.jpg" \
    "Белокуриха 14_41_42"


echo
echo "===================================================="
echo " ПРОВЕРКА ФОТО БАНОК"
echo "===================================================="

for f in \
    urzhar_honey.jpeg \
    akacia_honey.jpeg \
    belok_honey.jpeg \
    altay_honey.jpeg
do

    if [ -s "$SAMPLES/$f" ]; then
        echo "✓ $f"
    else
        echo "✗ $f"
    fi

done


echo
echo "===================================================="
echo " ПРОВЕРКА МИКРОФОТО"
echo "===================================================="

for f in \
    urzhar_16_04_06.jpg \
    urzhar_16_32_19.jpg \
    urzhar_16_14_30.jpg \
    urzhar_16_15_27.jpg \
    acacia_14_49_16.jpg \
    acacia_15_26_36.jpg \
    belokurikha_14_41_42.jpg
do

    if [ -s "$MICRO/$f" ]; then
        echo "✓ $f"
    else
        echo "✗ $f"
    fi

done


echo
echo "===================================================="
echo " HoneyLab: импорт завершён"
echo "===================================================="
