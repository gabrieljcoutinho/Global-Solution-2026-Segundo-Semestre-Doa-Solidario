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
// LIMPEZA DE DOAÇÕES FINALIZADAS
// ==========================================

const limparDoacoesFinalizadas = (dados) => {
    if (!Array.isArray(dados.doacoes)) return dados;

    return {
        ...dados,
        doacoes: dados.doacoes.filter(
            (doacao) =>
                !(
                    doacao.status === 'concluida' &&
                    doacao.ocultaEmpresa === true &&
                    doacao.ocultaUsuario === true
                )
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
// FORMATAÇÃO DA LISTA DE DOAÇÕES (resposta direta)
// ==========================================

// Pega o primeiro campo preenchido entre as opções possíveis
const pegarCampo = (doacao, ...chaves) => {
    for (const chave of chaves) {
        const valor = doacao[chave];
        if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
            return valor;
        }
    }
    return 'Não informado';
};

const formatarDoacoes = (doacoes) => {
    return doacoes
        .slice(0, 10)
        .map((doacao, i) => {
            const nome = pegarCampo(doacao, 'nome', 'titulo', 'title', 'campanha');
            const descricao = pegarCampo(doacao, 'descricao', 'descrição', 'description', 'detalhes');
            const prioridade = pegarCampo(doacao, 'prioridade', 'tipo', 'categoria');
            const status = pegarCampo(doacao, 'status');
            const tamanho = pegarCampo(doacao, 'tamanho', 'size');
            const quantidade = pegarCampo(doacao, 'quantidade', 'qtd', 'quantity');
            const prazo = pegarCampo(doacao, 'prazo', 'validade', 'deadline');
            const local = pegarCampo(doacao, 'local', 'cidade', 'endereco', 'location');

            return [
                `**${i + 1}. ${nome}**`,
                `- **Descrição:** ${descricao}`,
                `- **Prioridade:** ${prioridade}`,
                `- **Status:** ${status}`,
                `- **Tamanho:** ${tamanho}`,
                `- **Quantidade:** ${quantidade}`,
                `- **Prazo:** ${prazo}`,
                `- **Local:** ${local}`
            ].join('\n');
        })
        .join('\n\n');
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

        // ATALHO: perguntas sobre doações são respondidas direto pelo servidor
        const mencionaDoacoes = /doa[cç][oõ]es/i.test(mensagem);
        const pedeListaOuContagem = /quant[ao]s?|quais|lista|mostr|todas|dispon[ií]v/i.test(mensagem);

        if (mencionaDoacoes && pedeListaOuContagem && dadosApp?.resumo) {
            const { totalDoacoes, porStatus } = dadosApp.resumo;
            const doacoes = Array.isArray(dadosApp.doacoes) ? dadosApp.doacoes : [];

            const resumoStatus = Object.entries(porStatus)
                .map(([status, qtd]) => `- **${status}:** ${qtd}`)
                .join('\n');

            const lista = doacoes.length > 0
                ? `\n\n${formatarDoacoes(doacoes)}`
                : '';

            const aviso = doacoes.length > 10
                ? `\n\n_Mostrando as 10 primeiras de ${doacoes.length}._`
                : '';

            return res.json({
                sucesso: true,
                resposta:
                    `Há **${totalDoacoes}** doações cadastradas no momento.\n\n` +
                    `${resumoStatus}` +
                    `${lista}` +
                    `${aviso}`
            });
        }

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