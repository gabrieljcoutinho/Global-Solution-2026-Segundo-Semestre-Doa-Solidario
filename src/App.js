import React, { useState, useEffect } from 'react';
import './App.css';

import Login from './component/login/Login';
import Cadastro from './component/cadastro/Cadastro';

import HomeEmpresa from './component/_Empresa/homeEmpresa/HomeEmpresa';
import HomeUsuario from './component/_Usuario/homeUsuario/HomeUsuario';

function App() {
    // Inicializa a tela e o usuário pegando do localStorage para o F5 não deslogar
    const [usuarioLogado, setUsuarioLogado] = useState(() => {
        try {
            const salvo = localStorage.getItem('usuarioLogado');
            return salvo ? JSON.parse(salvo) : null;
        } catch (e) {
            return null;
        }
    });

    const [tela, setTela] = useState(() => {
        try {
            const salvo = localStorage.getItem('usuarioLogado');
            if (salvo) {
                const user = JSON.parse(salvo);
                return user.tipo === 'empresa' ? 'homeEmpresa' : 'homeUsuario';
            }
        } catch (e) {}
        return 'login';
    });

    const [contas, setContas] = useState([]);
    const [doacoes, setDoacoes] = useState([]);

    // Carregar dados direto do servidor JSON ao iniciar o app
    useEffect(() => {
        fetch('http://localhost:3001/api/dados')
            .then(res => res.json())
            .then(data => {
                setContas(data.contas || []);
                setDoacoes(data.doacoes || []);
            })
            .catch(err => console.error('Erro ao buscar dados do servidor:', err));
    }, []);

    // Atualiza o localStorage sempre que o usuário logar ou deslogar
    useEffect(() => {
        try {
            if (usuarioLogado) {
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            } else {
                localStorage.removeItem('usuarioLogado');
            }
        } catch (e) {
            console.error('Erro ao salvar sessão:', e);
        }
    }, [usuarioLogado]);

    // Função auxiliar para salvar o estado atualizado direto no servidor JSON físico
    const salvarNoServidor = (novasContas, novasDoacoes) => {
        fetch('http://localhost:3001/api/dados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contas: novasContas, doacoes: novasDoacoes })
        })
        .catch(err => console.error('Erro ao salvar no servidor:', err));
    };

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

        const novasContasAtualizadas = [...contas, novaConta];
        setContas(novasContasAtualizadas);
        
        // Salva fisicamente no JSON do servidor
        salvarNoServidor(novasContasAtualizadas, doacoes);

        return {
            sucesso: true,
            mensagem: 'Conta criada com sucesso!'
        };
    };

    // Login validando diretamente no estado atualizado de contas
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
            imagem: '', // Limpo para garantir leveza no JSON físico
            id: `doacao-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            empresaId: usuarioLogado.id,
            empresaNome: usuarioLogado.nome,
            empresaEmail: usuarioLogado.email,
            dataCadastro: new Date().toISOString()
        };

        const novasDoacoesAtualizadas = [doacaoCompleta, ...doacoes];
        setDoacoes(novasDoacoesAtualizadas);

        // Salva fisicamente no JSON do servidor
        salvarNoServidor(contas, novasDoacoesAtualizadas);
    };

    // Excluir doação sincronizada para todos
    const handleExcluirDoacao = (idParaExcluir) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') {
            return;
        }

        const novasDoacoesAtualizadas = doacoes.filter(doacao => doacao.id !== idParaExcluir);
        setDoacoes(novasDoacoesAtualizadas);

        // Atualiza fisicamente o JSON no servidor
        salvarNoServidor(contas, novasDoacoesAtualizadas);
    };

    // Logout
    const handleLogout = () => {
        setUsuarioLogado(null);
        setTela('login');
        localStorage.removeItem('usuarioLogado');
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