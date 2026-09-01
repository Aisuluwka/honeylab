(() => {

    function bindHiveButton() {

        const candidates = [
            ...document.querySelectorAll(
                'a, button, .btn, .button, [role="button"]'
            )
        ];

        const hiveButton = candidates.find(el => {
            const text = (el.textContent || "")
                .trim()
                .toLowerCase();

            return (
                text.includes("улей образцов")
                ||
                text === "образцы"
            );
        });

        if (!hiveButton) {
            console.warn(
                "HoneyLab: кнопка «Улей образцов» не найдена"
            );
            return;
        }

        hiveButton.style.cursor = "pointer";

        if (hiveButton.tagName === "A") {

            hiveButton.href =
                "/static/samples.html";

            return;
        }

        hiveButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                window.location.href =
                    "/static/samples.html";
            },
            true
        );
    }


    function init() {

        bindHiveButton();

        const observer =
            new MutationObserver(() => {
                bindHiveButton();
            });

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();
