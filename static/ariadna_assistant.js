(() => {

    const FAQ = [
        {
            group: "Об Ариадне",
            question: "Кто вы?",
            answer:
                "Меня зовут Ариадна. Я ученица 8 «Г» класса КГУ «Школа-лицей №8 для одарённых детей». Я разработала HoneyLab как цифровой проект, который помогает систематизировать исследование мёда и его пыльцевого состава."
        },
        {
            group: "Об Ариадне",
            question: "Почему вам интересна тема мёда?",
            answer:
                "Мне стало интересно, сколько информации может храниться в обычном образце мёда. Под микроскопом можно увидеть пыльцевые зёрна и другие частицы, а потом попытаться понять, с какими растениями и территориями они связаны."
        },
        {
            group: "Об Ариадне",
            question: "Почему вы решили сделать сайт?",
            answer:
                "Во время исследования накапливается много фотографий, микрофотографий, подписей, географических данных и выводов. Мне захотелось объединить всё это в одном месте — так появилась идея цифрового паспорта HoneyLab."
        },
        {
            group: "Об Ариадне",
            question: "Что вы делаете в свободное время?",
            answer:
                "В свободное время мне нравится заниматься исследовательскими и цифровыми проектами, изучать биологию, работать с визуальными материалами и придумывать, как научную информацию можно представить понятно и интересно."
        },
        {
            group: "Об Ариадне",
            question: "Что было самым сложным в проекте?",
            answer:
                "Самым сложным оказалось не просто сделать сайт, а правильно интерпретировать микрофотографии. Очень легко увидеть сходство и слишком быстро назвать растение. Поэтому в HoneyLab появились уровни уверенности и статус «требует дальнейшего исследования»."
        },
        {
            group: "Об Ариадне",
            question: "Что вам больше всего нравится в HoneyLab?",
            answer:
                "Мне нравится, что каждый образец здесь превращается в маленькую историю исследования: от банки с мёдом до изображения под микроскопом и научного заключения."
        },
        {
            group: "Об Ариадне",
            question: "Хотите развивать проект дальше?",
            answer:
                "Да. Мне хотелось бы, чтобы в будущем исследователи могли добавлять свои образцы, сравнивать результаты, формировать отчёты и создавать общую коллекцию микрофотографий."
        },

        {
            group: "О HoneyLab",
            question: "Что такое HoneyLab?",
            answer:
                "HoneyLab — цифровая платформа для создания паспортов образцов мёда и документирования результатов мелиссопалинологического исследования."
        },
        {
            group: "О HoneyLab",
            question: "Что входит в паспорт мёда?",
            answer:
                "В паспорт могут входить название образца, код, география, фотографии самого мёда, микрофотографии, наблюдаемые морфотипы, уровень уверенности, комментарии и итоговое заключение."
        },
        {
            group: "О HoneyLab",
            question: "Почему в паспорте есть фото банки?",
            answer:
                "Фотография банки помогает связать лабораторные данные с реальным физическим образцом. Можно видеть внешний вид мёда, цвет, упаковку и маркировку."
        },
        {
            group: "О HoneyLab",
            question: "Можно ли добавить несколько фотографий?",
            answer:
                "Да. Один паспорт может содержать несколько обычных фотографий образца и отдельно несколько микрофотографий."
        },
        {
            group: "О HoneyLab",
            question: "HoneyLab сам определяет растение?",
            answer:
                "Нет. Сейчас платформа не заменяет специалиста. Она помогает хранить наблюдения, изображения и научную интерпретацию, а также честно показывать уровень уверенности."
        },
        {
            group: "О HoneyLab",
            question: "Почему некоторые таксоны не определены?",
            answer:
                "Потому что на снимке может быть недостаточно диагностических признаков. В таком случае правильнее сохранить морфотип или описание объекта, чем давать неподтверждённое название."
        },
        {
            group: "О HoneyLab",
            question: "Зачем нужна карта?",
            answer:
                "Карта помогает видеть географический контекст образцов. Пыльцевой спектр связан с растительностью территории, поэтому происхождение образца важно для интерпретации."
        },

        {
            group: "Пыльца и мёд",
            question: "Что такое мелиссопалинология?",
            answer:
                "Мелиссопалинология — направление палинологии, в котором исследуют пыльцу, содержащуюся в мёде и других продуктах пчеловодства."
        },
        {
            group: "Пыльца и мёд",
            question: "Почему в мёде находится пыльца?",
            answer:
                "Когда пчёлы посещают цветки и собирают нектар, часть пыльцевых зёрен может попадать в собираемый материал и затем сохраняться в мёде."
        },
        {
            group: "Пыльца и мёд",
            question: "Что можно узнать по пыльце?",
            answer:
                "Пыльцевой состав используют для изучения ботанического происхождения мёда, а вместе с географическим контекстом он может давать информацию и о территории медосбора."
        },
        {
            group: "Пыльца и мёд",
            question: "Что такое пыльцевой спектр?",
            answer:
                "Это совокупность пыльцевых типов, обнаруженных в образце, и их относительная представленность."
        },
        {
            group: "Пыльца и мёд",
            question: "Что такое монофлорный мёд?",
            answer:
                "Это мёд, происхождение которого преимущественно связано с одним основным растением-медоносом. Но даже в таком мёде могут присутствовать пыльцевые зёрна других растений."
        },
        {
            group: "Пыльца и мёд",
            question: "Что такое полифлорный мёд?",
            answer:
                "Полифлорный мёд формируется из нектара нескольких растений и обычно имеет более разнообразный пыльцевой спектр."
        },
        {
            group: "Пыльца и мёд",
            question: "Если нашли одно зерно растения, это значит что мёд из него?",
            answer:
                "Нет. Одного зерна недостаточно. Нужно учитывать весь пыльцевой спектр и относительную представленность разных пыльцевых типов."
        },
        {
            group: "Пыльца и мёд",
            question: "Почему одного микроснимка недостаточно?",
            answer:
                "Одна микрофотография показывает только очень маленький участок препарата. Для более надёжного вывода нужно просматривать много полей зрения."
        },

        {
            group: "Методика",
            question: "Как готовят мёд для анализа?",
            answer:
                "Обычно определённую массу мёда растворяют в воде, затем используют центрифугирование, чтобы получить осадок с микроскопическими частицами и пыльцевыми зёрнами."
        },
        {
            group: "Методика",
            question: "Зачем центрифугировать раствор мёда?",
            answer:
                "Центрифугирование помогает сконцентрировать пыльцевые зёрна и другие микроскопические частицы в осадке."
        },
        {
            group: "Методика",
            question: "Почему нужно смотреть много полей зрения?",
            answer:
                "Чтобы результат не зависел от одного случайного участка препарата. Чем систематичнее просмотр, тем надёжнее вывод."
        },
        {
            group: "Методика",
            question: "Как определяют неизвестную пыльцу?",
            answer:
                "Оценивают форму, размеры, поверхность оболочки, апертуры и другие признаки, а затем сравнивают объект с эталонными препаратами, атласами и научными источниками."
        },
        {
            group: "Методика",
            question: "Почему нужен масштаб изображения?",
            answer:
                "Размер пыльцевого зерна является одним из диагностических признаков. Без масштаба сравнительная интерпретация становится менее надёжной."
        },

        {
            group: "Научный подход",
            question: "Почему HoneyLab показывает неопределённость?",
            answer:
                "Потому что научный результат должен отражать реальные данные. Если определение не доказано, лучше прямо показать это, чем создавать ложную точность."
        },
        {
            group: "Научный подход",
            question: "Неопределённый результат — это ошибка?",
            answer:
                "Нет. Такой результат показывает границы имеющихся данных и помогает понять, что нужно сделать дальше."
        },
        {
            group: "Научный подход",
            question: "Можно ли потом изменить определение?",
            answer:
                "Да. Если появляются новые микрофотографии, измерения или эталонный материал, предварительное заключение можно уточнить."
        },
        {
            group: "Научный подход",
            question: "Зачем хранить исходные микрофотографии?",
            answer:
                "Они позволяют повторно проверить интерпретацию и показать, на каком материале было сделано заключение."
        }
    ];


    function escapeHtml(value) {
        const div = document.createElement("div");
        div.textContent = value || "";
        return div.innerHTML;
    }


    /* ==========================================================
       СОЗДАНИЕ ЧАТА
       ========================================================== */

    function buildAriadnaChat() {

        if (document.getElementById("ariadnaChat")) {
            return;
        }

        const widget = document.createElement("div");

        widget.id = "ariadnaChat";
        widget.className = "ariadna-chat";

        widget.innerHTML = `

            <button
                id="ariadnaChatLauncher"
                type="button"
                class="ariadna-chat-launcher"
            >
                <div class="launcher-avatar">
                    <img
                        src="/static/images/developer/ariadna.jpeg"
                        alt="Ариадна"
                    >
                    <span class="launcher-online"></span>
                </div>

                <div class="launcher-copy">
                    <strong>Спросить Ариадну</strong>
                    <span>консультант HoneyLab</span>
                </div>

                <span class="launcher-bubble">💬</span>
            </button>


            <div
                id="ariadnaChatPanel"
                class="ariadna-chat-panel"
            >

                <div class="ariadna-chat-header">

                    <div class="chat-profile">

                        <div class="chat-avatar">
                            <img
                                src="/static/images/developer/ariadna.jpeg"
                                alt="Ариадна"
                            >
                            <span></span>
                        </div>

                        <div>
                            <strong>Ариадна</strong>
                            <small>автор HoneyLab</small>
                        </div>

                    </div>

                    <button
                        id="closeAriadnaChat"
                        type="button"
                        class="ariadna-chat-close"
                    >
                        ×
                    </button>

                </div>


                <div
                    id="ariadnaChatBody"
                    class="ariadna-chat-body"
                >

                    <div class="chat-message chat-message-ariadna">

                        <img
                            src="/static/images/developer/ariadna.jpeg"
                            alt="Ариадна"
                        >

                        <div>
                            <strong>Ариадна</strong>

                            <p>
                                Привет! 🐝
                                Я Ариадна, автор HoneyLab.
                                Выберите вопрос, и я постараюсь
                                рассказать о проекте,
                                пыльце и мёде.
                            </p>
                        </div>

                    </div>


                    <div class="chat-help-title">
                        О чём хотите спросить?
                    </div>

                    <div
                        id="ariadnaQuestionGroups"
                        class="ariadna-question-groups"
                    ></div>

                    <div
                        id="ariadnaQuestionList"
                        class="ariadna-question-list"
                    ></div>

                    <div
                        id="ariadnaConversation"
                        class="ariadna-conversation"
                    ></div>

                </div>

            </div>
        `;

        document.body.appendChild(widget);

        setupChatBehaviour();
        renderGroups();
    }


    function setupChatBehaviour() {

        const panel =
            document.getElementById("ariadnaChatPanel");

        const launcher =
            document.getElementById("ariadnaChatLauncher");

        const close =
            document.getElementById("closeAriadnaChat");


        launcher.addEventListener(
            "click",
            () => {
                panel.classList.add("open");
                launcher.classList.add("hidden");
            }
        );


        close.addEventListener(
            "click",
            () => {
                panel.classList.remove("open");
                launcher.classList.remove("hidden");
            }
        );


        const profileButton =
            document.getElementById(
                "openAriadnaChatFromProfile"
            );

        if (profileButton) {

            profileButton.addEventListener(
                "click",
                () => {
                    panel.classList.add("open");
                    launcher.classList.add("hidden");
                }
            );
        }
    }


    /* ==========================================================
       КАТЕГОРИИ
       ========================================================== */

    function renderGroups() {

        const area =
            document.getElementById(
                "ariadnaQuestionGroups"
            );

        const groups =
            [...new Set(
                FAQ.map(item => item.group)
            )];


        area.innerHTML =
            groups.map(group => `

                <button
                    type="button"
                    class="chat-group-button"
                    data-group="${escapeHtml(group)}"
                >
                    ${escapeHtml(group)}
                </button>

            `).join("");


        area
            .querySelectorAll("[data-group]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        area
                            .querySelectorAll(
                                ".chat-group-button"
                            )
                            .forEach(item =>
                                item.classList.remove(
                                    "active"
                                )
                            );

                        button.classList.add("active");

                        renderQuestions(
                            button.dataset.group
                        );
                    }
                );
            });


        const first =
            area.querySelector("[data-group]");

        if (first) {

            first.classList.add("active");

            renderQuestions(
                first.dataset.group
            );
        }
    }


    /* ==========================================================
       ВОПРОСЫ
       ========================================================== */

    function renderQuestions(group) {

        const list =
            document.getElementById(
                "ariadnaQuestionList"
            );

        const questions =
            FAQ
                .map((item, index) => ({
                    ...item,
                    index
                }))
                .filter(
                    item =>
                        item.group === group
                );


        list.innerHTML =
            questions.map(item => `

                <button
                    type="button"
                    class="ariadna-question-button"
                    data-question-index="${item.index}"
                >
                    <span>
                        ${escapeHtml(item.question)}
                    </span>

                    <span>→</span>
                </button>

            `).join("");


        list
            .querySelectorAll(
                "[data-question-index]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        askAriadna(
                            Number(
                                button.dataset.questionIndex
                            )
                        );
                    }
                );
            });
    }


    /* ==========================================================
       ЭФФЕКТ "АРИАДНА ПЕЧАТАЕТ"
       ========================================================== */

    function askAriadna(index) {

        const item = FAQ[index];

        if (!item) {
            return;
        }

        const conversation =
            document.getElementById(
                "ariadnaConversation"
            );

        const body =
            document.getElementById(
                "ariadnaChatBody"
            );


        /*
           Сообщение пользователя
        */

        const userMessage =
            document.createElement("div");

        userMessage.className =
            "chat-user-message";

        userMessage.innerHTML = `
            <div>
                ${escapeHtml(item.question)}
            </div>
        `;

        conversation.appendChild(
            userMessage
        );


        /*
           Индикатор "Ариадна печатает..."
        */

        const typing =
            document.createElement("div");

        typing.className =
            "chat-message chat-message-ariadna ariadna-typing-message";

        typing.innerHTML = `

            <img
                src="/static/images/developer/ariadna.jpeg"
                alt="Ариадна"
            >

            <div class="typing-bubble">

                <strong>
                    Ариадна печатает
                </strong>

                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>
        `;

        conversation.appendChild(
            typing
        );


        scrollChatToBottom(body);


        /*
           Задержка зависит от длины ответа,
           чтобы выглядело естественнее.
        */

        const delay =
            Math.min(
                2200,
                Math.max(
                    900,
                    item.answer.length * 4
                )
            );


        setTimeout(
            () => {

                typing.remove();


                const answer =
                    document.createElement("div");

                answer.className =
                    "chat-message chat-message-ariadna answer-message";

                answer.innerHTML = `

                    <img
                        src="/static/images/developer/ariadna.jpeg"
                        alt="Ариадна"
                    >

                    <div>

                        <strong>
                            Ариадна
                        </strong>

                        <p>
                            ${escapeHtml(item.answer)}
                        </p>

                    </div>
                `;


                conversation.appendChild(
                    answer
                );


                scrollChatToBottom(body);

            },
            delay
        );
    }


    function scrollChatToBottom(body) {

        requestAnimationFrame(
            () => {

                body.scrollTo({
                    top: body.scrollHeight,
                    behavior: "smooth"
                });
            }
        );
    }


    /* ==========================================================
       ЗАПУСК
       ========================================================== */

    function init() {
        buildAriadnaChat();
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
