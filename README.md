# DoaCerto

Plataforma que conecta empresas com peças ou recursos para doar a doadores individuais e instituições que precisam deles. Projeto da Global Solution 2026 (2º semestre), na área de doação solidária.

## Funcionalidades

- **Cadastro de doações pelas empresas:** a empresa registra o que tem para doar (quantidade, tamanho, prazo e localização).
- **Oferta pelo usuário:** o usuário escolhe quantas peças quer doar de cada item disponível e envia a oferta. A doação fica "pendente" até a empresa responder.
- **Mapa de doações:** visualização das campanhas e instituições por localização.
- **Histórico de doações concluídas.**
- **Assistente virtual com IA:** chat que responde dúvidas sobre a plataforma e informa, com base nos dados reais, quantas doações existem, quais estão disponíveis e onde.

## Tecnologias

- **Frontend:** React (Create React App), CSS.
- **Backend:** Node.js com Express, porta 3001.
- **Persistência:** arquivo `dados.json` lido e gravado pelo servidor.
- **IA:** Google Gemini via SDK `@google/genai`.
- **Markdown no chat:** `react-markdown`.

## Estrutura

```
src/
├── component/
│   ├── _Empresa/      telas da empresa (cadastrar e acompanhar doações)
│   ├── _Usuario/      telas do usuário (início com chat, doações, mapa)
│   ├── cadastro/
│   └── login/
└── server/
    ├── server.js      API Express: dados, salvar e chat
    ├── dados.json     base de dados da plataforma
    ├── .env           chave da API (não versionar)
    └── ia/
        ├── ia.js      integração com o Gemini
        └── prompt.js  instruções do assistente
```

## Rotas da API

| Método | Rota            | Função                                                  |
|--------|-----------------|---------------------------------------------------------|
| GET    | `/api/dados`    | Retorna o `dados.json` completo                         |
| POST   | `/api/dados`    | Salva os dados e remove doações ocultadas pela empresa  |
| POST   | `/api/chat`     | Envia a pergunta ao assistente, com os dados da plataforma |

## Como rodar

1. Instale as dependências na raiz:
   ```bash
   npm install
   ```
2. Crie o arquivo `src/server/.env` com a sua chave:
   ```
   GEMINI_API_KEY=sua_chave
   ```
3. Inicie o backend:
   ```bash
   cd src/server
   node server.js
   ```
4. Em outro terminal, na raiz, inicie o frontend:
   ```bash
   npm start
   ```
   O site abre em `http://localhost:3000`.

## Observações

- O servidor remove campos sensíveis (senha, CPF, e-mail, telefone, token) antes de enviar os dados à IA.
- A API de salvamento ainda não tem autenticação. Não publique o projeto em um servidor aberto sem antes protegê-la.
- Os nomes dos modelos do Gemini em `ia/ia.js` devem ser confirmados com `listar-modelos.js` antes do uso.
- Nunca suba o arquivo `.env` para o repositório.

## Status

Em desenvolvimento. Cadastro, oferta e chat funcionam localmente. Pendências: proteção da API, regras completas no prompt do assistente e validação de campos obrigatórios no cadastro.