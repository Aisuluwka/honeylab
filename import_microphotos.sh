#!/usr/bin/env bash

set -u

DEST="$HOME/honeylab/static/images"

mkdir -p "$DEST"

echo
echo "=================================================="
echo " HoneyLab — импорт микрофотографий"
echo "=================================================="
echo

find_photo() {
    local pattern="$1"

    find "$HOME" /mnt /media \
        -type f \
        -iname "$pattern" \
        2>/dev/null \
        | grep -v "$HOME/honeylab/static/images/" \
        | head -n 1
}

copy_photo() {
    local pattern="$1"
    local new_name="$2"
    local label="$3"

    local source
    source="$(find_photo "$pattern")"

    if [ -n "$source" ]; then
        cp "$source" "$DEST/$new_name"

        echo "✓ $label"
        echo "  SOURCE: $source"
        echo "  DEST:   $DEST/$new_name"
        echo
    else
        echo "✗ НЕ НАЙДЕН: $label"
        echo "  Ищем шаблон: $pattern"
        echo
    fi
}


echo "1. Акациевый мёд"
echo "--------------------------------------------------"

copy_photo \
    "*14_49_16*" \
    "acacia_14_49_16.jpg" \
    "Robinia pseudoacacia-type — основной кадр"

copy_photo \
    "*15_26_36*" \
    "acacia_15_26_36.jpg" \
    "Asteraceae-like — дополнительный морфотип"


echo
echo "2. Белокурихинский мёд"
echo "--------------------------------------------------"

copy_photo \
    "*14_41_42*" \
    "belokurikha_14_41_42.jpg" \
    "Morphotype B1"


echo
echo "3. Уржарский мёд"
echo "--------------------------------------------------"

URZHAR_TIF="$(find_photo "*16_04_06*")"

if [ -n "$URZHAR_TIF" ]; then

    echo "✓ Найден основной кадр Уржара"
    echo "  SOURCE: $URZHAR_TIF"

    python3 - "$URZHAR_TIF" "$DEST/urzhar_16_04_06.jpg" <<'PY'
import sys
from PIL import Image

src = sys.argv[1]
dst = sys.argv[2]

img = Image.open(src)

if img.mode not in ("RGB", "L"):
    img = img.convert("RGB")

img.save(
    dst,
    "JPEG",
    quality=95
)

print("  TIFF/JPEG → браузерный JPG")
print("  DEST:", dst)
PY

    echo

else

    echo "✗ НЕ НАЙДЕН: Уржар 16_04_06"
    echo

fi


copy_photo \
    "*16_32_19*" \
    "urzhar_16_32_19.jpg" \
    "Уржар — информативное обзорное поле"

copy_photo \
    "*16_14_30*" \
    "urzhar_16_14_30.jpg" \
    "Уржар — резервное поле с микрочастицами"

copy_photo \
    "*16_15_27*" \
    "urzhar_16_15_27.jpg" \
    "Уржар — резервное поле с микрочастицами"


echo
echo "=================================================="
echo " ФАЙЛЫ, КОТОРЫЕ ТЕПЕРЬ ЕСТЬ В HONEYLAB"
echo "=================================================="
echo

ls -lh "$DEST"

echo
echo "=================================================="
echo " ПРОВЕРКА"
echo "=================================================="
echo

EXPECTED=(
    "acacia_14_49_16.jpg"
    "acacia_15_26_36.jpg"
    "belokurikha_14_41_42.jpg"
    "urzhar_16_04_06.jpg"
    "urzhar_16_32_19.jpg"
    "urzhar_16_14_30.jpg"
    "urzhar_16_15_27.jpg"
)

FOUND=0

for f in "${EXPECTED[@]}"; do
    if [ -f "$DEST/$f" ]; then
        echo "✓ $f"
        FOUND=$((FOUND + 1))
    else
        echo "✗ $f"
    fi
done

echo
echo "Найдено и подготовлено: $FOUND из ${#EXPECTED[@]} файлов."
echo

if [ "$FOUND" -eq "${#EXPECTED[@]}" ]; then
    echo "🐝 Все основные микрофотографии HoneyLab готовы."
else
    echo "Некоторые исходники не найдены. Посмотри строки SOURCE/НЕ НАЙДЕН выше."
fi
