(() => {

    /* ======================================================
       Нормализация URL
       ====================================================== */

    function normalizeImageUrl(src) {

        if (!src) {
            return "";
        }


        /*
         * Новые загрузки:
         * /static/uploads/HL-005/...
         */
        if (src.startsWith("/static/")) {
            return src;
        }


        if (src.startsWith("static/")) {
            return "/" + src;
        }


        /*
         * Старый формат:
         * micro/xxx.jpg
         */
        if (src.startsWith("micro/")) {
            return "/static/images/" + src;
        }


        /*
         * Старый формат:
         * samples/xxx.jpeg
         */
        if (src.startsWith("samples/")) {
            return "/static/images/" + src;
        }


        /*
         * Уже абсолютный путь сайта
         */
        if (src.startsWith("/")) {
            return src;
        }


        /*
         * Просто имя файла
         */
        return "/static/images/" + src;
    }


    /* ======================================================
       Не добавляем скачивание на служебные изображения
       ====================================================== */

    function shouldIgnoreImage(img) {

        if (!img) {
            return true;
        }


        if (
            img.closest(
                ".ariadna-assistant,"
                + ".developer-profile,"
                + ".developer-card,"
                + ".assistant-avatar"
            )
        ) {
            return true;
        }


        const src =
            img.getAttribute("src")
            || "";


        if (
            src.includes(
                "/developer/ariadna"
            )
        ) {
            return true;
        }


        return false;
    }


    /* ======================================================
       Имя скачиваемого файла
       ====================================================== */

    function getFilename(url) {

        try {

            const clean =
                url.split("?")[0];

            const parts =
                clean.split("/");

            return (
                parts[parts.length - 1]
                ||
                "honeylab_photo.jpg"
            );

        } catch {

            return "honeylab_photo.jpg";
        }
    }


    /* ======================================================
       Добавляем кнопку над фотографией
       ====================================================== */

    function addDownloadButton(img) {

        if (
            !img
            ||
            shouldIgnoreImage(img)
            ||
            img.dataset.honeyDownload === "true"
        ) {
            return;
        }


        const originalSrc =
            img.getAttribute("src");

        if (!originalSrc) {
            return;
        }


        const url =
            normalizeImageUrl(
                originalSrc
            );


        /*
         * Одновременно исправляем старые
         * относительные пути изображения.
         */
        if (
            url
            &&
            originalSrc !== url
        ) {
            img.src = url;
        }


        const bar =
            document.createElement(
                "div"
            );

        bar.className =
            "honey-photo-download-bar";


        const download =
            document.createElement(
                "a"
            );

        download.className =
            "honey-photo-download";

        download.href =
            url;

        download.download =
            getFilename(url);

        download.textContent =
            "Скачать фото";

        download.title =
            "Скачать изображение";


        /*
         * Не даём клику на Download открыть viewer.
         */
        download.addEventListener(
            "click",
            event => {

                event.stopPropagation();
            }
        );


        bar.appendChild(
            download
        );


        img.parentNode.insertBefore(
            bar,
            img
        );


        img.dataset.honeyDownload =
            "true";

        img.classList.add(
            "honey-download-enabled"
        );
    }


    /* ======================================================
       Ищем только рабочие изображения HoneyLab
       ====================================================== */

    function processImages() {

        const selectors = [

            ".sample-card img",

            ".sample-photo img",

            ".sample-photos img",

            ".microphoto img",

            ".microphotos img",

            ".micro-grid img",

            ".photo-grid img",

            ".passport img",

            ".sample-drawer img",

            ".sample-modal img",

            ".sample-detail img"

        ];


        document
            .querySelectorAll(
                selectors.join(",")
            )
            .forEach(
                addDownloadButton
            );
    }


    /* ======================================================
       Следим за динамически появляющимися паспортами
       ====================================================== */

    function observe() {

        const observer =
            new MutationObserver(
                () => {
                    processImages();
                }
            );


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }


    function init() {

        processImages();

        observe();
    }


    if (
        document.readyState
        === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();
