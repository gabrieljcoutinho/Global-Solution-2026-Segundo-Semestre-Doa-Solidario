require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const { enviarMensagem } = require('./ia/ia');

const app = express();
const PORTA = 3001;
const CAMINHO_JSON = path.join(__dirname, 'dados.json');

app.use(express.json({ limit: '1mb' }));
app.use(cors());

// ==========================================
// LIMPEZA DE DOAÇÕES REMOVIDAS PELA EMPRESA
// ==========================================

const limparDoacoesFinalizadas = (dados) => {
    if (!Array.isArray(dados.doacoes)) return dados;

    return {
        ...dados,
        doacoes: dados.doacoes.filter(
            (doacao) => doacao.ocultaEmpresa !== true
        ),
    };
};

// ==========================================
// REMOÇÃO DE DADOS SENSÍVEIS (para a IA)
// ==========================================

const removerDadosSensiveis = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(removerDadosSensiveis);
    }

    if (obj && typeof obj === 'object') {
        const limpo = {};

        for (const [chave, valor] of Object.entries(obj)) {
            if (/senha|password|cpf|email|telefone|token/i.test(chave)) continue;
            limpo[chave] = removerDadosSensiveis(valor);
        }

        return limpo;
    }

    return obj;
};

// ==========================================
// RESUMO CALCULADO PELO SERVIDOR (para a IA)
// ==========================================

const gerarResumo = (dados) => {
    const doacoes = Array.isArray(dados?.doacoes) ? dados.doacoes : [];

    const porStatus = {};
    for (const doacao of doacoes) {
        const status = doacao.status ?? 'sem status';
        porStatus[status] = (porStatus[status] || 0) + 1;
    }

    return {
        totalDoacoes: doacoes.length,
        porStatus
    };
};

const lerDadosApp = () => {
    try {
        const conteudo = fs.readFileSync(CAMINHO_JSON, 'utf8');
        const dados = removerDadosSensiveis(JSON.parse(conteudo));

        const resultado = {
            ...dados,
            resumo: gerarResumo(dados)
        };

        console.log('Resumo enviado para a IA:', resultado.resumo);
        return resultado;
    } catch (erro) {
        console.error('Não foi possível ler dados.json para a IA:', erro);
        return null;
    }
};

// ==========================================
// GET - CARREGAR DADOS
// ==========================================

app.get('/api/dados', (req, res) => {
    fs.readFile(CAMINHO_JSON, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);

            return res.status(500).json({
                erro: 'Não foi possível ler os dados.'
            });
        }

        try {
            res.json(JSON.parse(data));
        } catch (erroParse) {
            console.error('JSON inválido:', erroParse);

            res.status(500).json({
                erro: 'O arquivo dados.json está com formato inválido.'
            });
        }
    });
});

// ==========================================
// POST - SALVAR DADOS
// ==========================================

app.post('/api/dados', (req, res) => {
    const novosDados = req.body;

    if (
        !novosDados ||
        typeof novosDados !== 'object' ||
        Array.isArray(novosDados)
    ) {
        return res.status(400).json({
            erro: 'O corpo precisa ser um objeto com os dados.'
        });
    }

    const dadosLimpos = limparDoacoesFinalizadas(novosDados);

    fs.writeFile(
        CAMINHO_JSON,
        JSON.stringify(dadosLimpos, null, 2),
        'utf8',
        (err) => {
            if (err) {
                console.error('Erro ao salvar JSON:', err);

                return res.status(500).json({
                    erro: 'Não foi possível salvar os dados.'
                });
            }

            const removidas =
                (novosDados.doacoes?.length || 0) -
                (dadosLimpos.doacoes?.length || 0);

            res.json({
                sucesso: true,
                mensagem: 'Dados salvos com sucesso!',
                removidas,
            });
        }
    );
});

// ==========================================
// POST - CONVERSAR COM A INTELIGÊNCIA ARTIFICIAL
// ==========================================

app.post('/api/chat', async (req, res) => {
    try {
        const { mensagem, historico = [] } = req.body;

        if (typeof mensagem !== 'string' || !mensagem.trim()) {
            return res.status(400).json({
                erro: 'Digite uma mensagem válida.'
            });
        }

        if (!Array.isArray(historico)) {
            return res.status(400).json({
                erro: 'Histórico de conversa inválido.'
            });
        }

        const dadosApp = lerDadosApp();

        const resposta = await enviarMensagem(
            mensagem,
            historico,
            dadosApp
        );

        return res.json({
            sucesso: true,
            resposta
        });

    } catch (erro) {
        console.error('Erro na IA:', erro);

        return res.status(500).json({
            sucesso: false,
            erro: 'Não foi possível obter uma resposta da inteligência artificial. Tente novamente.'
        });
    }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORTA, () => {
    console.log('====================================');
    console.log('DOACERTO - SERVIDOR INICIADO');
    console.log(`Servidor: http://localhost:${PORTA}`);
    console.log('API Gemini: configurada para uso');
    console.log('====================================');
});