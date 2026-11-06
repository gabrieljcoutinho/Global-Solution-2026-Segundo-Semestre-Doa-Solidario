
import React, { useState, useEffect } from 'react';
import './App.css';

import Login from './component/login/Login';
import Cadastro from './component/cadastro/Cadastro';

import HomeEmpresa from './component/_Empresa/homeEmpresa/HomeEmpresa';
import HomeUsuario from './component/_Usuario/homeUsuario/HomeUsuario';

const carregarDados = (chave) => {
    try {
        const dadosSalvos = localStorage.getItem(chave);
        return dadosSalvos ? JSON.parse(dadosSalvos) : [];
    } catch (error) {
        console.error(`Erro ao carregar ${chave}:`, error);
        return [];
    }
};

function App() {
    const [tela, setTela] = useState('login');
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    const [contas, setContas] = useState(() =>
        carregarDados('contas')
    );

    const [doacoes, setDoacoes] = useState(() =>
        carregarDados('doacoes')
    );

    // Salvar contas
    useEffect(() => {
        try {
            localStorage.setItem('contas', JSON.stringify(contas));
        } catch (error) {
            console.error('Erro ao salvar contas:', error);
            alert('Não foi possível salvar as contas.');
        }
    }, [contas]);

    // Salvar doações
    useEffect(() => {
        try {
            localStorage.setItem('doacoes', JSON.stringify(doacoes));
        } catch (error) {
            console.error('Erro ao salvar doações:', error);
            alert('Não foi possível salvar as doações. Verifique o espaço disponível.');
        }
    }, [doacoes]);

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

    // Publicar doação
    const handleAdicionarDoacao = (novaDoacao) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') {
            alert('Somente empresas podem publicar doações.');
            return;
        }

        const doacaoCompleta = {
            ...novaDoacao,
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

    // Excluir doação: somente a empresa proprietária
    const handleExcluirDoacao = (idParaExcluir) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') {
            return;
        }

        setDoacoes(estadoAtual =>
            estadoAtual.filter(doacao => {
                if (doacao.id !== idParaExcluir) {
                    return true;
                }

                return doacao.empresaId !== usuarioLogado.id;
            })
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
