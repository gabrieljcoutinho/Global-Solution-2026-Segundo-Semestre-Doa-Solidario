const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORTA = 3001; // Vai rodar na porta 3001 para não conflitar com o React (3000)
const CAMINHO_JSON = path.join(__dirname, 'dados.json');

app.use(express.json());
app.use(cors());

// Remove do arquivo as doações concluídas que empresa e doador já ocultaram
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

// Rota para ler os dados do arquivo JSON físico
app.get('/api/dados', (req, res) => {
    fs.readFile(CAMINHO_JSON, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            return res.status(500).json({ erro: 'Não foi possível ler os dados.' });
        }

        try {
            res.json(JSON.parse(data));
        } catch (erroParse) {
            console.error('JSON inválido em dados.json:', erroParse);
            res.status(500).json({ erro: 'O arquivo dados.json está com formato inválido.' });
        }
    });
});

// Rota para salvar/atualizar os dados no arquivo JSON físico
app.post('/api/dados', (req, res) => {
    const novosDados = req.body;

    if (!novosDados || typeof novosDados !== 'object' || Array.isArray(novosDados)) {
        return res.status(400).json({ erro: 'O corpo precisa ser um objeto com os dados.' });
    }

    const dadosLimpos = limparDoacoesFinalizadas(novosDados);

    fs.writeFile(CAMINHO_JSON, JSON.stringify(dadosLimpos, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Erro ao salvar no arquivo JSON:', err);
            return res.status(500).json({ erro: 'Não foi possível salvar os dados.' });
        }

        const removidas = (novosDados.doacoes?.length || 0) - (dadosLimpos.doacoes?.length || 0);

        res.json({
            sucesso: true,
            mensagem: 'Dados salvos com sucesso no arquivo JSON!',
            removidas,
        });
    });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando perfeitamente na porta ${PORTA}`);
});