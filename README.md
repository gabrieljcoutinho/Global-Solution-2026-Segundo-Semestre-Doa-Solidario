# Doações Conectadas

Um espaço para conectar empresas que querem doar com ONGs que precisam de ajuda.

## Para que serve

Empresas cadastram itens que precisam ser doados, como roupas, alimentos ou materiais, informando quantidade, urgência, prazo e onde podem ser entregues. As ONGs veem essas necessidades e podem se oferecer para receber a doação.

Quando a empresa confirma a entrega, a doação sai da lista de disponíveis e fica registrada na aba **Doação Concluída**. Assim, cada lado consegue acompanhar quantas doações já fez ou recebeu.

## O que cada um vê

**Empresas**
- Cadastram as necessidades de doação
- Acompanham quem se ofereceu e confirmam ou cancelam
- Veem o histórico de doações recebidas

**ONGs**
- Veem as doações disponíveis e um mapa com os pontos de entrega
- Oferecem ajuda para as doações que quiserem atender
- Veem o histórico de doações feitas

## Como rodar o projeto

1. Instale o Node.js.
2. Instale as dependências:
   ```bash
   npm install express cors
   npm install
   ```
3. Inicie o servidor:
   ```bash
   node server.js
   ```
4. Em outro terminal, inicie a aplicação:
   ```bash
   npm start
   ```
5. Abra `http://localhost:3000` no navegador.

## Observação

Este é um protótipo de uso local, feito para testes e estudo. Ainda não deve ser usado com dados reais de pessoas.