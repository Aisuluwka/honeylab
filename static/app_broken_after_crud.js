let samples = [];
let map;
let markerLayer;

document.addEventListener("DOMContentLoaded", async () => {
    initMap();

    await loadSamples();

    document
        .getElementById("searchInput")
        .addEventListener("input", applyFilters);

    document
        .getElementById("resultFilter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("resetFilters")
        .addEventListener("click", resetFilters);
});


function initMap() {
    map = L.map("map").setView([48.0, 67.0], 5);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    markerLayer = L.layerGroup().addTo(map);
}


async function loadSamples() {
    const response = await fetch("/api/samples");
    samples = await response.json();

    updateStats(samples);
    renderSamples(samples);
    renderMarkers(samples);
}


function updateStats(data) {
    const photoCount = data.reduce(
        (sum, sample) => sum + sample.photos.length,
        0
    );

    const mapped = data.filter(
        sample =>
            typeof sample.latitude === "number" &&
            typeof sample.longitude === "number"
    ).length;

    /*
        На текущем этапе считаем только реально выделенные
        рабочие морфотипы:
        1. Robinia pseudoacacia-type
        2. Asteraceae-like
        3. Morphotype B1

        Уржарский материал не превращаем искусственно
        в отдельный ботанический таксон.
    */
    const morphotypeCount = 3;

    document.getElementById("sampleCount").textContent = data.length;
    document.getElementById("photoCount").textContent = photoCount;
    document.getElementById("taxonCount").textContent = morphotypeCount;
    document.getElementById("mappedCount").textContent = mapped;
}


function renderSamples(data) {
    const grid = document.getElementById("samplesGrid");

    if (!data.length) {
        grid.innerHTML = "<p>По выбранному фильтру образцы не найдены.</p>";
        return;
    }

    grid.innerHTML = data.map(sample => {

        const location =
            [sample.region, sample.locality]
                .filter(Boolean)
                .join(", ") ||
            "Место отбора ещё не внесено";

        const photoText =
            `${sample.photos.length} микрофотографий`;

        return `
            <article class="sample-card">

                <div class="sample-number">
                    ${escapeHtml(sample.id)}
                </div>

                <h3>
                    ${escapeHtml(sample.name)}
                </h3>

                <div class="sample-location">
                    ${escapeHtml(location)}
                </div>

                <div class="result-box">
                    ${escapeHtml(sample.pollen_result)}
                </div>

                <div class="sample-meta">
                    <span class="tag">
                        ${escapeHtml(photoText)}
                    </span>

                    <span class="tag">
                        ${escapeHtml(sample.analysis_type)}
                    </span>
                </div>

                <button
                    class="open-sample"
                    onclick="openSample('${sample.id}')"
                >
                    Открыть цифровой паспорт →
                </button>

            </article>
        `;
    }).join("");
}


function renderMarkers(data) {
    markerLayer.clearLayers();

    const mappedSamples = data.filter(
        sample =>
            typeof sample.latitude === "number" &&
            typeof sample.longitude === "number"
    );

    mappedSamples.forEach(sample => {

        const marker = L.marker([
            sample.latitude,
            sample.longitude
        ]);

        marker.bindPopup(`
            <div style="min-width:220px">

                <strong style="font-size:16px">
                    ${escapeHtml(sample.name)}
                </strong>

                <p style="margin:8px 0">
                    ${escapeHtml(sample.locality || sample.region || "")}
                </p>

                <p style="font-size:12px;line-height:1.45">
                    ${escapeHtml(sample.pollen_result)}
                </p>

                <button
                    onclick="openSample('${sample.id}')"
                    style="
                        border:0;
                        background:#243c2a;
                        color:white;
                        padding:8px 10px;
                        border-radius:8px;
                        cursor:pointer;
                    "
                >
                    Открыть паспорт
                </button>

            </div>
        `);

        marker.addTo(markerLayer);
    });
}


function applyFilters() {
    const query =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    const resultFilter =
        document
            .getElementById("resultFilter")
            .value;

    const filtered = samples.filter(sample => {

        const haystack = `
            ${sample.name}
            ${sample.region}
            ${sample.locality}
            ${sample.pollen_result}
            ${sample.status}
        `.toLowerCase();

        const searchMatches =
            !query || haystack.includes(query);

        let resultMatches = true;

        const result =
            sample.pollen_result.toLowerCase();

        if (resultFilter === "robinia") {
            resultMatches =
                result.includes("robinia");
        }

        if (resultFilter === "asteraceae") {
            resultMatches =
                result.includes("asteraceae");
        }

        if (resultFilter === "b1") {
            resultMatches =
                result.includes("b1");
        }

        if (resultFilter === "unresolved") {
            resultMatches =
                result.includes("не разрешён") ||
                result.includes("не подтверждено");
        }

        return searchMatches && resultMatches;
    });

    renderSamples(filtered);
    renderMarkers(filtered);
}


function resetFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("resultFilter").value = "all";

    renderSamples(samples);
    renderMarkers(samples);
}


