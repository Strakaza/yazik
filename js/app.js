// js/app.js

// Importer les données depuis le fichier data.js
import { contentData } from './data.js';

// ===================================================================================
// APPLICATION LOGIC
// ===================================================================================
let userProgress = { currentLevel: "A1", completedLevels: [], testStatus: {} };
let currentTest = { type: null, levelId: null, questions: [], index: 0, score: 0, userAnswers: [] };
const GRAMMAR_PASS_SCORE = 35;
const GRAMMAR_TOTAL_QUESTIONS = 40;
const VOCAB_PASS_SCORE = 50;
const VOCAB_TOTAL_QUESTIONS = 60;
const COMPREHENSION_PASS_SCORE = 50;
const COMPREHENSION_TOTAL_QUESTIONS = 60;
const SENTENCE_RU_FR_PASS_SCORE = 7;
const SENTENCE_RU_FR_TOTAL_QUESTIONS = 8;
const SENTENCE_FR_RU_PASS_SCORE = 7;
const SENTENCE_FR_RU_TOTAL_QUESTIONS = 8;


const elements = { 
    navigationMenu: document.getElementById('navigation-menu'), 
    mainContent: document.getElementById('main-content'), 
    userProgressDisplay: document.getElementById('user-progress-display'), 
    choiceModal: document.getElementById('choice-modal'), 
    grammarModal: document.getElementById('grammar-exam-modal'), 
    vocabModal: document.getElementById('vocab-test-modal'), 
    comprehensionModal: document.getElementById('comprehension-test-modal'),
    sentenceRuFrModal: document.getElementById('sentence-ru-fr-modal'),
    sentenceFrRuModal: document.getElementById('sentence-fr-ru-modal'),
    resultsModal: document.getElementById('results-modal'), 
    correctionModal: document.getElementById('correction-modal'), 
};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    loadProgress();
    renderNavigation();
    updateUserProgressDisplay();
    showLevelContent(userProgress.currentLevel);

    // GESTIONNAIRE D'ÉVÉNEMENTS DÉLÉGUÉ ET ROBUSTE
    document.body.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const { id, dataset } = button;
        
        const actions = {
            'reset-progress-btn': resetProgress,
            'open-choice-btn': () => openChoiceModal(dataset.levelId),
            'close-choice-modal-btn': () => elements.choiceModal.classList.add('hidden'),
            'choice-grammar-btn': () => { elements.choiceModal.classList.add('hidden'); startGrammarExam(dataset.levelId); },
            'choice-vocab-btn': () => { elements.choiceModal.classList.add('hidden'); startVocabTest(dataset.levelId); },
            'choice-comprehension-btn': () => { elements.choiceModal.classList.add('hidden'); startComprehensionTest(dataset.levelId); },
            'choice-sentence-ru-fr-btn': () => { elements.choiceModal.classList.add('hidden'); startSentenceRuFrTest(dataset.levelId); },
            'choice-sentence-fr-ru-btn': () => { elements.choiceModal.classList.add('hidden'); startSentenceFrRuTest(dataset.levelId); },

            'exit-grammar-btn': () => exitTest('grammar'),
            'next-grammar-btn': () => showNextQuestion('grammar'),
            'exit-vocab-btn': () => exitTest('vocab'),
            'next-vocab-btn': () => showNextQuestion('vocab'),
            'exit-comprehension-btn': () => exitTest('comprehension'),
            'next-comprehension-btn': () => showNextQuestion('comprehension'),
            'exit-sentence-ru-fr-btn': () => exitTest('sentence-ru-fr'),
            'next-sentence-ru-fr-btn': () => showNextQuestion('sentence-ru-fr'),
            'exit-sentence-fr-ru-btn': () => exitTest('sentence-fr-ru'),
            'next-sentence-fr-ru-btn': () => showNextQuestion('sentence-fr-ru'),

            'show-correction-btn': showCorrections,
            'close-correction-btn': () => elements.correctionModal.classList.add('hidden'),
            'continue-btn': () => { elements.resultsModal.classList.add('hidden'); renderNavigation(); showLevelContent(userProgress.currentLevel); },
        };
        
        if (actions[id]) {
            actions[id]();
        } else if (button.classList.contains('question-option')) {
            selectAnswer(parseInt(button.dataset.index), button.dataset.type);
        }
    });
}

