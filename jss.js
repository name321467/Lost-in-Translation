// Функция для переворота карточки
function flipCard(button) {
    // Находим ближайший родительский элемент с классом 'card'
    const card = button.closest('.card');
    // Добавляем или убираем класс 'flipped'
    card.classList.toggle('flipped');
}

/// База данных всех идиом - 6 штук
const quizDatabase = [
    {
        idiom: "No pain, no gain",
        question: "Что означает 'No pain, no gain'?",
        options: [
            "Без усилий и трудностей не будет результата",
            "Боль проходит со временем",
            "Нужно терпеть физическую боль"
        ],
        correct: 0
    },
    {
        idiom: "On cloud nine",
        question: "Что означает 'On cloud nine'?",
        options: [
            "На седьмом небе от счастья",
            "Чувствовать огромную радость и счастье",
            "На девятом небе от счастья"
        ],
        correct: 2
    },
    {
        idiom: "Hit the road",
        question: "Что означает 'Hit the road'?",
        options: [
            "Ударить по дороге",
            "Попасть в аварию",
            "Резко тронуться, уехать"
        ],
        correct: 2
    },
    {
        idiom: "Cool as a cucumber",
        question: "Что означает 'Cool as a cucumber'?",
        options: [
            "Спокойный, как удав (невозмутимый)",
            "Холодный человек",
            "Свежий как огурец"
        ],
        correct: 0
    },
    {
        idiom: "Fall in love",
        question: "Что означает 'Fall in love'?",
        options: [
            "Упасть от любви",
            "Начать испытывать сильное чувство любви",
            "Влюбиться"
        ],
        correct: 2
    },
    {
        idiom: "Spill the tea",
        question: "Что означает 'Spill the tea'?",
        options: [
            "Пролить чай на стол",
            "Устроить чаепитие",
            "Рассказать сплетни или секретную информацию"
        ],
        correct: 2
    }
];

// Текущий набор вопросов (4 из 6)
let currentQuiz = [];
let userAnswers = {}; // Хранит ответы пользователя

// Функция для переворота карточки
function flipCard(button) {
    const card = button.closest('.card');
    card.classList.toggle('flipped');
}

