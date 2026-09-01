(() => {

    function init() {

        if (
            document.getElementById(
                "honeylabSamplesLink"
            )
        ) {
            return;
        }


        const link =
            document.createElement("a");


        link.id =
            "honeylabSamplesLink";


        link.href =
            "/static/samples.html";


        link.innerHTML =
            `
                <span>🐝</span>
                <strong>Образцы</strong>
            `;


        Object.assign(
            link.style,
            {
                position:
                    "fixed",

                right:
                    "22px",

                bottom:
                    "22px",

                zIndex:
                    "9000",

                display:
                    "flex",

                alignItems:
                    "center",

                gap:
                    "7px",

                padding:
                    "11px 15px",

                border:
                    "1px solid #d9a83b",

                borderRadius:
                    "14px",

                background:
                    "linear-gradient(135deg,#ffe28c,#f2bd4b)",

                color:
                    "#422d1d",

                textDecoration:
                    "none",

                fontSize:
                    "11px",

                boxShadow:
                    "0 8px 25px rgba(94,62,18,.22)"
            }
        );


        document.body.appendChild(
            link
        );
    }


    if (
        document.readyState
        ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();
