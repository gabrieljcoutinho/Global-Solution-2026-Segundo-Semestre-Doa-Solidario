import React, { useState } from 'react';
import './App.css';

import Login from './component/login/Login';
import Cadastro from './component/cadastro/Cadastro';

import HomeEmpresa from './component/_Empresa/homeEmpresa/HomeEmpresa';
import HomeUsuario from './component/_Usuario/homeUsuario/HomeUsuario';

// Importando os dados iniciais do arquivo JSON estruturado
import dadosIniciais from './dados.json';

function App() {
    const [tela, setTela] = useState('login');
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    // Inicializando estados diretamente com os dados estruturados
    const [contas, setContas] = useState(dadosIniciais.contas || []);
    const [doacoes, setDoacoes] = useState(dadosIniciais.doacoes || []);

    // Cadastrar conta
    const handleCadastrarConta = (dadosConta) => {
        const emailNormalizado = dadosConta.email.trim().toLowerCase();

        const emailExiste = contas.some(
            conta => conta.email.toLowerCase() === emailNormalizado
        );

        if (emailExiste) {
            return {
                sucesso: false,
                mensagem: 'Este e-mail já está cadastrado.'
            };
        }

        const novaConta = {
            id: `conta-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            nome: dadosConta.nome.trim(),
            email: emailNormalizado,
            senha: dadosConta.senha,
            tipo: dadosConta.tipo
        };

        setContas(estadoAtual => [
            ...estadoAtual,
            novaConta
        ]);

        return {
            sucesso: true,
            mensagem: 'Conta criada com sucesso!'
        };
    };

    // Login
    const handleLogin = (email, senha) => {
        const emailNormalizado = email.trim().toLowerCase();

        const contaEncontrada = contas.find(
            conta =>
                conta.email.toLowerCase() === emailNormalizado &&
                conta.senha === senha
        );

        if (!contaEncontrada) {
            return {
                sucesso: false,
                mensagem: 'E-mail ou senha incorretos.'
            };
        }

        const { senha: senhaSalva, ...dadosUsuario } = contaEncontrada;

        setUsuarioLogado(dadosUsuario);

        if (dadosUsuario.tipo === 'empresa') {
            setTela('homeEmpresa');
        } else {
            setTela('homeUsuario');
        }

        return {
            sucesso: true
        };
    };

    // Publicar doação / produto
    const handleAdicionarDoacao = (novaDoacao) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') {
            alert('Somente empresas podem publicar doações.');
            return;
        }

        const doacaoCompleta = {
            ...novaDoacao,
            // Se o usuário tentar enviar uma imagem pesada em base64, tratamos para evitar excessos
            imagem: novaDoacao.imagem && novaDoacao.imagem.length > 500000 ? '' : novaDoacao.imagem,
            id: `doacao-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            empresaId: usuarioLogado.id,
            empresaNome: usuarioLogado.nome,
            empresaEmail: usuarioLogado.email,
            dataCadastro: new Date().toISOString()
        };

        setDoacoes(estadoAtual => [
            doacaoCompleta,
            ...estadoAtual
        ]);
    };

    // Excluir doação sincronizada para todos
    const handleExcluirDoacao = (idParaExcluir) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') {
            return;
        }

        setDoacoes(estadoAtual =>
            estadoAtual.filter(doacao => doacao.id !== idParaExcluir)
        );
    };

    // Logout
    const handleLogout = () => {
        setUsuarioLogado(null);
        setTela('login');
    };

    return (
        <div>
            {tela === 'login' && (
                <Login
                    onMudarTela={setTela}
                    onLogin={handleLogin}
                />
            )}

            {tela === 'cadastro' && (
                <Cadastro
                    onMudarTela={setTela}
                    onCadastrarConta={handleCadastrarConta}
                />
            )}

            {tela === 'homeEmpresa' && usuarioLogado?.tipo === 'empresa' && (
                <HomeEmpresa
                    usuario={usuarioLogado}
                    onLogout={handleLogout}
                    doacoes={doacoes}
                    onPublicarDoacao={handleAdicionarDoacao}
                    onExcluirDoacao={handleExcluirDoacao}
                />
            )}

            {tela === 'homeUsuario' && usuarioLogado?.tipo === 'usuario' && (
                <HomeUsuario
                    usuario={usuarioLogado}
                    doacoes={doacoes}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
}

export default App;