async function callGeminiAPI(prompt) {
    // L'URL pointe maintenant vers notre propre fonction proxy
    const url = `/.netlify/functions/gemini-proxy`; 

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // On envoie juste le prompt, la clé sera ajoutée côté serveur
            body: JSON.stringify({ prompt: prompt }) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur API: ${errorData.error.message}`);
        }
        
        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.warn("Réponse inattendue de l'API:", data);
            return `{"summary": "L'IA a renvoyé une réponse vide.", "choices": []}`;
        }
    } catch (error) {
        console.error("Erreur d'appel au proxy Gemini:", error);
        // Message d'erreur plus clair pour l'utilisateur
        if (window.location.hostname === "localhost") {
             return `{"summary": "Erreur de communication avec la fonction proxy. Avez-vous lancé le site avec 'netlify dev' ? Vérifiez la console du terminal.", "choices": []}`;
        }
        return `{"summary": "Erreur de communication avec l'IA. Le service est peut-être indisponible.", "choices": []}`;
    }
}function loadProgress() { const savedProgress = localStorage.getItem('russianLearningProgressIA'); if (savedProgress) userProgress = JSON.parse(savedProgress); }
function saveProgress() { localStorage.setItem('russianLearningProgressIA', JSON.stringify(userProgress)); }
function resetProgress() { if (confirm("Êtes-vous sûr de vouloir réinitialiser votre progression?")) { userProgress = { currentLevel: "A1", completedLevels: [], testStatus: {} }; saveProgress(); renderNavigation(); showLevelContent('A1'); } }
function updateUserProgressDisplay() { elements.userProgressDisplay.textContent = `Niveau Actuel: ${userProgress.currentLevel}`; }

function renderNavigation() { 
    elements.navigationMenu.innerHTML = ''; 
    contentData.levels.forEach(level => { 
        const status = userProgress.testStatus[level.id] || {}; 
        const isCompleted = status.grammarPassed && status.vocabPassed && status.comprehensionPassed && status.sentenceRuFrPassed && status.sentenceFrRuPassed;
        const isCurrent = userProgress.currentLevel === level.id; 
        const unlockedLevels = [userProgress.currentLevel, ...userProgress.completedLevels]; 
        const isUnlocked = unlockedLevels.includes(level.id); 
        const levelElement = document.createElement('button'); 
        levelElement.className = `level-btn w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center shadow-sm border ${ isCurrent ? 'bg-orange-100 text-orange-800 border-orange-300 scale-105 shadow-md' : isUnlocked ? 'hover:bg-orange-50 hover:border-orange-200 text-stone-800 border-stone-200' : 'locked bg-stone-100 text-stone-500 border-stone-200' }`; 
        let progressIndicator = ''; 
        if(isUnlocked && !isCompleted) { 
            const completedCount = (status.grammarPassed ? 1 : 0) + (status.vocabPassed ? 1 : 0) + (status.comprehensionPassed ? 1 : 0) + (status.sentenceRuFrPassed ? 1 : 0) + (status.sentenceFrRuPassed ? 1 : 0);
            const progressPercentage = (completedCount / 5) * 100;
            progressIndicator = `<div class="w-full h-1.5 bg-stone-200 rounded-full mt-1"><div class="h-1.5 rounded-full bg-orange-600" style="width: ${progressPercentage}%"></div></div>`; 
        } 
        levelElement.innerHTML = ` <div class="flex items-center justify-center w-10 h-10 rounded-full mr-4 text-sm font-bold ${ isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-orange-700 text-white' : 'bg-stone-200 text-stone-400' }"> ${isCompleted ? '<i class="fas fa-check"></i>' : level.id} </div> <div class="flex-grow"> <div class="font-semibold">${level.title}</div> ${progressIndicator} </div> ${!isUnlocked ? '<i class="fas fa-lock ml-auto text-stone-400"></i>' : ''} `; 
        if (isUnlocked) { 
            levelElement.addEventListener('click', () => { userProgress.currentLevel = level.id; renderNavigation(); showLevelContent(level.id); }); 
        } 
        elements.navigationMenu.appendChild(levelElement); 
    }); 
}

async function showLevelContent(levelId) {
    const level = contentData.levels.find(l => l.id === levelId);
    if (!level) return;

    const status = userProgress.testStatus[levelId] || {};
    const isCompleted = status.grammarPassed && status.vocabPassed && status.comprehensionPassed && status.sentenceRuFrPassed && status.sentenceFrRuPassed;

    let buttonHTML = isCompleted 
        ? `<div class="mt-4 md:mt-0 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold flex items-center shadow-lg cursor-default"><i class="fas fa-check-circle mr-2"></i> Niveau Validé</div>`
        : `<button id="open-choice-btn" data-level-id="${levelId}" class="btn-primary mt-4 md:mt-0 px-6 py-3 rounded-lg font-semibold flex items-center"><i class="fas fa-check-double mr-2"></i> Valider le Niveau</button>`;

    elements.mainContent.innerHTML = `
        <div id="level-title-container" class="mb-6">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div><h2 class="text-3xl font-bold text-stone-800">${level.title}</h2><p class="text-stone-600 mt-1">${level.description}</p></div>
                ${buttonHTML}
            </div>
        </div>
        <div id="ai-content-area" class="mt-6 border-t border-stone-200 pt-6 flex-grow"></div>`;
    
    const aiContentArea = document.getElementById('ai-content-area');
    aiContentArea.innerHTML = `<div class="text-center py-12"><i class="fas fa-dragonfly text-5xl text-orange-600 mb-4 dragonfly-float"></i><p class="text-stone-600">L'IA prépare votre plan de leçon pour le niveau ${levelId}...</p></div>`;
    
    const summaryPrompt = `Tu es un professeur de russe. Pour le niveau "${level.id} (${level.title})", fais 2 choses : 1. Rédige un court résumé des objectifs. 2. Propose EXACTEMENT 4 sujets de leçons spécifiques. Formatte ta réponse UNIQUEMENT en JSON: {"summary": "...", "choices": ["...", "...", "...", "..."]}`;
    const aiResponse = await callGeminiAPI(summaryPrompt);

    try {
        const cleanedResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedResponse = JSON.parse(cleanedResponse);
        aiContentArea.innerHTML = `<div id="ai-summary" class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg mb-6"><h3 class="font-semibold text-lg text-orange-800 mb-2">Objectifs du niveau :</h3><p>${parsedResponse.summary}</p></div><div id="ai-choices"><h3 class="font-semibold text-lg text-stone-800 mb-3">Que voulez-vous étudier ?</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-3"></div></div><div id="ai-lesson-detail" class="mt-6"></div>`;
        const choicesContainer = aiContentArea.querySelector('#ai-choices .grid');
        choicesContainer.addEventListener('click', (event) => {
            const choiceBtn = event.target.closest('button.ai-choice-button');
            if(choiceBtn) getLessonDetail(choiceBtn.dataset.topic, choiceBtn.dataset.levelId);
        });
        parsedResponse.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'ai-choice-button w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-stone-700 hover:bg-orange-50 hover:border-orange-400 transition text-left';
            button.innerHTML = `<i class="fas fa-chalkboard-teacher mr-2 text-orange-600"></i> ${choice}`;
            button.dataset.topic = choice;
            button.dataset.levelId = levelId;
            choicesContainer.appendChild(button);
        });
    } catch (error) {
        aiContentArea.innerHTML = `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><h4 class="font-bold">Erreur de l'IA</h4><p>L'IA a renvoyé une réponse dans un format inattendu. Veuillez réessayer. Réponse brute :</p><pre class="mt-2 whitespace-pre-wrap text-sm">${aiResponse}</pre></div>`;
    }
}

