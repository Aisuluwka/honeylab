(() => {

    function normalizeImageUrl(url) {
        if (!url) return "";

        if (url.startsWith("/static/")) {
            return url;
        }

        if (url.startsWith("static/")) {
            return "/" + url;
        }

        if (url.startsWith("/")) {
            return url;
        }

        if (url.startsWith("samples/")) {
            return "/static/images/" + url;
        }

        return "/static/images/" + url;
    }


    function buildViewer() {

        if (document.getElementById("honeyPhotoViewer")) {
            return;
        }

        const viewer = document.createElement("div");

        viewer.id = "honeyPhotoViewer";
        viewer.className = "honey-photo-viewer";

        viewer.innerHTML = `
            <div class="honey-photo-viewer-backdrop" data-close-photo-viewer></div>

            <div class="honey-photo-viewer-dialog">
                <button
                    type="button"
                    class="honey-photo-viewer-close"
                    data-close-photo-viewer
                >
                    ×
                </button>

                <img
                    id="honeyPhotoViewerImage"
                    src=""
                    alt="Фото образца HoneyLab"
                >

                <div
                    id="honeyPhotoViewerCaption"
                    class="honey-photo-viewer-caption"
                ></div>
            </div>
        `;

        document.body.appendChild(viewer);
    }


    function openViewer(url, caption = "") {

        const viewer =
            document.getElementById("honeyPhotoViewer");

        const image =
            document.getElementById("honeyPhotoViewerImage");

        const captionBox =
            document.getElementById("honeyPhotoViewerCaption");

        image.src = normalizeImageUrl(url);
        captionBox.textContent = caption || "";

        viewer.classList.add("open");
        document.body.classList.add("photo-viewer-open");
    }


    function closeViewer() {

        const viewer =
            document.getElementById("honeyPhotoViewer");

        if (!viewer) return;

        viewer.classList.remove("open");
        document.body.classList.remove("photo-viewer-open");
    }


    function makeExistingImagesClickable() {

        const selectors = [
            ".sample-card img",
            ".sample-drawer img",
            ".passport img",
            ".microphoto img",
            ".sample-photo img",
            ".photo-grid img",
            ".micro-grid img"
        ];

        document.querySelectorAll(
            selectors.join(",")
        ).forEach(img => {

            if (img.dataset.honeyClickable === "true") {
                return;
            }

            img.dataset.honeyClickable = "true";
            img.style.cursor = "zoom-in";

            img.addEventListener("click", () => {
                openViewer(
                    img.getAttribute("src"),
                    img.getAttribute("alt") || ""
                );
            });
        });
    }


    function observeImages() {

        const observer = new MutationObserver(() => {
            makeExistingImagesClickable();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    function setupEvents() {

        document.addEventListener("click", event => {

            if (
                event.target.closest(
                    "[data-close-photo-viewer]"
                )
            ) {
                closeViewer();
            }
        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeViewer();
            }
        });
    }


    function init() {

        buildViewer();
        setupEvents();
        makeExistingImagesClickable();
        observeImages();
    }


    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            init
        );
    } else {
        init();
    }

})();
