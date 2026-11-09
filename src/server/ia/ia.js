const { GoogleGenAI } = require('@google/genai');
const PROMPT_DOACERTO = require('./prompt');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || ''
});

const MODELOS = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.8-flash'
];

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Remove respostas antigas que diziam não ter os dados, para não reforçar o erro
const respostaRuim = (texto) =>
    /não recebi|não consigo informar|não tenho acesso/i.test(texto);

const INSTRUCAO_IMAGEM = `
AVALIAÇÃO DE FOTOS
Quando receber uma foto de roupa ou peça, avalie o estado visível como "novo", "bom", "regular" ou "com defeitos".
Liste os motivos que você vê na imagem (manchas, desgaste, rasgos, bolinhas de tecido, descoloração).
Deixe claro que é uma avaliação visual estimada e que a conferência final deve ser feita presencialmente pela instituição.
Não diga que a peça está apta para doação com certeza. Não avalie odor nem defeitos internos que não aparecem na foto.`;

async function enviarMensagem(mensagem, historico = [], dadosApp = null, imagem = null) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('Configure GEMINI_API_KEY no arquivo .env.');
    }

    if (typeof mensagem !== 'string') {
        throw new Error('Mensagem inválida.');
    }

    const contents = [];

    if (Array.isArray(historico)) {
        for (const msg of historico) {
            if (
                msg &&
                (msg.role === 'user' || msg.role === 'model') &&
                typeof msg.text === 'string' &&
                !(msg.role === 'model' && respostaRuim(msg.text))
            ) {
                contents.push({
                    role: msg.role,
                    parts: [{ text: msg.text }]
                });
            }
        }
    }

    // Os dados vão junto com a pergunta, na mensagem do usuário
    const perguntaLimpa = mensagem.trim() || 'Avalie o estado destas peças na foto.';

    const textoComDados = dadosApp
        ? `DADOS ATUAIS DA PLATAFORMA (JSON):
${JSON.stringify(dadosApp)}

PERGUNTA DO USUÁRIO:
${perguntaLimpa}`
        : perguntaLimpa;

    const parts = [];

    if (imagem) {
        parts.push({
            inlineData: {
                mimeType: imagem.mimeType,
                data: imagem.data
            }
        });
    }

    parts.push({ text: textoComDados });

    contents.push({
        role: 'user',
        parts
    });

    const systemInstruction = `${PROMPT_DOACERTO}

Você recebe sempre os dados atuais da plataforma junto com a pergunta, no bloco "DADOS ATUAIS DA PLATAFORMA". Use esses dados para responder. Para quantidades, use o campo "resumo". Ao listar doações, mostre no máximo 10. Se a informação não estiver nos dados, diga que não encontrou.
${INSTRUCAO_IMAGEM}`;

    let ultimoErro;

    for (const model of MODELOS) {
        for (let tentativa = 1; tentativa <= 2; tentativa++) {
            try {
                const resposta = await ai.models.generateContent({
                    model,
                    contents,
                    config: { systemInstruction }
                });

                if (!resposta.text) {
                    throw new Error('O Gemini não retornou um texto válido.');
                }

                return resposta.text;
            } catch (erro) {
                ultimoErro = erro;
                console.error(`Falha com ${model} (tentativa ${tentativa}):`, erro.status || erro.message);

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