async function getLessonDetail(topic, levelId) { 
    const lessonContainer = document.getElementById('ai-lesson-detail'); 
    lessonContainer.innerHTML = `<div class="text-center py-8 border-t mt-6"><i class="fas fa-spinner fa-spin text-2xl text-orange-600"></i><p class="text-stone-500 mt-2">L'IA rédige la leçon sur "${topic}"...</p></div>`; 
    const detailPrompt = `Tu es un excellent professeur de russe. Explique le sujet suivant pour un élève du niveau ${levelId} : "${topic}". Structure ta réponse avec une intro, des règles, au moins 3 exemples clairs (russe, [prononciation], français), et une liste de vocabulaire clé. Utilise le formatage Markdown.`; 
    const lessonContent = await callGeminiAPI(detailPrompt); 
    lessonContainer.innerHTML = `<div class="border-t border-stone-200 mt-6 pt-6 prose max-w-none"><h4 class="text-2xl font-bold text-stone-800 mb-4">${topic}</h4>${marked.parse(lessonContent)}</div>`; 
}

function openChoiceModal(levelId) { 
    elements.choiceModal.innerHTML = `<div class="glass-card rounded-xl max-w-md w-full p-8 text-center shadow-2xl">
      <div class="animated-color-icon w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="fas fa-dragonfly text-3xl text-white"></i>
      </div>
      <h3 class="text-2xl font-bold mb-6">Choisissez votre épreuve</h3>
      <div class="space-y-4">
        <button id="choice-grammar-btn" data-level-id="${levelId}"></button>
        <button id="choice-vocab-btn" data-level-id="${levelId}"></button>
        <button id="choice-comprehension-btn" data-level-id="${levelId}"></button>
        <button id="choice-sentence-ru-fr-btn" data-level-id="${levelId}"></button>
        <button id="choice-sentence-fr-ru-btn" data-level-id="${levelId}"></button>
      </div>
      <button id="close-choice-modal-btn" class="mt-8 text-stone-500 hover:text-stone-800">Fermer</button>
    </div>`;

    const status = userProgress.testStatus[levelId] || {};
    const setupButton = (btnId, isPassed, textPassed, textDefault, iconDefault, btnClass) => {
        const btn = document.getElementById(btnId);
        btn.className = `w-full px-6 py-4 text-white font-semibold rounded-lg flex items-center justify-center text-lg ${isPassed ? 'bg-green-500 cursor-not-allowed' : `${btnClass} transition-transform transform hover:scale-105`}`;
        btn.innerHTML = `<i class="fas ${isPassed ? 'fa-check-circle' : iconDefault} mr-3"></i> ${isPassed ? textPassed : textDefault}`;
        btn.disabled = isPassed;
    };
    setupButton('choice-grammar-btn', status.grammarPassed, 'Grammaire Validée', 'Épreuve de Grammaire', 'fa-spell-check', 'btn-primary');
    setupButton('choice-vocab-btn', status.vocabPassed, 'Vocabulaire Validé (RU > FR)', 'Test Mots (RU > FR)', 'fa-book', 'btn-secondary');
    setupButton('choice-comprehension-btn', status.comprehensionPassed, 'Compréhension Validée (FR > RU)', 'Test Mots (FR > RU)', 'fa-ear-listen', 'btn-tertiary');
    setupButton('choice-sentence-ru-fr-btn', status.sentenceRuFrPassed, 'Phrases Validées (RU > FR)', 'Test Phrases (RU > FR)', 'fa-comments', 'btn-quaternary');
    setupButton('choice-sentence-fr-ru-btn', status.sentenceFrRuPassed, 'Phrases Validées (FR > RU)', 'Test Phrases (FR > RU)', 'fa-language', 'btn-quinary');

    elements.choiceModal.classList.remove('hidden');
}

