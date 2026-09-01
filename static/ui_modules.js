(() => {

    const styles = [
        "/static/photo_viewer.css",
        "/static/sample_actions.css"
    ];

    const scripts = [
        "/static/photo_viewer.js",
        "/static/sample_actions.js"
    ];


    styles.forEach(href => {

        if (
            document.querySelector(
                `link[href="${href}"]`
            )
        ) {
            return;
        }

        const link =
            document.createElement("link");

        link.rel = "stylesheet";
        link.href = href;

        document.head.appendChild(link);
    });


    scripts.forEach(src => {

        if (
            document.querySelector(
                `script[src="${src}"]`
            )
        ) {
            return;
        }

        const script =
            document.createElement("script");

        script.src = src;
        script.defer = true;

        document.body.appendChild(script);
    });

})();


/* ==========================================================
   HoneyLab — honey controls + download buttons
   ========================================================== */

(function loadHoneyControls() {

    if (
        !document.querySelector(
            'link[data-honey-controls]'
        )
    ) {

        const css =
            document.createElement("link");

        css.rel =
            "stylesheet";

        css.href =
            "/static/honey_controls.css";

        css.dataset.honeyControls =
            "true";

        document.head.appendChild(
            css
        );
    }


    if (
        !document.querySelector(
            'script[data-honey-controls]'
        )
    ) {

        const script =
            document.createElement("script");

        script.src =
            "/static/honey_controls.js";

        script.dataset.honeyControls =
            "true";

        document.body.appendChild(
            script
        );
    }

})();


/* HoneyLab — ссылка на единый каталог образцов */
(function () {

    if (
        document.querySelector(
            'script[data-samples-link]'
        )
    ) {
        return;
    }

    const script =
        document.createElement("script");

    script.src =
        "/static/samples_link.js";

    script.dataset.samplesLink =
        "true";

    document.body.appendChild(
        script
    );

})();