function openSample(sampleId) {
    const sample =
        samples.find(item => item.id === sampleId);

    if (!sample) {
        return;
    }

    const location =
        [sample.region, sample.locality]
            .filter(Boolean)
            .join(", ") ||
        "не указано";

    const photosHtml =
        sample.photos.length
        ? sample.photos.map(photo => `
            <div class="micro-card">

                <img
                    src="/static/images/${encodeURIComponent(photo.file)}"
                    alt="${escapeHtml(photo.caption)}"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
                >

                <div
                    class="missing-photo"
                    style="display:none"
                >
                    Файл ещё не скопирован:<br>
                    <strong>${escapeHtml(photo.file)}</strong>
                </div>

                <div class="micro-caption">
                    <strong>
                        ${escapeHtml(photo.original)}
                    </strong>

                    <br><br>

                    ${escapeHtml(photo.caption)}
                </div>

            </div>
        `).join("")
        : `
            <p>
                Для этого образца диагностические изображения
                пока не добавлены в галерею.
            </p>
        `;

    const physchemHtml =
        sample.physicochemical.length
        ? sample.physicochemical.map(item => `
            <div class="passport-row">
                <span class="passport-label">
                    ${escapeHtml(item.name)}
                </span>

                <strong>
                    ${escapeHtml(String(item.value))}
                    ${escapeHtml(item.unit || "")}
                </strong>
            </div>
        `).join("")
        : `
            <p style="color:#6d746a">
                Физико-химические показатели пока не внесены.
                Они будут добавляться только из фактических
                лабораторных результатов.
            </p>
        `;

    document.getElementById("modalContent").innerHTML = `

        <div class="modal-id">
            ${escapeHtml(sample.id)}
        </div>

        <h2 class="modal-title">
            ${escapeHtml(sample.name)}
        </h2>

        <div class="modal-subtitle">
            ${escapeHtml(location)}
        </div>


        <section class="passport-section">

            <h4>Паспорт образца</h4>

            <div class="passport-row">
                <span class="passport-label">
                    Тип образца
                </span>

                <strong>
                    ${escapeHtml(sample.honey_type)}
                </strong>
            </div>

            <div class="passport-row">
                <span class="passport-label">
                    Дата сбора
                </span>

                <strong>
                    ${escapeHtml(sample.collection_date || "не внесена")}
                </strong>
            </div>

            <div class="passport-row">
                <span class="passport-label">
                    Геопривязка
                </span>

                <strong>
                    ${escapeHtml(sample.location_status)}
                </strong>
            </div>

            <div class="passport-row">
                <span class="passport-label">
                    Метод анализа
                </span>

                <strong>
                    ${escapeHtml(sample.analysis_type)}
                </strong>
            </div>

        </section>


        <section class="passport-section">

            <h4>Палинологический результат</h4>

            <div class="result-box">
                ${escapeHtml(sample.pollen_result)}
            </div>

            <div class="passport-row">
                <span class="passport-label">
                    Уровень уверенности
                </span>

                <strong>
                    ${escapeHtml(sample.confidence)}
                </strong>
            </div>

            <div class="passport-row">
                <span class="passport-label">
                    Статус
                </span>

                <strong>
                    ${escapeHtml(sample.status)}
                </strong>
            </div>

        </section>


        <section class="passport-section">

            <h4>Микрофотографии</h4>

            <div class="micro-grid">
                ${photosHtml}
            </div>

        </section>


        <section class="passport-section">

            <h4>Физико-химические показатели</h4>

            ${physchemHtml}

        </section>


        <section class="passport-section">

            <h4>Научная примечание</h4>

            <p style="line-height:1.7">
                ${escapeHtml(sample.notes)}
            </p>

        </section>
    `;

    document
        .getElementById("sampleModal")
        .classList
        .add("open");

    document.body.style.overflow = "hidden";
}


function closeModal() {
    document
        .getElementById("sampleModal")
        .classList
        .remove("open");

    document.body.style.overflow = "";
}