function createExamModalHTML(type) { 
    let color, titleText, totalQuestions, questionPrompt;
    switch(type) {
        case 'grammar':
            color = 'orange'; titleText = 'Épreuve de Grammaire'; totalQuestions = GRAMMAR_TOTAL_QUESTIONS; questionPrompt = ''; break;
        case 'vocab':
            color = 'stone'; titleText = 'Test de Mots (RU > FR)'; totalQuestions = VOCAB_TOTAL_QUESTIONS; questionPrompt = 'Traduisez le mot :'; break;
        case 'comprehension':
            color = 'purple'; titleText = 'Test de Mots (FR > RU)'; totalQuestions = COMPREHENSION_TOTAL_QUESTIONS; questionPrompt = 'Quel est le mot russe pour :'; break;
        case 'sentence-ru-fr':
            color = 'teal'; titleText = 'Test de Phrases (RU > FR)'; totalQuestions = SENTENCE_RU_FR_TOTAL_QUESTIONS; questionPrompt = 'Traduisez la phrase :'; break;
        case 'sentence-fr-ru':
            color = 'pink'; titleText = 'Test de Phrases (FR > RU)'; totalQuestions = SENTENCE_FR_RU_TOTAL_QUESTIONS; questionPrompt = 'Quelle est la traduction de :'; break;
    }
    const isGrammar = type === 'grammar';
    const textAlignClass = isGrammar ? '' : 'text-center';
    
    return `<div class="glass-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col"><div class="p-6 border-b border-stone-200"><div class="flex justify-between items-center"><h3 id="${type}-title" class="text-xl font-bold">${titleText}</h3><div class="flex items-center"><div class="relative w-12 h-12 mr-3"><svg class="w-full h-full" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-stone-200" stroke-width="3"></circle><circle id="${type}-progress-ring" class="stroke-current text-${color}-600 progress-ring__circle" cx="18" cy="18" r="16" fill="none" stroke-width="3" stroke-dasharray="100 100" stroke-dashoffset="100"></circle></svg><div id="${type}-progress-text" class="absolute inset-0 flex items-center justify-center text-xs font-bold">0/${totalQuestions}</div></div><span id="${type}-score" class="bg-${color}-100 text-${color}-800 px-3 py-1 rounded-full text-sm font-semibold">Score: 0</span></div></div></div><div class="p-6 flex-grow"><div id="${type}-question-container" class="mb-6"><p class="text-lg font-medium mb-2 ${textAlignClass}">${questionPrompt}</p><p id="${type}-question" class="text-lg font-medium mb-5 ${textAlignClass} ${isGrammar ? '' : 'text-xl text-orange-800'}"></p><div id="${type}-options" class="space-y-3"></div></div></div><div class="p-6 border-t border-stone-200 bg-stone-50 rounded-b-xl"><div class="flex justify-between"><button id="exit-${type}-btn" class="px-5 py-2 bg-stone-200 rounded-lg hover:bg-stone-300 font-semibold"><i class="fas fa-times mr-2"></i> Quitter</button><button id="next-${type}-btn" class="btn-primary px-5 py-2 rounded-lg font-semibold disabled:opacity-50" disabled>Suivant <i class="fas fa-arrow-right ml-2"></i></button></div></div></div>`;
}

