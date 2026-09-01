(() => {

    let currentSamples = [];
    let editingSampleId = null;


    /* ==========================================================
       ОБНОВЛЕНИЕ ВСЕГО ИНТЕРФЕЙСА
       ========================================================== */

    async function refreshHoneyLabSamples() {

        try {

            const response =
                await fetch(
                    "/api/samples",
                    {
                        cache: "no-store"
                    }
                );

            const data =
                await response.json();

            currentSamples =
                Array.isArray(data)
                    ? data
                    : [];


            if (
                typeof window.renderSamples
                === "function"
            ) {
                window.renderSamples(
                    currentSamples
                );
            }


            if (
                typeof window.updateStats
                === "function"
            ) {
                window.updateStats(
                    currentSamples
                );
            }


            if (
                typeof window.renderMarkers
                === "function"
            ) {
                window.renderMarkers(
                    currentSamples
                );
            }


            addManagementButtons();

        } catch (error) {

            console.error(
                "Не удалось обновить образцы:",
                error
            );
        }
    }


    /* ==========================================================
       КНОПКИ РЕДАКТИРОВАТЬ / УДАЛИТЬ
       ========================================================== */

    function addManagementButtons() {

        const cards =
            document.querySelectorAll(
                ".sample-card"
            );


        cards.forEach(card => {

            if (
                card.querySelector(
                    ".sample-management-actions"
                )
            ) {
                return;
            }


            const idElement =
                card.querySelector(
                    ".sample-number"
                );

            if (!idElement) {
                return;
            }


            const sampleId =
                idElement.textContent.trim();


            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "sample-management-actions";


            actions.innerHTML = `

                <button
                    type="button"
                    class="sample-edit-button"
                    data-edit-sample="${sampleId}"
                >
                    ✏ Редактировать
                </button>

                <button
                    type="button"
                    class="sample-delete-button"
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

                card.appendChild(
                    actions
                );
            }
        });
    }


    /* ==========================================================
       МОДАЛЬНОЕ ОКНО
       ========================================================== */

    function buildManagerModal() {

        if (
            document.getElementById(
                "sampleEditModal"
            )
        ) {
            return;
        }


        const modal =
            document.createElement(
                "div"
            );

        modal.id =
            "sampleEditModal";

        modal.className =
            "sample-edit-modal";


        modal.innerHTML = `

            <div
                class="sample-edit-backdrop"
                data-close-editor
            ></div>


            <div
                class="sample-edit-dialog"
            >

                <div
                    class="sample-edit-header"
                >

                    <div>

                        <span
                            class="sample-edit-kicker"
                        >
                            🐝 HONEYLAB
                        </span>

                        <h2>
                            Редактирование паспорта
                        </h2>

                        <p
                            id="editingSampleNumber"
                        ></p>

                    </div>


                    <button
                        type="button"
                        class="sample-edit-close"
                        data-close-editor
                    >
                        ×
                    </button>

                </div>


                <form
                    id="sampleEditForm"
                    class="sample-edit-form"
                    enctype="multipart/form-data"
                >

                    <div
                        class="sample-edit-grid"
                    >

                        <label
                            class="manager-field
                                   manager-wide"
                        >
                            <span>
                                Название *
                            </span>

                            <input
                                name="name"
                                required
                            >
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Дата
                            </span>

                            <input
                                type="date"
                                name="date"
                            >
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Источник
                            </span>

                            <input
                                name="source"
                                placeholder="Пасека, магазин..."
                            >
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Регион
                            </span>

                            <input
                                name="region"
                            >
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Район
                            </span>

                            <input
                                name="district"
                            >
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Населённый пункт
                            </span>

                            <input
                                name="locality"
                            >
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Точность координат
                            </span>

                            <select
                                name="coordinate_type"
                            >
                                <option value="">
                                    Не указано
                                </option>

                                <option value="exact_apiary">
                                    Точная координата пасеки
                                </option>

                                <option value="approximate_locality">
                                    Приблизительно — населённый пункт
                                </option>

                                <option value="region_center">
                                    Только регион
                                </option>
                            </select>
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Широта
                            </span>

                            <input
                                type="number"
                                step="any"
                                name="latitude"
                            >
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Долгота
                            </span>

                            <input
                                type="number"
                                step="any"
                                name="longitude"
                            >
                        </label>


                        <label
                            class="manager-field
                                   manager-wide"
                        >
                            <span>
                                Описание образца
                            </span>

                            <textarea
                                name="description"
                                rows="3"
                            ></textarea>
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Наблюдаемый морфотип
                            </span>

                            <input
                                name="pollen_morphotype"
                            >
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Предполагаемый таксон
                            </span>

                            <input
                                name="presumed_taxon"
                            >
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Уверенность
                            </span>

                            <select
                                name="confidence"
                            >
                                <option value="">
                                    Не оценено
                                </option>

                                <option value="Низкая">
                                    Низкая
                                </option>

                                <option value="Средняя">
                                    Средняя
                                </option>

                                <option value="Средне-высокая">
                                    Средне-высокая
                                </option>

                                <option value="Высокая">
                                    Высокая
                                </option>
                            </select>
                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Статус
                            </span>

                            <select
                                name="status"
                            >
                                <option
                                    value="Требует дальнейшего исследования"
                                >
                                    Требует дальнейшего исследования
                                </option>

                                <option
                                    value="Предварительно определён морфотип"
                                >
                                    Предварительно определён морфотип
                                </option>

                                <option
                                    value="Таксон требует подтверждения"
                                >
                                    Таксон требует подтверждения
                                </option>

                                <option
                                    value="Подтверждено на уровне морфотипа"
                                >
                                    Подтверждено на уровне морфотипа
                                </option>
                            </select>
                        </label>


                        <label
                            class="manager-field
                                   manager-wide"
                        >
                            <span>
                                Комментарий исследователя
                            </span>

                            <textarea
                                name="notes"
                                rows="4"
                            ></textarea>
                        </label>


                        <label
                            class="manager-upload
                                   manager-wide"
                        >

                            <input
                                type="file"
                                name="sample_photos"
                                multiple
                                accept="image/*"
                            >

                            <strong>
                                🍯 Добавить ещё фото мёда
                            </strong>

                            <small>
                                Уже сохранённые фотографии
                                останутся в паспорте
                            </small>

                        </label>


                        <label
                            class="manager-field"
                        >
                            <span>
                                Увеличение новых микрофото
                            </span>

                            <input
                                name="magnification"
                                placeholder="×400"
                            >
                        </label>


                        <label
                            class="manager-upload"
                        >

                            <input
                                type="file"
                                name="microphotos"
                                multiple
                                accept="image/*"
                            >

                            <strong>
                                🔬 Добавить микрофото
                            </strong>

                        </label>

                    </div>


                    <div
                        id="sampleEditMessage"
                        class="sample-edit-message"
                    ></div>


                    <div
                        class="sample-edit-actions"
                    >

                        <button
                            type="button"
                            class="sample-editor-cancel"
                            data-close-editor
                        >
                            Отмена
                        </button>

                        <button
                            id="saveSampleChanges"
                            type="submit"
                            class="sample-editor-save"
                        >
                            Сохранить изменения
                        </button>

                    </div>

                </form>

            </div>
        `;


        document.body.appendChild(
            modal
        );
    }


    /* ==========================================================
       ОТКРЫТЬ РЕДАКТОР
       ========================================================== */

    function openEditor(sampleId) {

        const sample =
            currentSamples.find(
                item =>
                    item.id === sampleId
            );

        if (!sample) {
            return;
        }


        editingSampleId =
            sampleId;


        const modal =
            document.getElementById(
                "sampleEditModal"
            );

        const form =
            document.getElementById(
                "sampleEditForm"
            );


        document.getElementById(
            "editingSampleNumber"
        ).textContent =
            `${sample.id} · ${sample.name || ""}`;


        const setValue =
            (name, value) => {

                const field =
                    form.elements[name];

                if (field) {
                    field.value =
                        value ?? "";
                }
            };


        setValue(
            "name",
            sample.name
        );

        setValue(
            "date",
            sample.date
            || sample.collection_date
            || ""
        );

        setValue(
            "source",
            sample.source
            || ""
        );

        setValue(
            "region",
            sample.region
            || ""
        );

        setValue(
            "district",
            sample.district
            || ""
        );

        setValue(
            "locality",
            sample.locality
            || ""
        );

        setValue(
            "coordinate_type",
            sample.coordinate_type
            || ""
        );

        setValue(
            "latitude",
            sample.latitude
            ?? ""
        );

        setValue(
            "longitude",
            sample.longitude
            ?? ""
        );

        setValue(
            "description",
            sample.description
            || ""
        );

        setValue(
            "pollen_morphotype",
            sample.pollen_morphotype
            || ""
        );

        setValue(
            "presumed_taxon",
            sample.presumed_taxon
            || ""
        );

        setValue(
            "confidence",
            sample.confidence
            || ""
        );

        setValue(
            "status",
            sample.status
            || "Требует дальнейшего исследования"
        );

        setValue(
            "notes",
            sample.notes
            || ""
        );


        document.getElementById(
            "sampleEditMessage"
        ).textContent = "";


        modal.classList.add("open");

        document.body.classList.add(
            "sample-manager-open"
        );
    }


    function closeEditor() {

        const modal =
            document.getElementById(
                "sampleEditModal"
            );

        modal.classList.remove("open");

        document.body.classList.remove(
            "sample-manager-open"
        );

        editingSampleId = null;
    }


    /* ==========================================================
       СОХРАНИТЬ РЕДАКТИРОВАНИЕ
       ========================================================== */

    async function submitEdit(event) {

        event.preventDefault();

        if (!editingSampleId) {
            return;
        }


        const form =
            event.currentTarget;

        const button =
            document.getElementById(
                "saveSampleChanges"
            );

        const message =
            document.getElementById(
                "sampleEditMessage"
            );


        button.disabled = true;

        button.textContent =
            "Сохраняем…";


        try {

            const response =
                await fetch(
                    `/api/samples/${editingSampleId}`,
                    {
                        method: "PUT",
                        body: new FormData(form)
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    result.error
                    || "Не удалось сохранить изменения"
                );
            }


            message.className =
                "sample-edit-message success";

            message.textContent =
                "✓ Изменения сохранены";


            await refreshHoneyLabSamples();


            setTimeout(
                closeEditor,
                450
            );


        } catch (error) {

            message.className =
                "sample-edit-message error";

            message.textContent =
                error.message;

        } finally {

            button.disabled = false;

            button.textContent =
                "Сохранить изменения";
        }
    }


    /* ==========================================================
       УДАЛИТЬ
       ========================================================== */

    async function deleteSample(sampleId) {

        const sample =
            currentSamples.find(
                item =>
                    item.id === sampleId
            );


        const name =
            sample?.name
            || sampleId;


        const confirmed =
            window.confirm(
                `Удалить образец «${name}»?\n\n`
                +
                "Запись будет удалена из HoneyLab."
            );


        if (!confirmed) {
            return;
        }


        try {

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
                throw new Error(
                    result.error
                    || "Не удалось удалить образец"
                );
            }


            await refreshHoneyLabSamples();


        } catch (error) {

            alert(
                error.message
            );
        }
    }


    /* ==========================================================
       СОБЫТИЯ
       ========================================================== */

    function setupEvents() {

        document.addEventListener(
            "click",
            event => {

                const edit =
                    event.target.closest(
                        "[data-edit-sample]"
                    );

                if (edit) {

                    openEditor(
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
                        "[data-close-editor]"
                    )
                ) {
                    closeEditor();
                }
            }
        );


        document.getElementById(
            "sampleEditForm"
        ).addEventListener(
            "submit",
            submitEdit
        );


        window.addEventListener(
            "honeylab:samples-changed",
            refreshHoneyLabSamples
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {
                    closeEditor();
                }
            }
        );
    }


    /* ==========================================================
       СЛЕДИМ ЗА ПЕРЕРИСОВКОЙ УЛЬЯ
       ========================================================== */

    function observeGallery() {

        const grid =
            document.getElementById(
                "samplesGrid"
            );

        if (!grid) {
            return;
        }


        const observer =
            new MutationObserver(
                () => {

                    setTimeout(
                        addManagementButtons,
                        0
                    );
                }
            );


        observer.observe(
            grid,
            {
                childList: true,
                subtree: true
            }
        );
    }


    /* ==========================================================
       INIT
       ========================================================== */

    async function init() {

        buildManagerModal();

        setupEvents();

        observeGallery();

        await refreshHoneyLabSamples();
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
