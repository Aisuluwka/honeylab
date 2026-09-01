(() => {

    /* =========================================================
       HONEYLAB — УНИВЕРСАЛЬНЫЙ ПРОСМОТР ФОТО
       Работает и для фото образца, и для микрофотографий.
       ========================================================= */

    function createViewer() {

        let viewer =
            document.getElementById("universalHoneyViewer");

        if (viewer) {
            return viewer;
        }

        viewer = document.createElement("div");
        viewer.id = "universalHoneyViewer";
        viewer.className = "universal-honey-viewer";

        viewer.innerHTML = `
            <div class="universal-honey-backdrop"></div>

            <div class="universal-honey-content">

                <button
                    type="button"
                    class="universal-honey-close"
                    aria-label="Закрыть"
                >
                    ×
                </button>

                <img
                    class="universal-honey-image"
                    src=""
                    alt="Фотография HoneyLab"
                >

                <div class="universal-honey-caption"></div>

            </div>
        `;

        document.body.appendChild(viewer);

        viewer
            .querySelector(".universal-honey-backdrop")
            .addEventListener(
                "click",
                closeViewer
            );

        viewer
            .querySelector(".universal-honey-close")
            .addEventListener(
                "click",
                closeViewer
            );

        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {
                    closeViewer();
                }

            }
        );

        return viewer;
    }


    function openViewer(img) {

        if (!img || !img.src) {
            return;
        }

        const viewer = createViewer();

        const viewerImage =
            viewer.querySelector(
                ".universal-honey-image"
            );

        const caption =
            viewer.querySelector(
                ".universal-honey-caption"
            );

        viewerImage.src = img.currentSrc || img.src;

        viewerImage.alt =
            img.alt || "Фотография HoneyLab";

        let captionText =
            img.alt || "";

        const figure =
            img.closest("figure");

        if (figure) {

            const figcaption =
                figure.querySelector(
                    "figcaption"
                );

            if (
                figcaption &&
                figcaption.textContent.trim()
            ) {
                captionText =
                    figcaption.textContent.trim();
            }
        }


        const microCard =
            img.closest(".micro-card");

        if (microCard) {

            const microCaption =
                microCard.querySelector(
                    ".micro-caption"
                );

            if (
                microCaption &&
                microCaption.textContent.trim()
            ) {
                captionText =
                    microCaption.textContent.trim();
            }
        }

        caption.textContent =
            captionText;

        viewer.classList.add("open");

        document.body.classList.add(
            "honey-photo-viewer-open"
        );
    }


    function closeViewer() {

        const viewer =
            document.getElementById(
                "universalHoneyViewer"
            );

        if (!viewer) {
            return;
        }

        viewer.classList.remove("open");

        document.body.classList.remove(
            "honey-photo-viewer-open"
        );
    }


    /* =========================================================
       ДЕЛАЕМ ВСЕ ИЗОБРАЖЕНИЯ ПАСПОРТА АКТИВНЫМИ
       ========================================================= */

    function activatePassportImages() {

        const modal =
            document.getElementById(
                "sampleModal"
            );

        if (!modal) {
            return;
        }

        modal
            .querySelectorAll("img")
            .forEach(img => {

                /*
                    Исключаем технические изображения,
                    если такие появятся.
                */

                if (
                    img.classList.contains(
                        "universal-honey-image"
                    )
                ) {
                    return;
                }

                img.classList.add(
                    "honey-clickable-image"
                );

                img.setAttribute(
                    "title",
                    "Нажмите, чтобы увеличить"
                );

            });
    }


    /* =========================================================
       DELEGATED CLICK

       Этот обработчик работает даже для изображений,
       которые появились после открытия паспорта.
       ========================================================= */

    document.addEventListener(
        "click",
        event => {

            const img =
                event.target.closest(
                    "#sampleModal img"
                );

            if (!img) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            openViewer(img);

        },
        true
    );


    /* =========================================================
       ДИНАМИЧЕСКИЕ ПАСПОРТА
       ========================================================= */

    const observer =
        new MutationObserver(() => {

            activatePassportImages();

        });


    document.addEventListener(
        "DOMContentLoaded",
        () => {

            createViewer();

            activatePassportImages();

            observer.observe(
                document.body,
                {
                    childList: true,
                    subtree: true
                }
            );

        }
    );

})();


/* ==========================================================
   HONEYLAB — ВОССТАНОВЛЕНИЕ ПРОБЛЕМНЫХ МИКРОФОТОГРАФИЙ
   ========================================================== */

(function fixKnownHoneyLabMicrophotos() {

    const MICROPHOTO_MAP = {

        "16_14_30":
            "/static/images/micro/urzhar_16_14_30.jpg",

        "urzhar_16_14_30.jpg":
            "/static/images/micro/urzhar_16_14_30.jpg",

        "16_15_27":
            "/static/images/micro/urzhar_16_15_27.jpg",

        "urzhar_16_15_27.jpg":
            "/static/images/micro/urzhar_16_15_27.jpg"

    };


    function replaceMissingBlocks() {

        const modal =
            document.getElementById("modalContent");

        if (!modal) {
            return;
        }


        modal
            .querySelectorAll(".missing-photo")
            .forEach(block => {

                const text =
                    block.textContent || "";

                for (
                    const [token, src]
                    of Object.entries(MICROPHOTO_MAP)
                ) {

                    if (!text.includes(token)) {
                        continue;
                    }

                    const img =
                        document.createElement("img");

                    img.src = src;

                    img.alt =
                        token === "16_14_30" ||
                        token.includes("16_14_30")
                            ? "16_14_30 — микрофотография Уржарского мёда"
                            : "16_15_27 — микрофотография Уржарского мёда";

                    img.loading = "lazy";

                    img.className =
                        "honey-clickable-image";

                    img.title =
                        "Нажмите, чтобы увеличить";

                    img.onerror = function () {
                        console.error(
                            "HoneyLab: фотография не загрузилась:",
                            src
                        );
                    };

                    block.replaceWith(img);

                    break;
                }

            });
    }


    function repairWrongImageSources() {

        const modal =
            document.getElementById("modalContent");

        if (!modal) {
            return;
        }

        modal
            .querySelectorAll("img")
            .forEach(img => {

                const src =
                    img.getAttribute("src") || "";

                if (src.includes("urzhar_16_14_30")) {
                    img.src =
                        "/static/images/micro/urzhar_16_14_30.jpg";
                }

                if (src.includes("urzhar_16_15_27")) {
                    img.src =
                        "/static/images/micro/urzhar_16_15_27.jpg";
                }

            });
    }


    function runRepair() {
        replaceMissingBlocks();
        repairWrongImageSources();
    }


    document.addEventListener(
        "DOMContentLoaded",
        runRepair
    );


    const observer =
        new MutationObserver(
            runRepair
        );

    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

})();
