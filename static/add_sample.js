(() => {

    function buildAddSampleInterface() {

        if (
            document.getElementById(
                "addSampleModal"
            )
        ) {
            return;
        }


        /* ======================================================
           КНОПКА
           ====================================================== */

        const button =
            document.createElement(
                "button"
            );

        button.id =
            "addSampleButton";

        button.type =
            "button";

        button.className =
            "add-sample-floating-button";

        button.innerHTML = `
            <span>＋</span>
            Добавить образец
        `;

        document.body.appendChild(
            button
        );


        /* ======================================================
           МОДАЛЬНОЕ ОКНО
           ====================================================== */

        const modal =
            document.createElement("div");

        modal.id =
            "addSampleModal";

        modal.className =
            "add-sample-modal";


        modal.innerHTML = `

            <div
                class="add-sample-backdrop"
                data-close-add-sample
            ></div>


            <div class="add-sample-dialog">

                <div class="add-sample-header">

                    <div>

                        <span class="add-sample-kicker">
                            🐝 HONEYLAB
                        </span>

                        <h2>
                            Новый образец мёда
                        </h2>

                        <p>
                            Создание цифрового
                            паспорта образца
                        </p>

                    </div>


                    <button
                        type="button"
                        class="add-sample-close"
                        data-close-add-sample
                    >
                        ×
                    </button>

                </div>


                <form
                    id="addSampleForm"
                    class="add-sample-form"
                    enctype="multipart/form-data"
                >


                    <!-- ==============================
                         ОСНОВНАЯ ИНФОРМАЦИЯ
                         ============================== -->

                    <section
                        class="sample-form-section"
                    >

                        <div
                            class="sample-form-section-title"
                        >
                            <span>01</span>

                            <div>
                                <h3>
                                    Образец
                                </h3>

                                <p>
                                    Основная информация
                                    о мёде
                                </p>
                            </div>
                        </div>


                        <div
                            class="sample-form-grid"
                        >

                            <label
                                class="sample-form-field
                                       sample-form-wide"
                            >
                                <span>
                                    Название образца *
                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Например: Луговой мёд"
                                >
                            </label>


                            <label
                                class="sample-form-field"
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
                                class="sample-form-field"
                            >
                                <span>
                                    Источник
                                </span>

                                <select
                                    name="source"
                                >
                                    <option value="">
                                        Не указано
                                    </option>

                                    <option value="Пасека">
                                        Пасека
                                    </option>

                                    <option value="Частный образец">
                                        Частный образец
                                    </option>

                                    <option value="Магазин">
                                        Магазин
                                    </option>

                                    <option value="Ярмарка">
                                        Ярмарка
                                    </option>

                                    <option value="Исследовательская коллекция">
                                        Исследовательская коллекция
                                    </option>
                                </select>
                            </label>


                            <label
                                class="sample-form-field
                                       sample-form-wide"
                            >
                                <span>
                                    Описание образца
                                </span>

                                <textarea
                                    name="description"
                                    rows="3"
                                    placeholder="Цвет, консистенция, особенности упаковки и другие наблюдения"
                                ></textarea>
                            </label>

                        </div>

                    </section>


                    <!-- ==============================
                         ГЕОГРАФИЯ
                         ============================== -->

                    <section
                        class="sample-form-section"
                    >

                        <div
                            class="sample-form-section-title"
                        >
                            <span>02</span>

                            <div>
                                <h3>
                                    География
                                </h3>

                                <p>
                                    Где получен образец
                                </p>
                            </div>
                        </div>


                        <div
                            class="sample-form-grid"
                        >

                            <label
                                class="sample-form-field"
                            >
                                <span>
                                    Регион
                                </span>

                                <input
                                    type="text"
                                    name="region"
                                    placeholder="Область / край"
                                >
                            </label>


                            <label
                                class="sample-form-field"
                            >
                                <span>
                                    Район
                                </span>

                                <input
                                    type="text"
                                    name="district"
                                >
                            </label>


                            <label
                                class="sample-form-field"
                            >
                                <span>
                                    Населённый пункт
                                </span>

                                <input
                                    type="text"
                                    name="locality"
                                >
                            </label>


                            <label
                                class="sample-form-field"
                            >
                                <span>
                                    Точность координат
                                </span>

                                <select
                                    name="coordinate_type"
                                >
                                    <option value="">
                                        Неизвестно
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
                                class="sample-form-field"
                            >
                                <span>
                                    Широта
                                </span>

                                <input
                                    type="number"
                                    name="latitude"
                                    step="any"
                                    placeholder="52.12345"
                                >
                            </label>


                            <label
                                class="sample-form-field"
                            >
                                <span>
                                    Долгота
                                </span>

                                <input
                                    type="number"
                                    name="longitude"
                                    step="any"
                                    placeholder="76.12345"
                                >
                            </label>

                        </div>

                    </section>


                    <!-- ==============================
                         ФОТО МЁДА
                         ============================== -->

                    <section
                        class="sample-form-section"
                    >

                        <div
                            class="sample-form-section-title"
                        >
                            <span>03</span>

                            <div>
                                <h3>
                                    Фотографии образца
                                </h3>

                                <p>
                                    Можно выбрать
                                    сразу несколько
                                </p>
                            </div>
                        </div>


                        <label
                            class="honey-upload-zone"
                        >

                            <input
                                id="samplePhotoInput"
                                type="file"
                                name="sample_photos"
                                accept="image/*"
                                multiple
                            >

                            <div
                                class="upload-zone-icon"
                            >
                                🍯
                            </div>

                            <strong>
                                Добавить фотографии мёда
                            </strong>

                            <span>
                                Банка, этикетка,
                                внешний вид образца
                            </span>

                        </label>


                        <div
                            id="samplePhotoPreview"
                            class="upload-preview-grid"
                        ></div>

                    </section>


                    <!-- ==============================
                         МИКРОФОТО
                         ============================== -->

                    <section
                        class="sample-form-section"
                    >

                        <div
                            class="sample-form-section-title"
                        >
                            <span>04</span>

                            <div>
                                <h3>
                                    Микрофотографии
                                </h3>

                                <p>
                                    Изображения препарата
                                    под микроскопом
                                </p>
                            </div>
                        </div>


                        <label
                            class="sample-form-field
                                   sample-form-magnification"
                        >
                            <span>
                                Увеличение
                            </span>

                            <input
                                type="text"
                                name="magnification"
                                placeholder="Например: ×400"
                            >
                        </label>


                        <label
                            class="honey-upload-zone
                                   micro-upload-zone"
                        >

                            <input
                                id="microPhotoInput"
                                type="file"
                                name="microphotos"
                                accept="image/*"
                                multiple
                            >

                            <div
                                class="upload-zone-icon"
                            >
                                🔬
                            </div>

                            <strong>
                                Добавить микрофотографии
                            </strong>

                            <span>
                                Можно выбрать
                                несколько файлов
                            </span>

                        </label>


                        <div
                            id="microPhotoPreview"
                            class="upload-preview-grid"
                        ></div>

                    </section>


                    <!-- ==============================
                         ПАЛИНОЛОГИЯ
                         ============================== -->

                    <section
                        class="sample-form-section"
                    >

                        <div
                            class="sample-form-section-title"
                        >
                            <span>05</span>

                            <div>
                                <h3>
                                    Палинологическая
                                    интерпретация
                                </h3>

                                <p>
                                    Этот раздел можно
                                    заполнить позже
                                </p>
                            </div>
                        </div>


                        <div
                            class="scientific-form-note"
                        >
                            <strong>
                                Не уверены в определении?
                            </strong>

                            Не нужно угадывать.
                            Оставьте таксон пустым
                            и выберите статус
                            «Требует дальнейшего
                            исследования».
                        </div>


                        <div
                            class="sample-form-grid"
                        >

                            <label
                                class="sample-form-field"
                            >
                                <span>
                                    Наблюдаемый морфотип
                                </span>

                                <input
                                    type="text"
                                    name="pollen_morphotype"
                                    placeholder="Например: Asteraceae-like"
                                >
                            </label>


                            <label
                                class="sample-form-field"
                            >
                                <span>
                                    Предполагаемый таксон
                                </span>

                                <input
                                    type="text"
                                    name="presumed_taxon"
                                    placeholder="Можно оставить пустым"
                                >
                            </label>


                            <label
                                class="sample-form-field"
                            >
                                <span>
                                    Уровень уверенности
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
                                class="sample-form-field"
                            >
                                <span>
                                    Статус определения
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
                                class="sample-form-field
                                       sample-form-wide"
                            >
                                <span>
                                    Комментарий исследователя
                                </span>

                                <textarea
                                    name="notes"
                                    rows="4"
                                    placeholder="Что наблюдалось и что необходимо проверить дополнительно"
                                ></textarea>
                            </label>

                        </div>

                    </section>


                    <div
                        id="addSampleMessage"
                        class="add-sample-message"
                    ></div>


                    <div
                        class="add-sample-actions"
                    >

                        <button
                            type="button"
                            class="add-sample-cancel"
                            data-close-add-sample
                        >
                            Отмена
                        </button>


                        <button
                            id="saveSampleButton"
                            type="submit"
                            class="add-sample-save"
                        >
                            🍯 Сохранить паспорт
                        </button>

                    </div>

                </form>

            </div>
        `;


        document.body.appendChild(
            modal
        );


        setupAddSampleEvents();
    }


    /* ======================================================
       ФОТО-ПРЕВЬЮ
       ====================================================== */

    function setupPhotoPreview(
        inputId,
        previewId
    ) {

        const input =
            document.getElementById(
                inputId
            );

        const preview =
            document.getElementById(
                previewId
            );


        input.addEventListener(
            "change",
            () => {

                preview.innerHTML = "";

                [...input.files]
                    .forEach(
                        (file, index) => {

                            const url =
                                URL.createObjectURL(
                                    file
                                );

                            const card =
                                document.createElement(
                                    "div"
                                );

                            card.className =
                                "upload-preview-card";

                            card.innerHTML = `

                                <img
                                    src="${url}"
                                    alt=""
                                >

                                <span>
                                    ${index + 1}
                                </span>

                            `;

                            preview.appendChild(
                                card
                            );
                        }
                    );
            }
        );
    }


    /* ======================================================
       СОБЫТИЯ
       ====================================================== */

    function setupAddSampleEvents() {

        const modal =
            document.getElementById(
                "addSampleModal"
            );

        const button =
            document.getElementById(
                "addSampleButton"
            );

        const form =
            document.getElementById(
                "addSampleForm"
            );

        const saveButton =
            document.getElementById(
                "saveSampleButton"
            );

        const message =
            document.getElementById(
                "addSampleMessage"
            );


        function openModal() {
            modal.classList.add(
                "open"
            );

            document.body.classList.add(
                "sample-form-open"
            );
        }


        function closeModal() {
            modal.classList.remove(
                "open"
            );

            document.body.classList.remove(
                "sample-form-open"
            );
        }


        button.addEventListener(
            "click",
            openModal
        );


        modal
            .querySelectorAll(
                "[data-close-add-sample]"
            )
            .forEach(
                element => {

                    element.addEventListener(
                        "click",
                        closeModal
                    );
                }
            );


        setupPhotoPreview(
            "samplePhotoInput",
            "samplePhotoPreview"
        );

        setupPhotoPreview(
            "microPhotoInput",
            "microPhotoPreview"
        );


        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                message.className =
                    "add-sample-message";

                message.textContent = "";

                saveButton.disabled =
                    true;

                saveButton.textContent =
                    "Сохраняем паспорт…";


                try {

                    const formData =
                        new FormData(
                            form
                        );


                    const response =
                        await fetch(
                            "/api/samples",
                            {
                                method: "POST",
                                body: formData
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.error
                            || "Не удалось сохранить образец"
                        );
                    }


                    message.className =
                        "add-sample-message success";

                    message.innerHTML = `

                        ✓ Паспорт
                        <strong>
                            ${result.sample.id}
                        </strong>
                        создан.

                        Обновляем HoneyLab…

                    `;


                    setTimeout(
                        () => {
                            window.location.reload();
                        },
                        1100
                    );


                } catch (error) {

                    message.className =
                        "add-sample-message error";

                    message.textContent =
                        error.message;

                    saveButton.disabled =
                        false;

                    saveButton.textContent =
                        "🍯 Сохранить паспорт";
                }
            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                    && modal.classList
                        .contains("open")
                ) {
                    closeModal();
                }
            }
        );
    }


    /* ======================================================
       ЗАПУСК
       ====================================================== */

    function init() {
        buildAddSampleInterface();
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
