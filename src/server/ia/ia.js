const { GoogleGenAI } = require('@google/genai');
const PROMPT_DOACERTO = require('./prompt');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || ''
});

// Modelos em ordem de preferência. Se um falhar, tenta o próximo.
const MODELOS = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.8-flash'
];

const esperar = (ms) => new Promise(r => setTimeout(r, ms));

async function enviarMensagem(mensagem, historico = []) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('Configure GEMINI_API_KEY no arquivo .env.');
    }

    if (typeof mensagem !== 'string' || !mensagem.trim()) {
        throw new Error('Mensagem inválida.');
    }

    const contents = [];

    if (Array.isArray(historico)) {
        for (const msg of historico) {
            if (msg && (msg.role === 'user' || msg.role === 'model') && typeof msg.text === 'string') {
                contents.push({
                    role: msg.role,
                    parts: [{ text: msg.text }]
                });
            }
        }
    }

    contents.push({
        role: 'user',
        parts: [{ text: mensagem.trim() }]
    });

    let ultimoErro;

    for (const model of MODELOS) {
        for (let tentativa = 1; tentativa <= 2; tentativa++) {
            try {
                const resposta = await ai.models.generateContent({
                    model,
                    contents,
                    config: { systemInstruction: PROMPT_DOACERTO }
                });

                if (!resposta.text) {
                    throw new Error('O Gemini não retornou um texto válido.');
                }

                return resposta.text;
            } catch (erro) {
                ultimoErro = erro;
                console.error(`Falha com ${model} (tentativa ${tentativa}):`, erro.status || erro.message);

                // 503 e 429 são temporários: espera e tenta de novo.
                // 404 significa modelo indisponível: vai direto para o próximo.
                if (erro.status === 503 || erro.status === 429) {
                    await esperar(1500);
                    continue;
                }
                break;
            }
        }
    }

    throw ultimoErro;
}

module.exports = { enviarMensagem };