function startGrammarExam(levelId) { 
    const level = contentData.levels.find(l => l.id === levelId); 
    if (!level || !level.quizQuestions) return; 
    const questions = [...level.quizQuestions].sort(() => 0.5 - Math.random()).slice(0, GRAMMAR_TOTAL_QUESTIONS); 
    currentTest = { type: 'grammar', levelId, questions, index: 0, score: 0, userAnswers: [] }; 
    elements.grammarModal.innerHTML = createExamModalHTML('grammar'); 
    elements.grammarModal.classList.remove('hidden'); 
    showQuestion('grammar'); 
}

function startVocabTest(levelId) { 
    const level = contentData.levels.find(l => l.id === levelId); 
    if (!level || !level.vocabularyBank) return; 
    const questions = generateVocabQuestions(level.vocabularyBank, VOCAB_TOTAL_QUESTIONS); 
    currentTest = { type: 'vocab', levelId, questions, index: 0, score: 0, userAnswers: [] }; 
    elements.vocabModal.innerHTML = createExamModalHTML('vocab'); 
    elements.vocabModal.classList.remove('hidden'); 
    showQuestion('vocab'); 
}

function startComprehensionTest(levelId) {
    const level = contentData.levels.find(l => l.id === levelId);
    if (!level || !level.vocabularyBank) return;
    const questions = generateComprehensionQuestions(level.vocabularyBank, COMPREHENSION_TOTAL_QUESTIONS);
    currentTest = { type: 'comprehension', levelId, questions, index: 0, score: 0, userAnswers: [] };
    elements.comprehensionModal.innerHTML = createExamModalHTML('comprehension');
    elements.comprehensionModal.classList.remove('hidden');
    showQuestion('comprehension');
}

function startSentenceRuFrTest(levelId) {
    const level = contentData.levels.find(l => l.id === levelId);
    if (!level || !level.sentenceBank) return;
    const questions = generateSentenceQuestions(level.sentenceBank, SENTENCE_RU_FR_TOTAL_QUESTIONS, 'ru-fr');
    currentTest = { type: 'sentence-ru-fr', levelId, questions, index: 0, score: 0, userAnswers: [] };
    elements.sentenceRuFrModal.innerHTML = createExamModalHTML('sentence-ru-fr');
    elements.sentenceRuFrModal.classList.remove('hidden');
    showQuestion('sentence-ru-fr');
}

function startSentenceFrRuTest(levelId) {
    const level = contentData.levels.find(l => l.id === levelId);
    if (!level || !level.sentenceBank) return;
    const questions = generateSentenceQuestions(level.sentenceBank, SENTENCE_FR_RU_TOTAL_QUESTIONS, 'fr-ru');
    currentTest = { type: 'sentence-fr-ru', levelId, questions, index: 0, score: 0, userAnswers: [] };
    elements.sentenceFrRuModal.innerHTML = createExamModalHTML('sentence-fr-ru');
    elements.sentenceFrRuModal.classList.remove('hidden');
    showQuestion('sentence-fr-ru');
}

function generateVocabQuestions(bank, count) { 
    const shuffled = [...bank].sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, count).map(word => { 
        let options = [word.fr]; 
        let wrongAnswers = shuffled.filter(w => w.fr !== word.fr); 
        for(let i=0; i<3; i++) { options.push(wrongAnswers[i % wrongAnswers.length].fr); } 
        options.sort(() => 0.5 - Math.random()); 
        return { question: word.ru, options, correctAnswer: options.indexOf(word.fr) }; 
    }); 
}

function generateComprehensionQuestions(bank, count) {
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(word => {
        let options = [word.ru];
        let wrongAnswers = shuffled.filter(w => w.ru !== word.ru);
        for (let i = 0; i < 3; i++) {
            options.push(wrongAnswers[i % wrongAnswers.length].ru);
        }
        options.sort(() => 0.5 - Math.random());
        return { question: word.fr, options, correctAnswer: options.indexOf(word.ru) };
    });
}

function generateSentenceQuestions(bank, count, direction) {
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
    const questionLang = direction === 'ru-fr' ? 'ru' : 'fr';
    const answerLang = direction === 'ru-fr' ? 'fr' : 'ru';
    
    return shuffled.slice(0, count).map(sentence => {
        let options = [sentence[answerLang]];
        let wrongAnswers = shuffled.filter(s => s[answerLang] !== sentence[answerLang]);
        for (let i = 0; i < 3; i++) {
            if (wrongAnswers.length > i) {
                options.push(wrongAnswers[i][answerLang]);
            }
        }
        options.sort(() => 0.5 - Math.random());
        return { question: sentence[questionLang], options, correctAnswer: options.indexOf(sentence[answerLang]) };
    });
}