// Функция для перемешивания массива (алгоритм Фишера-Йейтса)
function shuffle(array) {
    // Создаем копию массива, чтобы не изменять оригинал
    const shuffled = [...array];

    // Проходим по массиву с конца
    for (let i = shuffled.length - 1; i > 0; i--) {
        // Выбираем случайный индекс от 0 до i
        const j = Math.floor(Math.random() * (i + 1));
        // Меняем местами элементы i и j
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

// Функция выбора 4 случайных вопросов из базы 6
function selectRandomQuestions() {
    // Перемешиваем всю базу
    const shuffled = shuffle(quizDatabase);

    // Берем только первые 4 вопроса
    const selected = shuffled.slice(0, 4);

    // Перемешиваем варианты ответов в каждом вопросе
    return selected.map(item => {
        const options = [...item.options];
        const correctOption = options[item.correct];

        // Перемешиваем варианты
        const shuffledOptions = shuffle(options);

        // Находим новый индекс правильного ответа
        const newCorrectIndex = shuffledOptions.indexOf(correctOption);

        return {
            ...item,
            options: shuffledOptions,
            correct: newCorrectIndex
        };
    });
}

// Функция для генерации HTML вопросов
function generateQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = ''; // Очищаем контейнер
    userAnswers = {}; // Сбрасываем ответы

    // Выбираем 4 случайных вопроса
    currentQuiz = selectRandomQuestions();

    // Создаем каждый вопрос
    currentQuiz.forEach((item, questionIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.setAttribute('data-question-index', questionIndex);
        questionDiv.setAttribute('data-correct', item.correct);

        // HTML для вопроса
        let optionsHTML = '';
        item.options.forEach((option, optionIndex) => {
            optionsHTML += `
                <div class="option" onclick="selectOption(${questionIndex}, ${optionIndex}, this)">
                    ${option}
                </div>
            `;
        });

        questionDiv.innerHTML = `
            <h3>${questionIndex + 1}. ${item.question}</h3>
            <div class="options">
                ${optionsHTML}
            </div>
        `;

        container.appendChild(questionDiv);
    });

    // Скрываем кнопки и результат
    document.getElementById('check-btn').style.display = 'none';
    document.getElementById('shuffle-btn').style.display = 'none';
    document.getElementById('quiz-result').className = '';
    document.getElementById('quiz-result').style.display = 'none';
}

// Функция выбора варианта ответа
function selectOption(questionIndex, optionIndex, element) {
    // Находим все варианты в этом вопросе
    const question = element.closest('.question');
    const options = question.querySelectorAll('.option');

    // Убираем класс 'selected' у всех вариантов
    options.forEach(opt => opt.classList.remove('selected'));

    // Добавляем класс 'selected' к выбранному варианту
    element.classList.add('selected');

    // Сохраняем ответ пользователя
    userAnswers[questionIndex] = optionIndex;

    // Если все 4 вопроса отвечены, показываем кнопку "Проверить"
    if (Object.keys(userAnswers).length === currentQuiz.length) {
        document.getElementById('check-btn').style.display = 'inline-block';
    }
}

// Функция проверки ответов
function checkQuiz() {
    let correctCount = 0;
    const total = currentQuiz.length;

    // Проверяем каждый вопрос
    currentQuiz.forEach((item, questionIndex) => {
        const question = document.querySelector(`[data-question-index="${questionIndex}"]`);
        const options = question.querySelectorAll('.option');
        const correctAnswer = item.correct;
        const userAnswer = userAnswers[questionIndex];

        // Помечаем варианты ответов
        options.forEach((option, optionIndex) => {
            // Показываем правильный ответ зеленым
            if (optionIndex === correctAnswer) {
                option.classList.add('correct');
            }

            // Если пользователь выбрал неправильный ответ, помечаем красным
            if (optionIndex === userAnswer && userAnswer !== correctAnswer) {
                option.classList.add('wrong');
            }

            // Отключаем возможность кликать на варианты
            option.style.cursor = 'not-allowed';
            option.onclick = null;
        });

        // Считаем правильные ответы
        if (userAnswer === correctAnswer) {
            correctCount++;
        }
    });

    // Показываем результат
    const resultDiv = document.getElementById('quiz-result');
    const percentage = (correctCount / total) * 100;

    resultDiv.style.display = 'block';
    resultDiv.classList.add('show');

    const imgPath = 'emoji/';

    if (percentage === 100) {
        resultDiv.className = 'good show';
        // 🎉 -> 1f389.png
        resultDiv.innerHTML = `<img src="${imgPath}1f389.png" class="emoji-icon" alt="🎉"> Отлично! Вы ответили правильно на все ${total} вопроса!`;
    } else if (percentage >= 75) {
        resultDiv.className = 'good show';
        // 👍 -> 1f44d.png
        resultDiv.innerHTML = `<img src="${imgPath}1f44d.png" class="emoji-icon" alt="👍"> Хорошо! Вы ответили правильно на ${correctCount} из ${total} вопросов.`;
    } else if (percentage >= 50) {
        resultDiv.className = 'average show';
        // 📚 -> 1f4da.png
        resultDiv.innerHTML = `<img src="${imgPath}1f4da.png" class="emoji-icon" alt="📚"> Неплохо! Вы ответили правильно на ${correctCount} из ${total} вопросов. Повторите материал!`;
    } else {
        resultDiv.className = 'bad show';
        // ❌ -> 274c.png
        resultDiv.innerHTML = `<img src="${imgPath}274c.png" class="emoji-icon" alt="❌"> Вы ответили правильно на ${correctCount} из ${total} вопросов. Пересмотрите карточки еще раз!`;
    }

    // Скрываем кнопку "Проверить" и показываем кнопку "Перемешать"
    document.getElementById('check-btn').style.display = 'none';
    document.getElementById('shuffle-btn').style.display = 'inline-block';
}

// Функция перемешивания и перезапуска теста
function shuffleQuiz() {
    // Генерируем новый тест с 4 случайными вопросами из базы 6
    generateQuiz();

    // Прокручиваем страницу к началу теста
    document.querySelector('.quiz-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Запускаем тест при загрузке страницы (4 случайных вопроса)

generateQuiz();



