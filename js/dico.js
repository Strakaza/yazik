
document.addEventListener('DOMContentLoaded', () => {

    // --- DICTIONNAIRE ---
    // Vous pouvez modifier ou ajouter des mots ici
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

    // --- RÉCUPÉRATION DES ÉLÉMENTS DU DOM ---
    const russianWordEl = document.getElementById('russian-word');
    const answerInputEl = document.getElementById('answer-input');
    const quizFormEl = document.getElementById('quiz-form');
    const feedbackContainerEl = document.getElementById('feedback-container');
    const submitButtonEl = document.getElementById('submit-button');
    const nextWordButtonEl = document.getElementById('next-word-button');
    const scoreCorrectEl = document.getElementById('score-correct');
    const scoreTotalEl = document.getElementById('score-total');
    
    // --- VARIABLES D'ÉTAT DU QUIZ ---
    let currentWord = null;
    let score = 0;
    let totalAnswered = 0;
    let isAnswered = false;
    
    // --- FONCTIONS DU QUIZ ---

    /** Affiche un nouveau mot aléatoire et réinitialise l'interface */
    function displayNewWord() {
        isAnswered = false;
        const randomIndex = Math.floor(Math.random() * vocabulary.length);
        currentWord = vocabulary[randomIndex];

        russianWordEl.textContent = currentWord.russian;
        feedbackContainerEl.innerHTML = '';
        answerInputEl.value = '';
        answerInputEl.className = 'w-full'; // Réinitialise les classes de couleur
        answerInputEl.disabled = false;
        answerInputEl.focus(); // Met le curseur directement dans le champ
        
        submitButtonEl.style.display = 'block';
        nextWordButtonEl.style.display = 'none';
    }

    /** Vérifie la réponse de l'utilisateur */
    function checkAnswer(event) {
        event.preventDefault(); // Empêche le rechargement de la page par le formulaire
        if (isAnswered) return;

        isAnswered = true;
        totalAnswered++;

        const userAnswer = answerInputEl.value.trim().toLowerCase();
        const correctAnswers = currentWord.translation.map(t => t.toLowerCase());

        if (correctAnswers.includes(userAnswer)) {
            score++;
            answerInputEl.classList.add('input-correct');
            feedbackContainerEl.innerHTML = `<p class="font-bold text-green-600">✅ Correct !</p>`;
        } else {
            answerInputEl.classList.add('input-incorrect');
            const firstCorrectAnswer = currentWord.translation[0];
            feedbackContainerEl.innerHTML = `<p class="font-bold text-red-600">❌ Incorrect. La bonne réponse était : <strong>${firstCorrectAnswer}</strong></p>`;
        }
        
        // Mettre à jour le score et l'état des boutons
        scoreCorrectEl.textContent = score;
        scoreTotalEl.textContent = totalAnswered;
        answerInputEl.disabled = true;
        
        submitButtonEl.style.display = 'none';
        nextWordButtonEl.style.display = 'block';
    }

    // --- ÉCOUTEURS D'ÉVÉNEMENTS ---
    quizFormEl.addEventListener('submit', checkAnswer);
    nextWordButtonEl.addEventListener('click', displayNewWord);

    // --- DÉMARRAGE INITIAL ---
    // Affiche le premier mot au chargement de la page
    displayNewWord();
});