function showQuestion(type) { 
    const ui = { 
        q: document.getElementById(`${type}-question`), 
        o: document.getElementById(`${type}-options`), 
        n: document.getElementById(`next-${type}-btn`) 
    }; 
    
    if (currentTest.index >= currentTest.questions.length) { 
        if (type === 'grammar') finishGrammarExam(); 
        else if (type === 'vocab') finishVocabTest();
        else if (type === 'comprehension') finishComprehensionTest();
        else if (type === 'sentence-ru-fr') finishSentenceRuFrTest();
        else if (type === 'sentence-fr-ru') finishSentenceFrRuTest();
        return; 
    } 
    
    const questionData = currentTest.questions[currentTest.index]; 
    ui.q.textContent = questionData.question; 
    ui.o.innerHTML = ''; 
    
    questionData.options.forEach((option, i) => { 
        const button = document.createElement('button'); 
        button.className = 'w-full text-left px-5 py-4 bg-stone-50 hover:bg-stone-100 rounded-lg transition-all duration-200 question-option border-2 border-transparent'; 
        button.textContent = option; 
        button.dataset.index = i; 
        button.dataset.type = type; 
        ui.o.appendChild(button); 
    }); 
    
    ui.n.disabled = true; 
    updateProgressDisplay(type); 
}

