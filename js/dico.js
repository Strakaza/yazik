document.addEventListener('DOMContentLoaded', () => {

    const vocabulary = [
        { russian: 'в', translation: ['à', 'dans'] },
        { russian: 'До скорого', translation: ['A tout a l\'heure'] },
        { russian: 'Любить', translation: ['aimer'] },
        { russian: 'Идти', translation: ['aller'] },
        { russian: 'Квартира', translation: ['appartement'] },
        { russian: 'Звать', translation: ['appeler'] },
        { russian: 'Звонить', translation: ['appeler au tél'] },
        { russian: 'Учить', translation: ['apprendre'] },
        { russian: 'После полудня', translation: ['Après-midi'] },
        { russian: 'Апрель', translation: ['avril'] },
        { russian: 'Деньги', translation: ['argent'] },
        { russian: 'Останавливать', translation: ['arreter'] },
        { russian: 'Ждать', translation: ['attendre'] },
        { russian: 'Сегодня', translation: ['aujourd\'hui'] },
        { russian: 'До свидания', translation: ['au revoir'] },
        { russian: 'Осень', translation: ['automne'] },
        { russian: 'Август', translation: ['août'] },
        { russian: 'Покупать', translation: ['acheter'] },
        { russian: 'Покупатель', translation: ['acheteur'] },
        { russian: 'Алкоголь', translation: ['alcool'] },
        { russian: 'Друг', translation: ['ami'] },
        { russian: 'Красивый', translation: ['beau'] },
        { russian: 'Много', translation: ['beaucoup'] },
        { russian: 'Потребности', translation: ['besoins'] },
        { russian: 'Скоро', translation: ['bientôt'] },
        { russian: 'Пиво', translation: ['bière'] },
        { russian: 'Хорошо', translation: ['bien'] },
        { russian: 'Конечно', translation: ['bien sur'] },
        { russian: 'Добро пожаловать', translation: ['bienvenue'] },
        { russian: 'Билет', translation: ['billet'] },
        { russian: 'Белый', translation: ['blanc'] },
        { russian: 'Синий', translation: ['bleu'] },
        { russian: 'Пить', translation: ['boire'] },
        { russian: 'Хороший', translation: ['bon'] },
        { russian: 'Добрый день', translation: ['Bon-Après-midi'] },
        { russian: 'Автобус', translation: ['bus'] },
        { russian: 'Это', translation: ['ça', 'ce,cette'] },
        { russian: 'Как дела', translation: ['ça va'] },
        { russian: 'Собор', translation: ['cathédral'] },
        { russian: 'Сто', translation: ['cent'] },
        { russian: 'Пятьсот', translation: ['cinq-cent'] },
        { russian: 'Искать', translation: ['chercher'] },
        { russian: 'Дорогой', translation: ['chère'] },
        { russian: 'Стул', translation: ['chaise'] },
        { russian: 'Небо', translation: ['ciel'] },
        { russian: 'Ясный', translation: ['clair'] },
        { russian: 'Ключ', translation: ['clé'] },
        { russian: 'Сколько', translation: ['combien'] },
        { russian: 'Как', translation: ['comment'] },
        { russian: 'Начинать', translation: ['commencer'] },
        { russian: 'Заказывать', translation: ['commander'] },
        { russian: 'Понимать', translation: ['comprendre'] },
        { russian: 'Понял', translation: ['compris'] },
        { russian: 'Знать', translation: ['connaitre'] },
        { russian: 'Довольный', translation: ['content'] },
        { russian: 'Против', translation: ['contre'] },
        { russian: 'Круто', translation: ['cool'] },
        { russian: 'Стоит', translation: ['coûte'] },
        { russian: 'Лекция', translation: ['cours magistral'] },
        { russian: 'Двоюродный брат', translation: ['cousin'] },
        { russian: 'Собирать', translation: ['cueillir'] },
        { russian: 'Опасно', translation: ['dangereux'] },
        { russian: 'Хорошо', translation: ['d\'accord'] },
        { russian: 'Декабрь', translation: ['decembre'] },
        { russian: 'Уже', translation: ['déjà'] },
        { russian: 'Завтра', translation: ['demain'] },
        { russian: 'Ненавидеть', translation: ['détester'] },
        { russian: 'Два', translation: ['deux'] },
        { russian: 'Должен', translation: ['devoir'] },
        { russian: 'Сложно', translation: ['difficile'] },
        { russian: 'Воскресенье', translation: ['dimanche'] },
        { russian: 'Десять', translation: ['dix'] },
        { russian: 'Жаль', translation: ['dommage'] },
        { russian: 'Давать', translation: ['donner'] },
        { russian: 'Спать', translation: ['dormir'] },
        { russian: 'Двенадцать', translation: ['douze'] },
        { russian: 'Право', translation: ['droite'] },
        { russian: 'Вода', translation: ['eau'] },
        { russian: 'Церковь', translation: ['église'] },
        { russian: 'Она', translation: ['elle'] },
        { russian: 'В', translation: ['en'] },
        { russian: 'Ребенок', translation: ['enfant'] },
        { russian: 'Скучный', translation: ['ennuyant'] },
        { russian: 'Отправлять', translation: ['envoyer'] },
        { russian: 'Быть', translation: ['etre'] },
        { russian: 'Лето', translation: ['été'] },
        { russian: 'Упражнение', translation: ['exercice'] },
        { russian: 'Объяснять', translation: ['expliquer'] },
        { russian: 'Выставка', translation: ['exposition'] },
        { russian: 'Исключение', translation: ['exception'] },
        { russian: 'Легко', translation: ['facile'] },
        { russian: 'Усталый', translation: ['fatigué'] },
        { russian: 'Кресло', translation: ['fauteuil'] },
        { russian: 'Женщина', translation: ['femme'] },
        { russian: 'Окно', translation: ['fenêtre'] },
        { russian: 'Закрыто', translation: ['fermé'] },
        { russian: 'Февраль', translation: ['février'] },
        { russian: 'Жених', translation: ['fiancé'] },
        { russian: 'Невеста', translation: ['fiancée'] },
        { russian: 'Дочь', translation: ['fille'] },
        { russian: 'Сын', translation: ['fils'] },
        { russian: 'Заканчивать', translation: ['finir'] },
        { russian: 'Цветы', translation: ['fleurs'] },
        { russian: 'Раз', translation: ['fois'] },
        { russian: 'Замечательный', translation: ['formidable'] },
        { russian: 'Французский', translation: ['français'] },
        { russian: 'Курить', translation: ['fumer'] },
        { russian: 'Вокзал', translation: ['la gare'] },
        { russian: 'Большой', translation: ['grand'] },
        { russian: 'Дедушка', translation: ['grand-père'] },
        { russian: 'Серый', translation: ['gris'] },
        { russian: 'Жанр', translation: ['genre'] },
        { russian: 'Лево', translation: ['gauche'] },
        { russian: 'Жить', translation: ['habiter'] },
        { russian: 'Час', translation: ['heure'] },
        { russian: 'Вчера', translation: ['hier'] },
        { russian: 'Зима', translation: ['hiver'] },
        { russian: 'Мужчина', translation: ['homme'] },
        { russian: 'Люди', translation: ['hommes (population)'] },
        { russian: 'Гостиница', translation: ['hotel'] },
        { russian: 'Восемь', translation: ['huit'] },
        { russian: 'Здесь', translation: ['ici'] },
        { russian: 'Он', translation: ['il'] },
        { russian: 'У него есть', translation: ['il a'] },
        { russian: 'Есть', translation: ['il y a'] },
        { russian: 'Они', translation: ['ils elle'] },
        { russian: 'Невозможно', translation: ['impossible'] },
        { russian: 'Интересно', translation: ['intéressant'] },
        { russian: 'Остров', translation: ['île'] },
        { russian: 'Я', translation: ['je'] },
        { russian: 'Никогда', translation: ['jamais'] },
        { russian: 'Январь', translation: ['janvier'] },
        { russian: 'Желтый', translation: ['jaune'] },
        { russian: 'Четверг', translation: ['jeudi'] },
        { russian: 'Молодой человек', translation: ['jeune homme'] },
        { russian: 'Молодежь', translation: ['les jeunes'] },
        { russian: 'Июнь', translation: ['juin'] },
        { russian: 'Там', translation: ['là-bas'] },
        { russian: 'Язык', translation: ['langue (langue d\'un pays)'] },
        { russian: 'Медленно', translation: ['lentement'] },
        { russian: 'Письмо', translation: ['lettre'] },
        { russian: 'Их', translation: ['leur'] },
        { russian: 'Далеко', translation: ['loin'] },
        { russian: 'Долго', translation: ['longtemps'] },
        { russian: 'Ему', translation: ['lui'] },
        { russian: 'Ей', translation: ['lui (féminin)'] },
        { russian: 'Понедельник', translation: ['lundi'] },
        { russian: 'Моя', translation: ['ma'] },
        { russian: 'Магазин', translation: ['magasin'] },
        { russian: 'Май', translation: ['mai'] },
        { russian: 'Сейчас', translation: ['maintenant'] },
        { russian: 'Дом', translation: ['maison'] },
        { russian: 'Но', translation: ['mais'] },
        { russian: 'Плохо', translation: ['mal'] },
        { russian: 'Бабушка', translation: ['mamie'] },
        { russian: 'Кушать', translation: ['manger'] },
        { russian: 'Вторник', translation: ['mardi'] },
        { russian: 'Март', translation: ['mars'] },
        { russian: 'Коричневый', translation: ['marron'] },
        { russian: 'Мне, меня', translation: ['me, moi'] },
        { russian: 'Врач', translation: ['medecin'] },
        { russian: 'Лекарство', translation: ['medicament'] },
        { russian: 'Спасибо', translation: ['merci'] },
        { russian: 'Среда', translation: ['mercredi'] },
        { russian: 'Море', translation: ['mer'] },
        { russian: 'Метро', translation: ['metro'] },
        { russian: 'Профессия', translation: ['métier'] },
        { russian: 'Тысяча', translation: ['mille'] },
        { russian: 'Меньше', translation: ['moin'] },
        { russian: 'Я тоже', translation: ['moi aussi'] },
        { russian: 'Смерть', translation: ['mort'] },
        { russian: 'Слово', translation: ['mot'] },
        { russian: 'Племянница', translation: ['nièce'] },
        { russian: 'Дурак', translation: ['neuneu'] },
        { russian: 'Нет', translation: ['non'] },
        { russian: 'Наш', translation: ['notre'] },
        { russian: 'Ноябрь', translation: ['novembre'] },
        { russian: 'Рождество', translation: ['noël'] },
        { russian: 'Номер', translation: ['numéro'] },
        { russian: 'Новый год', translation: ['nouvel-an'] },
        { russian: 'Мы', translation: ['nous', 'on'] },
        { russian: 'Девять', translation: ['neuf'] },
        { russian: 'Октябрь', translation: ['octobre'] },
        { russian: 'Океан', translation: ['océan'] },
        { russian: 'Да', translation: ['oui'] },
        { russian: 'Дядя', translation: ['oncle'] },
        { russian: 'Одиннадцать', translation: ['onze'] },
        { russian: 'Забывать', translation: ['oublier'] },
        { russian: 'Открыто', translation: ['ouvert'] },
        { russian: 'Где', translation: ['où'] },
        { russian: 'Хлеб', translation: ['pain'] },
        { russian: 'Дворец', translation: ['palais'] },
        { russian: 'Извините', translation: ['pardon'] },
        { russian: 'Говорить', translation: ['parler'] },
        { russian: 'Уезжать', translation: ['partir'] },
        { russian: 'Недавно', translation: ['pas longtemps'] },
        { russian: 'Ещё нет', translation: ['pas encore'] },
        { russian: 'Пасха', translation: ['paque'] },
        { russian: 'Зонт', translation: ['parapluie'] },
        { russian: 'Бедный', translation: ['pauvre'] },
        { russian: 'Страна', translation: ['pays'] },
        { russian: 'Рисовать', translation: ['peindre'] },
        { russian: 'Думать', translation: ['penser'] },
        { russian: 'Терять', translation: ['perdre'] },
        { russian: 'Отец', translation: ['père'] },
        { russian: 'Маленькая девочка', translation: ['petite fille'] },
        { russian: 'Внучка', translation: ['petite-fille'] },
        { russian: 'Маленький мальчик', translation: ['petit garçon'] },
        { russian: 'Внук', translation: ['petit-fils'] },
        { russian: 'Девушка (подруга)', translation: ['petite-amie'] },
        { russian: 'Может быть', translation: ['peut-être'] },
        { russian: 'Мало', translation: ['peu'] },
        { russian: 'Фраза', translation: ['phrase'] },
        { russian: 'Удовольствие', translation: ['plaisir'] },
        { russian: 'Больше', translation: ['plus'] },
        { russian: 'Мост', translation: ['le pont'] },
        { russian: 'Кошелек', translation: ['portefeuille'] },
        { russian: 'Возможно', translation: ['possible'] },
        { russian: 'Почему', translation: ['pourquoi'] },
        { russian: 'Около', translation: ['près de'] },
        { russian: 'Весна', translation: ['printemps'] },
        { russian: 'Когда', translation: ['quand'] },
        { russian: 'Четыре', translation: ['quatre'] },
        { russian: 'Восемьдесят', translation: ['quatre-vingt'] },
        { russian: 'Девяносто', translation: ['quatre-vingt-dix'] },
        { russian: 'Какой', translation: ['quel'] },
        { russian: 'Пятнадцать', translation: ['quinze'] },
        { russian: 'Кто', translation: ['qui'] },
        { russian: 'Что', translation: ['quoi'] },
        { russian: 'Быстро', translation: ['rapidement'] },
        { russian: 'Редко', translation: ['rarement'] },
        { russian: 'Смотри', translation: ['regarde'] },
        { russian: 'Отвечать', translation: ['répondre'] },
        { russian: 'Ответ', translation: ['réponse'] },
        { russian: 'Отдыхать', translation: ['se reposer', 'congés'] },
        { russian: 'Ресторан', translation: ['restaurant'] },
        { russian: 'Богатый', translation: ['riche'] },
        { russian: 'Ничего', translation: ['rien'] },
        { russian: 'Розовый', translation: ['rose'] },
        { russian: 'Повторять', translation: ['répéter'] },
        { russian: 'Получать', translation: ['recevoir'] },
        { russian: 'Его, её', translation: ['sa', 'son'] },
        { russian: 'Привет', translation: ['salut'] },
        { russian: 'Суббота', translation: ['samedi'] },
        { russian: 'Неделя', translation: ['semaine'] },
        { russian: 'Сентябрь', translation: ['septembre'] },
        { russian: 'Семь', translation: ['sept'] },
        { russian: 'Один', translation: ['seul'] },
        { russian: 'Только', translation: ['seulement'] },
        { russian: 'Пожалуйста', translation: ['s\'il vous plait'] },
        { russian: 'Значить', translation: ['signifier'] },
        { russian: 'Сестра', translation: ['sœur'] },
        { russian: 'Вечер', translation: ['soir'] },
        { russian: 'Часто', translation: ['souvent'] },
        { russian: 'Помнить', translation: ['souvenir'] },
        { russian: 'Ручка', translation: ['stylo'] },
        { russian: 'Сахар', translation: ['sucre'] },
        { russian: 'На', translation: ['sur'] },
        { russian: 'Заниматься спортом', translation: ['faire du sport'] },
        { russian: 'Твоя', translation: ['ta'] },
        { russian: 'Тётя', translation: ['tante'] },
        { russian: 'Чашка', translation: ['tasse'] },
        { russian: 'Тебя', translation: ['te'] },
        { russian: 'Так', translation: ['tellement'] },
        { russian: 'Телевизор', translation: ['télévision'] },
        { russian: 'Время', translation: ['temps'] },
        { russian: 'Поздно', translation: ['tard'] },
        { russian: 'Чай', translation: ['thé'] },
        { russian: 'Твой', translation: ['ton'] },
        { russian: 'Жаль', translation: ['tant-pis'] },
        { russian: 'Всегда', translation: ['toujours'] },
        { russian: 'Все', translation: ['tous'] },
        { russian: 'Поезд', translation: ['train'] },
        { russian: 'Работать', translation: ['travailler'] },
        { russian: 'Тринадцать', translation: ['treize'] },
        { russian: 'Очень', translation: ['très'] },
        { russian: 'Три', translation: ['trois'] },
        { russian: 'Ты', translation: ['tu'] },
        { russian: 'Отпуск', translation: ['vacance'] },
        { russian: 'Пятница', translation: ['vendredi'] },
        { russian: 'Продавец', translation: ['vendeur'] },
        { russian: 'Действительно', translation: ['vraiment'] },
        { russian: 'Мясо', translation: ['viande'] },
        { russian: 'Город', translation: ['ville'] },
        { russian: 'Двадцать', translation: ['vingt'] },
        { russian: 'Фиолетовый', translation: ['violet'] },
        { russian: 'Машина', translation: ['voiture'] },
        { russian: 'Видеть', translation: ['voir'] },
        { russian: 'Летать', translation: ['voler'] },
        { russian: 'Вы', translation: ['vous'] },
        { russian: 'Хотеть', translation: ['vouloir'] },
        { russian: 'невест', translation: ['mariées'] },
    ];

    const questionWordEl = document.getElementById('russian-word'); 
    const answerInputEl = document.getElementById('answer-input');
    const quizFormEl = document.getElementById('quiz-form');
    const feedbackContainerEl = document.getElementById('feedback-container');
    const submitButtonEl = document.getElementById('submit-button');
    const nextWordButtonEl = document.getElementById('next-word-button');
    const scoreCorrectEl = document.getElementById('score-correct');
    const scoreTotalEl = document.getElementById('score-total');
    
    let currentWord = null;
    let score = 0;
    let totalAnswered = 0;
    let isAnswered = false;
    let currentDirection = 'RU_TO_FR'; 
    

    function displayNewWord() {
        isAnswered = false;
        
        const randomIndex = Math.floor(Math.random() * vocabulary.length);
        currentWord = vocabulary[randomIndex];

        if (Math.random() < 0.5) {
            currentDirection = 'RU_TO_FR';
            questionWordEl.textContent = currentWord.russian;
            answerInputEl.placeholder = "Entrez la traduction française...";
        } else {
            currentDirection = 'FR_TO_RU';
            // On prend la première traduction française comme question
            questionWordEl.textContent = currentWord.translation[0]; 
            answerInputEl.placeholder = "Entrez la traduction russe...";
        }

        // 3. Réinitialiser l'interface (même logique qu'avant)
        feedbackContainerEl.innerHTML = '';
        answerInputEl.value = '';
        answerInputEl.className = 'w-full';
        answerInputEl.disabled = false;
        answerInputEl.focus();
        
        submitButtonEl.style.display = 'block';
        nextWordButtonEl.style.display = 'none';
    }

    /** Vérifie la réponse de l'utilisateur */
    function checkAnswer(event) {
        event.preventDefault();
        if (isAnswered) return;

        isAnswered = true;
        totalAnswered++;

        const userAnswer = answerInputEl.value.trim().toLowerCase();
        
        let isCorrect = false;
        let firstCorrectAnswer = '';

        if (currentDirection === 'RU_TO_FR') {
            const correctAnswers = currentWord.translation.map(t => t.toLowerCase());
            isCorrect = correctAnswers.includes(userAnswer);
            firstCorrectAnswer = currentWord.translation[0];
        } else { 
            const correctAnswer = currentWord.russian.toLowerCase();
            isCorrect = (userAnswer === correctAnswer);
            firstCorrectAnswer = currentWord.russian;
        }

        if (isCorrect) {
            score++;
            answerInputEl.classList.add('input-correct');
            feedbackContainerEl.innerHTML = `<p class="font-bold text-green-600">✅ Correct !</p>`;
        } else {
            answerInputEl.classList.add('input-incorrect');
            feedbackContainerEl.innerHTML = `<p class="font-bold text-red-600">❌ Incorrect. La bonne réponse était : <strong>${firstCorrectAnswer}</strong></p>`;
        }
        
        scoreCorrectEl.textContent = score;
        scoreTotalEl.textContent = totalAnswered;
        answerInputEl.disabled = true;
        
        submitButtonEl.style.display = 'none';
        nextWordButtonEl.style.display = 'block';
    }

    quizFormEl.addEventListener('submit', checkAnswer);
    nextWordButtonEl.addEventListener('click', displayNewWord);

    displayNewWord();
});

