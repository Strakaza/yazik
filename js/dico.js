document.addEventListener('DOMContentLoaded', () => {

    const vocabulary = [
        { russian: 'Здравствуйте', translation: ['bonjour'] },
        { russian: 'Спасибо', translation: ['merci'] },
        { russian: 'Пожалуйста', translation: ['s\'il vous plaît', 'de rien'] },
        { russian: 'Да', translation: ['oui'] },
        { russian: 'Нет', translation: ['non'] },
        { russian: 'Как дела?', translation: ['comment ça va ?', 'comment vas-tu ?'] },
        { russian: 'Хорошо', translation: ['bien', 'bon'] },
        { russian: 'Плохо', translation: ['mal', 'mauvais'] },
        { russian: 'Книга', translation: ['livre'] },
        { russian: 'Вода', translation: ['eau'] },
        { russian: 'Я', translation: ['je', 'moi'] },
        { russian: 'Собака', translation: ['chien', 'chienne'] },
        { russian: 'Кот', translation: ['chat'] },
        { russian: 'Дом', translation: ['maison'] },
        { russian: 'Говорить', translation: ['parler'] },
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
