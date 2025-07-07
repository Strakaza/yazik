// netlify/functions/gemini-proxy.js

// On utilise fetch, qui est disponible dans l'environnement des fonctions Netlify
export async function handler(event) {
    // 1. Récupérer la clé API depuis les variables d'environnement de Netlify (c'est la partie secrète)
    const API_KEY = process.env.GEMINI_API_KEY;

    // 2. S'assurer que la requête vient bien de notre app (méthode POST)
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        // 3. Récupérer le "prompt" envoyé par notre app.js
        const { prompt } = JSON.parse(event.body);
        
        if (!prompt) {
            return { statusCode: 400, body: 'Prompt manquant.' };
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        
        // 4. Appeler l'API Gemini depuis le serveur, en ajoutant la clé secrète
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur API Gemini:', errorData);
            return { statusCode: response.status, body: JSON.stringify(errorData) };
        }

        const data = await response.json();
        
        // 5. Renvoyer la réponse de Gemini à notre app.js
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error('Erreur dans la fonction proxy:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erreur interne du serveur." }),
        };
    }
}