function selectAnswer(selectedIndex, type) { 
    if (currentTest.isFinished) return; 
    const ui = { o: document.getElementById(`${type}-options`), n: document.getElementById(`next-${type}-btn`) }; 
    const questionData = currentTest.questions[currentTest.index]; 
    const isCorrect = selectedIndex === questionData.correctAnswer; 
    
    currentTest.userAnswers.push({ 
        question: questionData.question, 
        options: questionData.options, 
        selectedIndex: selectedIndex, 
        correctIndex: questionData.correctAnswer, 
        isCorrect: isCorrect 
    }); 
    
    const options = Array.from(ui.o.querySelectorAll('.question-option')); 
    options.forEach(option => { 
        option.disabled = true; 
        option.classList.remove('hover:bg-stone-100'); 
    }); 
    
    options[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect'); 
    if (!isCorrect) options[questionData.correctAnswer].classList.add('correct'); 
    
    if (isCorrect) currentTest.score++; 
    ui.n.disabled = false; 
    updateProgressDisplay(type); 
}

function showNextQuestion(type) { 
    currentTest.index++; 
    showQuestion(type); 
}

function updateProgressDisplay(type) { 
    const total = currentTest.questions.length; 
    const ui = { 
        t: document.getElementById(`${type}-progress-text`), 
        r: document.getElementById(`${type}-progress-ring`), 
        s: document.getElementById(`${type}-score`) 
    }; 
    
    ui.t.textContent = `${currentTest.index}/${total}`; 
    const progress = total > 0 ? (currentTest.index / total) : 0;
    ui.r.style.strokeDashoffset = 100 - (100 * progress);
    ui.s.textContent = `Score: ${currentTest.score}`; 
}

function finishGrammarExam() { 
    elements.grammarModal.classList.add('hidden'); 
    const passed = currentTest.score >= GRAMMAR_PASS_SCORE; 
    if (passed) { 
        if (!userProgress.testStatus[currentTest.levelId]) userProgress.testStatus[currentTest.levelId] = {}; 
        userProgress.testStatus[currentTest.levelId].grammarPassed = true; 
        saveProgress(); 
        checkLevelCompletion();
    } else { showResults('grammar-fail'); } 
    renderNavigation(); 
}

function finishVocabTest() { 
    elements.vocabModal.classList.add('hidden'); 
    const passed = currentTest.score >= VOCAB_PASS_SCORE; 
    if (passed) { 
        if (!userProgress.testStatus[currentTest.levelId]) userProgress.testStatus[currentTest.levelId] = {}; 
        userProgress.testStatus[currentTest.levelId].vocabPassed = true; 
        saveProgress(); 
        checkLevelCompletion();
    } else { showResults('vocab-fail'); } 
    renderNavigation(); 
}

function finishComprehensionTest() {
    elements.comprehensionModal.classList.add('hidden');
    const passed = currentTest.score >= COMPREHENSION_PASS_SCORE;
    if (passed) {
        if (!userProgress.testStatus[currentTest.levelId]) userProgress.testStatus[currentTest.levelId] = {};
        userProgress.testStatus[currentTest.levelId].comprehensionPassed = true;
        saveProgress();
        checkLevelCompletion();
    } else { showResults('comprehension-fail'); }
    renderNavigation();
}

function finishSentenceRuFrTest() {
    elements.sentenceRuFrModal.classList.add('hidden');
    const passed = currentTest.score >= SENTENCE_RU_FR_PASS_SCORE;
    if (passed) {
        if (!userProgress.testStatus[currentTest.levelId]) userProgress.testStatus[currentTest.levelId] = {};
        userProgress.testStatus[currentTest.levelId].sentenceRuFrPassed = true;
        saveProgress();
        checkLevelCompletion();
    } else { showResults('sentence-ru-fr-fail'); }
    renderNavigation();
}

function finishSentenceFrRuTest() {
    elements.sentenceFrRuModal.classList.add('hidden');
    const passed = currentTest.score >= SENTENCE_FR_RU_PASS_SCORE;
    if (passed) {
        if (!userProgress.testStatus[currentTest.levelId]) userProgress.testStatus[currentTest.levelId] = {};
        userProgress.testStatus[currentTest.levelId].sentenceFrRuPassed = true;
        saveProgress();
        checkLevelCompletion();
    } else { showResults('sentence-fr-ru-fail'); }
    renderNavigation();
}

function checkLevelCompletion() {
    const status = userProgress.testStatus[currentTest.levelId] || {};
    const allPassed = status.grammarPassed && status.vocabPassed && status.comprehensionPassed && status.sentenceRuFrPassed && status.sentenceFrRuPassed;

    if (allPassed) {
        showResults('level-unlocked');
        unlockNextLevel(currentTest.levelId);
    } else {
        switch(currentTest.type) {
            case 'grammar': showResults('grammar-success'); break;
            case 'vocab': showResults('vocab-success'); break;
            case 'comprehension': showResults('comprehension-success'); break;
            case 'sentence-ru-fr': showResults('sentence-ru-fr-success'); break;
            case 'sentence-fr-ru': showResults('sentence-fr-ru-success'); break;
        }
    }
}

function unlockNextLevel(levelId) { 
    const currentLevelIndex = contentData.levels.findIndex(l => l.id === levelId); 
    if (!userProgress.completedLevels.includes(levelId)) { 
        userProgress.completedLevels.push(levelId); 
    } 
    if (currentLevelIndex < contentData.levels.length - 1) { 
        userProgress.currentLevel = contentData.levels[currentLevelIndex + 1].id; 
    } 
    saveProgress(); 
}

function exitTest(type) { 
    if (confirm("Êtes-vous sûr de vouloir quitter? Votre progression pour cet essai sera perdue.")) { 
        const modalKey = `${type.replace(/-/g, '')}Modal`;
        if (elements[modalKey]) {
            elements[modalKey].classList.add('hidden');
        }
    } 
}

function showResults(resultType) { 
    elements.resultsModal.innerHTML = `<div class="glass-card rounded-xl max-w-md w-full p-8 text-center shadow-2xl"><div id="results-icon" class="text-7xl mb-4"></div><h3 id="results-title" class="text-3xl font-bold mb-2"></h3><p id="results-score" class="text-xl mb-4 text-stone-800"></p><p id="results-message" class="text-stone-600 mb-8"></p><div class="flex justify-center space-x-4"><button id="show-correction-btn" class="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold hidden"><i class="fas fa-search-plus mr-2"></i> Voir la Correction</button><button id="continue-btn" class="btn-primary px-6 py-3 rounded-lg font-semibold"></button></div></div>`; 
    let icon, title, message, continueText; 
    const scoreText = `Score: ${currentTest.score}/${currentTest.questions.length}`; 
    const showCorrectionBtn = document.getElementById('show-correction-btn'); 
    
    if (resultType !== 'level-unlocked') {
        showCorrectionBtn.classList.remove('hidden');
    } else {
        showCorrectionBtn.classList.add('hidden');
    }
    
    switch (resultType) { 
        case 'grammar-success': 
            icon = `<i class="fas fa-check-circle text-orange-500"></i>`; title = "Grammaire Réussie !"; message = "Excellent ! Continuez avec les autres épreuves."; break; 
        case 'vocab-success': 
            icon = `<i class="fas fa-check-circle text-stone-500"></i>`; title = "Test Mots (RU > FR) Réussi !"; message = "Parfait ! Il vous reste les autres épreuves."; break; 
        case 'comprehension-success': 
            icon = `<i class="fas fa-check-circle text-purple-500"></i>`; title = "Test Mots (FR > RU) Réussi !"; message = "Très bien ! Continuez vos efforts."; break;
        case 'sentence-ru-fr-success':
            icon = `<i class="fas fa-check-circle text-teal-500"></i>`; title = "Test Phrases (RU > FR) Réussi !"; message = "Impressionnant ! Les autres épreuves vous attendent."; break;
        case 'sentence-fr-ru-success':
            icon = `<i class="fas fa-check-circle text-pink-500"></i>`; title = "Test Phrases (FR > RU) Réussi !"; message = "Fantastique ! Plus que quelques épreuves."; break;

        case 'level-unlocked': 
            icon = `<i class="fas fa-trophy text-amber-400"></i>`; title = "Niveau Terminé !"; message = "Félicitations ! Vous avez validé les cinq épreuves et débloqué le niveau suivant."; continueText = "Niveau Suivant"; break; 
        
        case 'grammar-fail': 
            icon = `<i class="fas fa-times-circle text-rose-500"></i>`; title = "Épreuve Échouée"; message = `Il vous faut ${GRAMMAR_PASS_SCORE} bonnes réponses. Révisez et retentez.`; break; 
        case 'vocab-fail': 
            icon = `<i class="fas fa-times-circle text-rose-500"></i>`; title = "Test Échoué"; message = `Il vous faut ${VOCAB_PASS_SCORE} bonnes réponses. Entraînez-vous.`; break;
        case 'comprehension-fail':
            icon = `<i class="fas fa-times-circle text-rose-500"></i>`; title = "Test Échoué"; message = `Il vous faut ${COMPREHENSION_PASS_SCORE} bonnes réponses. Entraînez-vous encore !`; break;
        case 'sentence-ru-fr-fail':
            icon = `<i class="fas fa-times-circle text-rose-500"></i>`; title = "Test Échoué"; message = `Il vous faut ${SENTENCE_RU_FR_PASS_SCORE} bonnes réponses. Relisez les leçons.`; break;
        case 'sentence-fr-ru-fail':
            icon = `<i class="fas fa-times-circle text-rose-500"></i>`; title = "Test Échoué"; message = `Il vous faut ${SENTENCE_FR_RU_PASS_SCORE} bonnes réponses. Révisez vos traductions.`; break;
    } 
    
    continueText = continueText || "Continuer";
    document.getElementById('results-icon').innerHTML = icon; 
    document.getElementById('results-title').textContent = title; 
    document.getElementById('results-score').textContent = scoreText; 
    document.getElementById('results-message').textContent = message; 
    document.getElementById('continue-btn').innerHTML = `${continueText} <i class="fas fa-arrow-right ml-2"></i>`; 
    elements.resultsModal.classList.remove('hidden'); 
}

async function showCorrections() { 
    elements.resultsModal.classList.add('hidden'); 
    elements.correctionModal.innerHTML = `<div class="glass-card rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col"><div class="p-6 border-b border-stone-200 flex justify-between items-center"><h3 class="text-xl font-bold text-stone-800">Analyse des Erreurs</h3><button id="close-correction-btn" class="text-stone-500 hover:text-stone-800">×</button></div><div id="correction-content" class="p-6 space-y-4 overflow-y-auto"></div></div>`;
    elements.correctionModal.classList.remove('hidden'); 
    const contentEl = document.getElementById('correction-content'); 
    const incorrectAnswers = currentTest.userAnswers.filter(a => !a.isCorrect); 
    
    if (incorrectAnswers.length === 0) { 
        contentEl.innerHTML = `<p class="text-center text-lg text-green-600 font-semibold">Félicitations, aucune erreur !</p>`; 
        return; 
    } 
    
    contentEl.innerHTML = `<div class="text-center py-8"><i class="fas fa-robot fa-spin text-2xl text-orange-600"></i><p class="mt-2 text-stone-600">L'IA analyse vos erreurs et prépare les explications...</p></div>`; 
    
    let correctionsHTML = ''; 
    for (const answer of incorrectAnswers) { 
        const prompt = `Tu es un professeur de russe concis. La question était : "${answer.question}". L'élève a répondu "${answer.options[answer.selectedIndex]}", mais la bonne réponse était "${answer.options[answer.correctIndex]}". Explique en une seule phrase courte et simple pourquoi la bonne réponse est correcte. Commence directement l'explication sans introduction.`; 
        const explanation = await callGeminiAPI(prompt); 
        correctionsHTML += ` 
            <div class="p-4 border rounded-lg bg-stone-50"> 
                <p class="font-semibold text-stone-800">${answer.question}</p> 
                <p class="text-sm mt-2">Votre réponse : <span class="font-semibold text-red-600">${answer.options[answer.selectedIndex]}</span></p> 
                <p class="text-sm">Bonne réponse : <span class="font-semibold text-green-600">${answer.options[answer.correctIndex]}</span></p> 
                <div class="mt-3 pt-3 border-t border-stone-200"> 
                    <p class="text-sm text-orange-800 flex items-start"> 
                        <i class="fas fa-robot mr-2 mt-1"></i> 
                        <strong>Explication :</strong> ${explanation} 
                    </p> 
                </div> 
            </div> 
        `; 
    } 
    
    contentEl.innerHTML = correctionsHTML; 
}