function scrollToMap() {
    document
        .getElementById("mapSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


function scrollToSamples() {
    document
        .getElementById("samplesSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/*
    Дополнительные счётчики главного пчелиного экрана.
    Они синхронизируются с фактическими данными samples.json.
*/

function updateHeroStats() {

    if (!samples || !samples.length) {
        return;
    }

    const photoCount = samples.reduce(
        (sum, sample) =>
            sum + (sample.photos ? sample.photos.length : 0),
        0
    );

    const mappedCount = samples.filter(
        sample =>
            typeof sample.latitude === "number" &&
            typeof sample.longitude === "number"
    ).length;

    const sampleEl =
        document.getElementById("heroSampleCount");

    const photoEl =
        document.getElementById("heroPhotoCount");

    const mappedEl =
        document.getElementById("heroMappedCount");

    if (sampleEl) {
        sampleEl.textContent = samples.length;
    }

    if (photoEl) {
        photoEl.textContent = photoCount;
    }

    if (mappedEl) {
        mappedEl.textContent = mappedCount;
    }
}


/*
    Перехватываем существующую функцию updateStats,
    сохраняя её исходную работу.
*/

const originalUpdateStats = updateStats;

updateStats = function(data) {

    originalUpdateStats(data);

    setTimeout(
        updateHeroStats,
        0
    );
};


/* ==========================================================
   HONEYLAB — ДОПОЛНИТЕЛЬНЫЙ ИНТЕРФЕЙС
   ========================================================== */

(function loadHoneyLabEnhancements() {

    if (
        !document.querySelector(
            'link[data-honeylab-enhancements]'
        )
    ) {

        const css =
            document.createElement("link");

        css.rel = "stylesheet";
        css.href =
            "/static/honeylab_enhancements.css";

        css.dataset.honeylabEnhancements =
            "true";

        document.head.appendChild(css);
    }


    if (
        !document.querySelector(
            'script[data-honeylab-enhancements]'
        )
    ) {

        const script =
            document.createElement("script");

        script.src =
            "/static/honeylab_enhancements.js";

        script.defer = true;

        script.dataset.honeylabEnhancements =
            "true";

        document.body.appendChild(script);
    }

})();


/* ==========================================================
   HONEYLAB — ARIADNA SCIENTIFIC CONSULTANT
   ========================================================== */

(function loadAriadnaAssistant() {

    if (
        !document.querySelector(
            'link[data-ariadna-assistant]'
        )
    ) {

        const css =
            document.createElement("link");

        css.rel = "stylesheet";

        css.href =
            "/static/ariadna_assistant.css";

        css.dataset.ariadnaAssistant =
            "true";

        document.head.appendChild(css);
    }


    if (
        !document.querySelector(
            'script[data-ariadna-assistant]'
        )
    ) {

        const script =
            document.createElement("script");

        script.src =
            "/static/ariadna_assistant.js";

        script.defer = true;

        script.dataset.ariadnaAssistant =
            "true";

        document.body.appendChild(
            script
        );
    }

})();


/* ==========================================================
   HONEYLAB — ARIADNA ASSISTANT
   ========================================================== */

(function loadAriadnaAssistant() {

    if (
        !document.querySelector(
            'link[data-ariadna-assistant]'
        )
    ) {

        const css =
            document.createElement("link");

        css.rel = "stylesheet";
        css.href =
            "/static/ariadna_assistant.css";

        css.dataset.ariadnaAssistant =
            "true";

        document.head.appendChild(css);
    }


    if (
        !document.querySelector(
            'script[data-ariadna-assistant]'
        )
    ) {

        const script =
            document.createElement("script");

        script.src =
            "/static/ariadna_assistant.js";

        script.dataset.ariadnaAssistant =
            "true";

        document.body.appendChild(script);
    }

})();


/* ==========================================================
   HONEYLAB — ADD NEW SAMPLE
   ========================================================== */

(function loadAddSampleModule() {

    if (
        !document.querySelector(
            'link[data-add-sample]'
        )
    ) {

        const css =
            document.createElement("link");

        css.rel = "stylesheet";
        css.href =
            "/static/add_sample.css";

        css.dataset.addSample =
            "true";

        document.head.appendChild(
            css
        );
    }


    if (
        !document.querySelector(
            'script[data-add-sample]'
        )
    ) {

        const script =
            document.createElement("script");

        script.src =
            "/static/add_sample.js";

        script.dataset.addSample =
            "true";

        document.body.appendChild(
            script
        );
    }

})();


/* ==========================================================
   HONEYLAB — COMPATIBILITY FOR OLD + NEW SAMPLE PASSPORTS
   Старые образцы используют photos / pollen_result,
   новые — microphotos / pollen_morphotype / presumed_taxon.
   ========================================================== */

renderSamples = function(data) {

    const grid =
        document.getElementById("samplesGrid");

    if (!grid) {
        return;
    }

    if (!Array.isArray(data) || !data.length) {

        grid.innerHTML = `
            <p>
                По выбранному фильтру
                образцы не найдены.
            </p>
        `;

        return;
    }


    grid.innerHTML =
        data.map(sample => {

            /* ----------------------------------------------
               География
               ---------------------------------------------- */

            const location =
                [
                    sample.region,
                    sample.district,
                    sample.locality
                ]
                    .filter(Boolean)
                    .join(", ")
                ||
                "Место происхождения ещё не внесено";


            /* ----------------------------------------------
               Микрофотографии:
               поддерживаем старый и новый формат
               ---------------------------------------------- */

            const microphotos =
                Array.isArray(sample.photos)
                    ? sample.photos
                    : (
                        Array.isArray(sample.microphotos)
                            ? sample.microphotos
                            : []
                    );


            const photoCount =
                microphotos.length;


            let photoText;

            if (photoCount === 0) {

                photoText =
                    "Микрофотографии не добавлены";

            } else if (photoCount === 1) {

                photoText =
                    "1 микрофотография";

            } else {

                photoText =
                    `${photoCount} микрофотографий`;
            }


            /* ----------------------------------------------
               Результат:
               старый pollen_result или новый формат
               ---------------------------------------------- */

            let pollenResult =
                sample.pollen_result || "";


            if (!pollenResult) {

                const pieces = [];


                if (sample.pollen_morphotype) {

                    pieces.push(
                        `Морфотип: ${sample.pollen_morphotype}`
                    );
                }


                if (sample.presumed_taxon) {

                    pieces.push(
                        `Предполагаемый таксон: ${sample.presumed_taxon}`
                    );
                }


                pollenResult =
                    pieces.join(". ");
            }


            if (!pollenResult) {

                pollenResult =
                    "Палинологическая интерпретация ещё не внесена.";
            }


            /* ----------------------------------------------
               Тип анализа
               ---------------------------------------------- */

            const analysisType =
                sample.analysis_type
                ||
                (
                    photoCount > 0
                        ? "Микроскопическое исследование"
                        : "Паспорт образца"
                );


            /* ----------------------------------------------
               Фото самого мёда
               ---------------------------------------------- */

            const samplePhotos =
                Array.isArray(sample.sample_photos)
                    ? sample.sample_photos
                    : [];


            const honeyPhotoText =
                samplePhotos.length
                    ? `🍯 Фото образца: ${samplePhotos.length}`
                    : "🍯 Фото образца не добавлено";


            /* ----------------------------------------------
               Статус
               ---------------------------------------------- */

            const status =
                sample.status
                ||
                "Требует дальнейшего исследования";


            return `

                <article class="sample-card">

                    <div class="sample-number">
                        ${escapeHtml(sample.id || "")}
                    </div>


                    <h3>
                        ${escapeHtml(
                            sample.name
                            || "Без названия"
                        )}
                    </h3>


                    <div class="sample-location">
                        ${escapeHtml(location)}
                    </div>


                    <div class="result-box">
                        ${escapeHtml(pollenResult)}
                    </div>


                    <div class="sample-meta">

                        <span class="tag">
                            ${escapeHtml(photoText)}
                        </span>

                        <span class="tag">
                            ${escapeHtml(honeyPhotoText)}
                        </span>

                        <span class="tag">
                            ${escapeHtml(analysisType)}
                        </span>

                    </div>


                    <div
                        style="
                            margin-top:12px;
                            font-size:11px;
                            line-height:1.45;
                            color:#796854;
                        "
                    >
                        ${escapeHtml(status)}
                    </div>


                    <button
                        class="open-sample"
                        onclick="openSample(
                            '${escapeHtml(sample.id || "")}'
                        )"
                    >
                        Открыть цифровой паспорт →
                    </button>

                </article>
            `;

        }).join("");
};


/* ==========================================================
   HONEYLAB — SAMPLE MANAGEMENT
   ========================================================== */

(function loadSampleManager() {

    if (
        !document.querySelector(
            'link[data-sample-manager]'
        )
    ) {

        const css =
            document.createElement("link");

        css.rel =
            "stylesheet";

        css.href =
            "/static/sample_manager.css";

        css.dataset.sampleManager =
            "true";

        document.head.appendChild(
            css
        );
    }


    if (
        !document.querySelector(
            'script[data-sample-manager]'
        )
    ) {

        const script =
            document.createElement("script");

        script.src =
            "/static/sample_manager.js";

        script.dataset.sampleManager =
            "true";

        document.body.appendChild(
            script
        );
    }

})();
