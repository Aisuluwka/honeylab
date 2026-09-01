(() => {

    let allSamples = [];


    function esc(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function imageUrl(file) {

        if (!file) {
            return "";
        }

        if (
            file.startsWith("http://")
            ||
            file.startsWith("https://")
        ) {
            return file;
        }

        if (file.startsWith("/static/")) {
            return file;
        }

        if (file.startsWith("static/")) {
            return "/" + file;
        }

        if (
            file.startsWith("micro/")
            ||
            file.startsWith("samples/")
        ) {
            return "/static/images/" + file;
        }

        return "/static/images/" + file;
    }


    function photoObjects(sample) {

        return Array.isArray(sample.sample_photos)
            ? sample.sample_photos
            : [];
    }


    function microObjects(sample) {

        if (
            Array.isArray(sample.microphotos)
            &&
            sample.microphotos.length
        ) {
            return sample.microphotos;
        }

        if (Array.isArray(sample.photos)) {
            return sample.photos;
        }

        return [];
    }


    function pollenText(sample) {

        if (sample.pollen_result) {
            return sample.pollen_result;
        }

        const parts = [];

        if (sample.pollen_morphotype) {
            parts.push(sample.pollen_morphotype);
        }

        if (sample.presumed_taxon) {
            parts.push(
                "Предполагаемый таксон: "
                + sample.presumed_taxon
            );
        }

        return (
            parts.join(" · ")
            ||
            "Палинологическая интерпретация пока не внесена."
        );
    }


    function sampleDate(sample) {
        return (
            sample.date
            ||
            sample.collection_date
            ||
            "не указана"
        );
    }


    function locationText(sample) {

        return [
            sample.region,
            sample.district,
            sample.locality
        ]
        .filter(Boolean)
        .join(" · ")
        ||
        "Географические данные не указаны";
    }


    function firstSamplePhoto(sample) {

        const photos =
            photoObjects(sample);

        if (!photos.length) {
            return "";
        }

        const photo =
            photos[0];

        return imageUrl(
            typeof photo === "string"
                ? photo
                : photo.file
        );
    }


    function statusText(sample) {

        return (
            sample.status
            ||
            "Требует дальнейшего исследования"
        );
    }


    function render(samples) {

        const grid =
            document.getElementById(
                "samplesGrid"
            );


        document.getElementById(
            "samplesTotal"
        ).textContent =
            samples.length;


        if (!samples.length) {

            grid.innerHTML = `
                <div class="samples-message show">
                    Образцы по выбранным условиям не найдены.
                </div>
            `;

            return;
        }


        grid.innerHTML =
            samples.map(sample => {

                const photo =
                    firstSamplePhoto(sample);

                const microCount =
                    microObjects(sample).length;


                return `
                    <article
                        class="sample-card"
                        data-id="${esc(sample.id)}"
                    >

                        <div class="sample-image-area">

                            ${
                                photo
                                ? `
                                    <a
                                        class="photo-download card-download"
                                        href="${esc(photo)}"
                                        download
                                        onclick="event.stopPropagation()"
                                    >
                                        ⬇ Скачать
                                    </a>

                                    <img
                                        src="${esc(photo)}"
                                        alt="${esc(sample.name || "Образец мёда")}"
                                        data-open-photo="${esc(photo)}"
                                    >
                                `
                                : `
                                    <div class="image-placeholder">
                                        🍯
                                    </div>
                                `
                            }

                        </div>


                        <div class="sample-body">

                            <div class="sample-topline">

                                <span class="sample-id">
                                    ${esc(sample.id)}
                                </span>

                                <span class="sample-status">
                                    ${esc(statusText(sample))}
                                </span>

                            </div>


                            <h2>
                                ${esc(sample.name || "Без названия")}
                            </h2>


                            <p class="sample-location">
                                📍 ${esc(locationText(sample))}
                            </p>


                            <div class="sample-analysis">
                                ${esc(pollenText(sample))}
                            </div>


                            <div class="sample-meta">

                                <span>
                                    🔬 ${microCount} микрофото
                                </span>

                                <span>
                                    📅 ${esc(sampleDate(sample))}
                                </span>

                            </div>


                            <div class="card-actions">

                                <button
                                    class="card-button primary"
                                    type="button"
                                    data-open-passport="${esc(sample.id)}"
                                >
                                    Открыть цифровой паспорт →
                                </button>


                                <button
                                    class="card-button"
                                    type="button"
                                    data-edit-sample="${esc(sample.id)}"
                                >
                                    ✏ Редактировать
                                </button>


                                <button
                                    class="card-button delete"
                                    type="button"
                                    data-delete-sample="${esc(sample.id)}"
                                >
                                    🗑 Удалить
                                </button>

                            </div>

                        </div>

                    </article>
                `;

            }).join("");
    }


    function populateStatuses() {

        const select =
            document.getElementById(
                "samplesStatusFilter"
            );

        const selected =
            select.value;


        const statuses =
            [...new Set(
                allSamples
                    .map(statusText)
                    .filter(Boolean)
            )]
            .sort();


        select.innerHTML =
            `
                <option value="">
                    Все статусы
                </option>
            `
            +
            statuses
                .map(
                    status => `
                        <option value="${esc(status)}">
                            ${esc(status)}
                        </option>
                    `
                )
                .join("");


        select.value =
            selected;
    }


    function filterSamples() {

        const query =
            document
                .getElementById(
                    "samplesSearch"
                )
                .value
                .trim()
                .toLowerCase();


        const status =
            document
                .getElementById(
                    "samplesStatusFilter"
                )
                .value;


        const filtered =
            allSamples.filter(sample => {

                const haystack = [
                    sample.id,
                    sample.name,
                    sample.region,
                    sample.district,
                    sample.locality,
                    pollenText(sample),
                    statusText(sample)
                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


                const matchesQuery =
                    !query
                    ||
                    haystack.includes(query);


                const matchesStatus =
                    !status
                    ||
                    statusText(sample) === status;


                return (
                    matchesQuery
                    &&
                    matchesStatus
                );
            });


        render(filtered);
    }


    async function loadSamples() {

        const message =
            document.getElementById(
                "samplesMessage"
            );


        try {

            const response =
                await fetch(
                    "/api/samples",
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {
                throw new Error(
                    "Не удалось загрузить образцы"
                );
            }


            const data =
                await response.json();


            allSamples =
                Array.isArray(data)
                    ? data
                    : [];


            populateStatuses();

            filterSamples();

            message.classList.remove(
                "show"
            );


        } catch (error) {

            message.textContent =
                error.message;

            message.classList.add(
                "show"
            );
        }
    }


    function photoBlock(photo) {

        const file =
            imageUrl(
                typeof photo === "string"
                    ? photo
                    : photo.file
            );


        if (!file) {
            return "";
        }


        return `
            <figure class="passport-photo">

                <a
                    class="photo-download card-download"
                    href="${esc(file)}"
                    download
                    onclick="event.stopPropagation()"
                >
                    ⬇ Скачать
                </a>

                <img
                    src="${esc(file)}"
                    alt=""
                    data-open-photo="${esc(file)}"
                >

            </figure>
        `;
    }


    function openPassport(id) {

        const sample =
            allSamples.find(
                item =>
                    String(item.id)
                    ===
                    String(id)
            );


        if (!sample) {
            return;
        }


        const samplePhotos =
            photoObjects(sample);


        const micros =
            microObjects(sample);


        document.getElementById(
            "passportContent"
        ).innerHTML = `

            <span class="passport-id">
                ${esc(sample.id)}
            </span>


            <h2 class="passport-title">
                ${esc(sample.name || "Образец мёда")}
            </h2>


            <section class="passport-section">

                <h3>
                    Паспорт образца
                </h3>


                <div class="passport-data">

                    <div>
                        <span>Регион</span>

                        <strong>
                            ${esc(sample.region || "Не указан")}
                        </strong>
                    </div>


                    <div>
                        <span>Место</span>

                        <strong>
                            ${esc(locationText(sample))}
                        </strong>
                    </div>


                    <div>
                        <span>Дата</span>

                        <strong>
                            ${esc(sampleDate(sample))}
                        </strong>
                    </div>


                    <div>
                        <span>Источник</span>

                        <strong>
                            ${esc(sample.source || "Не указан")}
                        </strong>
                    </div>


                    <div>
                        <span>Статус</span>

                        <strong>
                            ${esc(statusText(sample))}
                        </strong>
                    </div>


                    <div>
                        <span>Уверенность</span>

                        <strong>
                            ${esc(sample.confidence || "Не указана")}
                        </strong>
                    </div>

                </div>

            </section>


            <section class="passport-section">

                <h3>
                    Палинологическая интерпретация
                </h3>

                <p>
                    ${esc(pollenText(sample))}
                </p>

            </section>


            ${
                samplePhotos.length
                ? `
                    <section class="passport-section">

                        <h3>
                            Фото образца
                        </h3>

                        <div class="passport-photo-grid">

                            ${samplePhotos
                                .map(photoBlock)
                                .join("")}

                        </div>

                    </section>
                `
                : ""
            }


            ${
                micros.length
                ? `
                    <section class="passport-section">

                        <h3>
                            Микрофотографии
                        </h3>

                        <div class="passport-photo-grid">

                            ${micros
                                .map(photoBlock)
                                .join("")}

                        </div>

                    </section>
                `
                : ""
            }

        `;


        const modal =
            document.getElementById(
                "samplePassport"
            );


        modal.classList.add("open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";
    }


    function closePassport() {

        document.getElementById(
            "samplePassport"
        ).classList.remove("open");

        document.body.style.overflow =
            "";
    }


    function openPhoto(src) {

        const viewer =
            document.getElementById(
                "photoViewer"
            );


        const img =
            document.getElementById(
                "photoViewerImage"
            );


        const download =
            document.getElementById(
                "photoViewerDownload"
            );


        img.src =
            src;

        download.href =
            src;


        viewer.classList.add(
            "open"
        );

        document.body.style.overflow =
            "hidden";
    }


    function closePhoto() {

        document.getElementById(
            "photoViewer"
        ).classList.remove(
            "open"
        );

        document.body.style.overflow =
            "";
    }


    async function deleteSample(id) {

        const sample =
            allSamples.find(
                item =>
                    String(item.id)
                    ===
                    String(id)
            );


        const ok =
            window.confirm(
                `Удалить образец «${
                    sample?.name || id
                }»?`
            );


        if (!ok) {
            return;
        }


        const response =
            await fetch(
                `/api/samples/${encodeURIComponent(id)}`,
                {
                    method:
                        "DELETE"
                }
            );


        if (!response.ok) {

            alert(
                "Не удалось удалить образец."
            );

            return;
        }


        await loadSamples();
    }


    document.addEventListener(
        "click",
        event => {

            const passport =
                event.target.closest(
                    "[data-open-passport]"
                );


            if (passport) {

                openPassport(
                    passport.dataset.openPassport
                );

                return;
            }


            const photo =
                event.target.closest(
                    "[data-open-photo]"
                );


            if (photo) {

                openPhoto(
                    photo.dataset.openPhoto
                );

                return;
            }


            const remove =
                event.target.closest(
                    "[data-delete-sample]"
                );


            if (remove) {

                deleteSample(
                    remove.dataset.deleteSample
                );

                return;
            }


            const edit =
                event.target.closest(
                    "[data-edit-sample]"
                );


            if (edit) {

                /*
                 * Пока используем существующий редактор
                 * на главной странице.
                 */
                window.location.href =
                    "/#samples";

                return;
            }


            if (
                event.target.closest(
                    "[data-close-passport]"
                )
            ) {

                closePassport();

                return;
            }


            if (
                event.target.closest(
                    "[data-close-photo]"
                )
            ) {

                closePhoto();
            }

        }
    );


    document.getElementById(
        "samplesSearch"
    ).addEventListener(
        "input",
        filterSamples
    );


    document.getElementById(
        "samplesStatusFilter"
    ).addEventListener(
        "change",
        filterSamples
    );


    document.getElementById(
        "refreshSamples"
    ).addEventListener(
        "click",
        loadSamples
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key
                ===
                "Escape"
            ) {

                closePhoto();

                closePassport();
            }
        }
    );


    loadSamples();

})();
