const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORTA = 3001; // Vai rodar na porta 3001 para não conflitar com o React (3000)
const CAMINHO_JSON = path.join(__dirname, 'dados.json');

app.use(express.json());
app.use(cors());

// Rota para ler os dados do arquivo JSON físico
app.get('/api/dados', (req, res) => {
    fs.readFile(CAMINHO_JSON, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            return res.status(500).json({ erro: 'Não foi possível ler os dados.' });
        }
        res.json(JSON.parse(data));
    });
});

// Rota para salvar/atualizar os dados diretamente no arquivo JSON físico
app.post('/api/dados', (req, res) => {
    const novosDados = req.body;

    fs.writeFile(CAMINHO_JSON, JSON.stringify(novosDados, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Erro ao salvar no arquivo JSON:', err);
            return res.status(500).json({ erro: 'Não foi possível salvar os dados.' });
        }
        res.json({ sucesso: true, mensagem: 'Dados salvos com sucesso no arquivo JSON!' });
    });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando perfeitamente na porta ${PORTA}`);
});