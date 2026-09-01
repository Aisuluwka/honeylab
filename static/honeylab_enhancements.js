(() => {

    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value || "";

        return div.innerHTML;
    }


    function findSampleByName(name) {

        if (
            typeof samples === "undefined"
            || !Array.isArray(samples)
        ) {
            return null;
        }

        return samples.find(
            sample =>
                sample.name === name
        );
    }


    /* ======================================================
       КАРТОЧКА ОБРАЗЦА
       ====================================================== */

    function addCardPhoto() {

        document
            .querySelectorAll(".sample-card")
            .forEach(card => {

                if (
                    card.querySelector(
                        ".sample-real-photo"
                    )
                ) {
                    return;
                }

                const title =
                    card.querySelector("h3");

                if (!title) {
                    return;
                }

                const sample =
                    findSampleByName(
                        title.textContent.trim()
                    );

                if (
                    !sample
                    || !Array.isArray(
                        sample.sample_photos
                    )
                    || !sample.sample_photos.length
                ) {
                    return;
                }

                const first =
                    sample.sample_photos[0];

                const block =
                    document.createElement(
                        "div"
                    );

                block.className =
                    "sample-real-photo";

                block.innerHTML = `
                    <img
                        src="${first.file}"
                        alt="${escapeHtml(sample.name)} — фотография образца"
                        class="honey-clickable-image"
                        title="Нажмите, чтобы увеличить"
                        loading="lazy"
                    >
                `;

                title.insertAdjacentElement(
                    "afterend",
                    block
                );

            });
    }


    /* ======================================================
       ГАЛЕРЕЯ ПАСПОРТА
       ====================================================== */

    function addPassportGallery() {

        const modal =
            document.getElementById(
                "modalContent"
            );

        if (!modal) {
            return;
        }

        if (
            modal.querySelector(
                ".passport-real-sample-gallery"
            )
        ) {
            return;
        }

        const title =
            modal.querySelector(
                ".modal-title"
            );

        if (!title) {
            return;
        }

        const sample =
            findSampleByName(
                title.textContent.trim()
            );

        if (
            !sample
            || !Array.isArray(
                sample.sample_photos
            )
            || !sample.sample_photos.length
        ) {
            return;
        }


        const gallery =
            document.createElement(
                "section"
            );

        gallery.className =
            "passport-real-sample-gallery";


        const cards =
            sample.sample_photos
                .map(
                    (photo, index) => `

                    <figure class="real-sample-photo">

                        <div class="real-sample-image-wrap">

                            <img
                                src="${photo.file}"
                                alt="${escapeHtml(sample.name)} — фотография ${index + 1}"
                                class="honey-clickable-image"
                                title="Нажмите, чтобы увеличить"
                                loading="lazy"
                            >

                            <span class="gallery-zoom">
                                ⤢
                            </span>

                        </div>

                        <figcaption>
                            ${escapeHtml(sample.name)}
                            — фотография образца
                            ${index + 1}
                        </figcaption>

                    </figure>

                `
                )
                .join("");


        gallery.innerHTML = `

            <div class="passport-real-photo-heading">

                <div>

                    <span class="passport-photo-kicker">
                        🍯 ФОТОГРАФИИ ОБРАЗЦА
                    </span>

                    <h4>
                        Внешний вид исследованного мёда
                    </h4>

                    <p>
                        Все фотографии исходного образца
                        сохраняются в его цифровом паспорте.
                        Нажмите на фотографию для увеличения.
                    </p>

                </div>

                <span class="passport-real-photo-count">
                    ${sample.sample_photos.length}
                    фото
                </span>

            </div>

            <div class="passport-real-photo-grid">
                ${cards}
            </div>

        `;


        const subtitle =
            modal.querySelector(
                ".modal-subtitle"
            );

        if (subtitle) {

            subtitle.insertAdjacentElement(
                "afterend",
                gallery
            );

        } else {

            title.insertAdjacentElement(
                "afterend",
                gallery
            );
        }
    }


    function enhance() {

        addCardPhoto();

        const sampleModal =
            document.getElementById(
                "sampleModal"
            );

        if (
            sampleModal
            && sampleModal.classList
                .contains("open")
        ) {
            addPassportGallery();
        }
    }


    document.addEventListener(
        "DOMContentLoaded",
        enhance
    );


    const observer =
        new MutationObserver(
            enhance
        );

    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

})();
