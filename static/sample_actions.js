(() => {

    let samplesCache = [];


    async function loadSamples() {

        const response =
            await fetch(
                "/api/samples",
                { cache: "no-store" }
            );

        const data =
            await response.json();

        samplesCache =
            Array.isArray(data)
                ? data
                : [];

        attachActions();
    }


    function getSampleIdFromCard(card) {

        const idElement =
            card.querySelector(
                ".sample-number"
            );

        return idElement
            ? idElement.textContent.trim()
            : "";
    }


    function attachActions() {

        document
            .querySelectorAll(".sample-card")
            .forEach(card => {

                if (
                    card.querySelector(
                        ".honey-card-actions"
                    )
                ) {
                    return;
                }

                const sampleId =
                    getSampleIdFromCard(card);

                if (!sampleId) {
                    return;
                }

                const actions =
                    document.createElement("div");

                actions.className =
                    "honey-card-actions";

                actions.innerHTML = `
                    <button
                        type="button"
                        class="honey-edit-btn"
                        data-edit-sample="${sampleId}"
                    >
                        ✏ Редактировать
                    </button>

                    <button
                        type="button"
                        class="honey-delete-btn"
                        data-delete-sample="${sampleId}"
                    >
                        🗑 Удалить
                    </button>
                `;

                const openButton =
                    card.querySelector(
                        ".open-sample"
                    );

                if (openButton) {

                    openButton.insertAdjacentElement(
                        "beforebegin",
                        actions
                    );

                } else {

                    card.appendChild(actions);
                }
            });
    }


    function buildEditModal() {

        if (
            document.getElementById(
                "simpleHoneyEditModal"
            )
        ) {
            return;
        }

        const modal =
            document.createElement("div");

        modal.id =
            "simpleHoneyEditModal";

        modal.className =
            "simple-honey-edit-modal";

        modal.innerHTML = `
            <div
                class="simple-honey-edit-backdrop"
                data-close-simple-edit
            ></div>

            <div
                class="simple-honey-edit-dialog"
            >

                <div
                    class="simple-honey-edit-header"
                >
                    <div>
                        <span>
                            🐝 HONEYLAB
                        </span>

                        <h2>
                            Редактирование образца
                        </h2>

                        <p
                            id="simpleHoneyEditId"
                        ></p>
                    </div>

                    <button
                        type="button"
                        data-close-simple-edit
                    >
                        ×
                    </button>
                </div>

                <form
                    id="simpleHoneyEditForm"
                    enctype="multipart/form-data"
                >

                    <div
                        class="simple-honey-edit-grid"
                    >

                        <label>
                            <span>Название</span>
                            <input
                                name="name"
                                required
                            >
                        </label>

                        <label>
                            <span>Дата</span>
                            <input
                                type="date"
                                name="date"
                            >
                        </label>

                        <label>
                            <span>Регион</span>
                            <input
                                name="region"
                            >
                        </label>

                        <label>
                            <span>Район</span>
                            <input
                                name="district"
                            >
                        </label>

                        <label>
                            <span>Населённый пункт</span>
                            <input
                                name="locality"
                            >
                        </label>

                        <label>
                            <span>Источник</span>
                            <input
                                name="source"
                            >
                        </label>

                        <label class="wide">
                            <span>Наблюдаемый морфотип</span>
                            <input
                                name="pollen_morphotype"
                            >
                        </label>

                        <label class="wide">
                            <span>Предполагаемый таксон</span>
                            <input
                                name="presumed_taxon"
                            >
                        </label>

                        <label>
                            <span>Уверенность</span>
                            <input
                                name="confidence"
                            >
                        </label>

                        <label>
                            <span>Статус</span>
                            <input
                                name="status"
                            >
                        </label>

                        <label class="wide">
                            <span>Комментарий</span>
                            <textarea
                                name="notes"
                                rows="4"
                            ></textarea>
                        </label>

                        <label class="wide">
                            <span>Описание</span>
                            <textarea
                                name="description"
                                rows="3"
                            ></textarea>
                        </label>

                    </div>

                    <div
                        id="simpleHoneyEditMessage"
                        class="simple-honey-edit-message"
                    ></div>

                    <div
                        class="simple-honey-edit-actions"
                    >
                        <button
                            type="button"
                            data-close-simple-edit
                        >
                            Отмена
                        </button>

                        <button
                            type="submit"
                        >
                            Сохранить изменения
                        </button>
                    </div>

                </form>

            </div>
        `;

        document.body.appendChild(modal);
    }


    function closeEditModal() {

        const modal =
            document.getElementById(
                "simpleHoneyEditModal"
            );

        modal?.classList.remove("open");

        document.body.classList.remove(
            "simple-honey-edit-open"
        );
    }


    function openEditModal(sampleId) {

        const sample =
            samplesCache.find(
                item => item.id === sampleId
            );

        if (!sample) {
            return;
        }

        const modal =
            document.getElementById(
                "simpleHoneyEditModal"
            );

        const form =
            document.getElementById(
                "simpleHoneyEditForm"
            );

        modal.dataset.sampleId =
            sampleId;

        document.getElementById(
            "simpleHoneyEditId"
        ).textContent =
            `${sample.id} · ${sample.name || ""}`;

        const values = {
            name:
                sample.name || "",

            date:
                sample.date
                || sample.collection_date
                || "",

            region:
                sample.region || "",

            district:
                sample.district || "",

            locality:
                sample.locality || "",

            source:
                sample.source || "",

            pollen_morphotype:
                sample.pollen_morphotype || "",

            presumed_taxon:
                sample.presumed_taxon || "",

            confidence:
                sample.confidence || "",

            status:
                sample.status || "",

            notes:
                sample.notes || "",

            description:
                sample.description || ""
        };

        Object.entries(values)
            .forEach(([name, value]) => {

                if (form.elements[name]) {
                    form.elements[name].value =
                        value;
                }
            });

        modal.classList.add("open");

        document.body.classList.add(
            "simple-honey-edit-open"
        );
    }


    async function saveEdit(event) {

        event.preventDefault();

        const modal =
            document.getElementById(
                "simpleHoneyEditModal"
            );

        const sampleId =
            modal.dataset.sampleId;

        const form =
            event.currentTarget;

        const message =
            document.getElementById(
                "simpleHoneyEditMessage"
            );

        const response =
            await fetch(
                `/api/samples/${sampleId}`,
                {
                    method: "PUT",
                    body: new FormData(form)
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            message.textContent =
                result.error
                || "Ошибка сохранения";

            message.className =
                "simple-honey-edit-message error";

            return;
        }

        message.textContent =
            "✓ Изменения сохранены";

        message.className =
            "simple-honey-edit-message success";

        await loadSamples();

        setTimeout(
            () => {
                closeEditModal();
                window.location.reload();
            },
            450
        );
    }


    async function deleteSample(sampleId) {

        const sample =
            samplesCache.find(
                item => item.id === sampleId
            );

        const name =
            sample?.name
            || sampleId;

        const ok =
            window.confirm(
                `Удалить образец «${name}»?`
            );

        if (!ok) {
            return;
        }

        const response =
            await fetch(
                `/api/samples/${sampleId}`,
                {
                    method: "DELETE"
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            alert(
                result.error
                || "Не удалось удалить образец"
            );

            return;
        }

        window.location.reload();
    }


    function setupEvents() {

        document.addEventListener(
            "click",
            event => {

                const edit =
                    event.target.closest(
                        "[data-edit-sample]"
                    );

                if (edit) {

                    openEditModal(
                        edit.dataset.editSample
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

                if (
                    event.target.closest(
                        "[data-close-simple-edit]"
                    )
                ) {
                    closeEditModal();
                }
            }
        );

        document.getElementById(
            "simpleHoneyEditForm"
        ).addEventListener(
            "submit",
            saveEdit
        );

        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {
                    closeEditModal();
                }
            }
        );
    }


    function observeGallery() {

        const grid =
            document.getElementById(
                "samplesGrid"
            );

        if (!grid) {
            return;
        }

        const observer =
            new MutationObserver(() => {
                attachActions();
            });

        observer.observe(
            grid,
            {
                childList: true,
                subtree: true
            }
        );
    }


    async function init() {

        buildEditModal();

        setupEvents();

        observeGallery();

        await loadSamples();
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
