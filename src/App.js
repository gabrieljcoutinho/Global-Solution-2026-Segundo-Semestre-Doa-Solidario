import React, { useState, useEffect } from 'react';
import './App.css';

import Login from './component/login/Login';
import Cadastro from './component/cadastro/Cadastro';

import HomeEmpresa from './component/_Empresa/homeEmpresa/HomeEmpresa';
import HomeUsuario from './component/_Usuario/homeUsuario/HomeUsuario';

function App() {
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

    useEffect(() => {
        fetch('http://localhost:3001/api/dados')
            .then(res => res.json())
            .then(data => {
                setContas(data.contas || []);
                setDoacoes(data.doacoes || []);
            })
            .catch(err => console.error('Erro ao buscar dados do servidor:', err));
    }, []);

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

    // Retorna true se o servidor confirmou a gravação
    const salvarNoServidor = async (novasContas, novasDoacoes) => {
        try {
            const res = await fetch('http://localhost:3001/api/dados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contas: novasContas, doacoes: novasDoacoes })
            });

            if (!res.ok) throw new Error(`Status ${res.status}`);
            return true;
        } catch (err) {
            console.error('Erro ao salvar no servidor:', err);
            return false;
        }
    };

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
        salvarNoServidor(novasContasAtualizadas, doacoes);

        return {
            sucesso: true,
            mensagem: 'Conta criada com sucesso!'
        };
    };

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

    const handleAdicionarDoacao = (novaDoacao) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') {
            alert('Somente empresas podem publicar doações.');
            return;
        }

        const doacaoCompleta = {
            ...novaDoacao,
            imagem: '',
            id: `doacao-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            empresaId: usuarioLogado.id,
            empresaNome: usuarioLogado.nome,
            empresaEmail: usuarioLogado.email,
            status: 'disponivel',
            doadorId: null,
            doadorNome: null,
            doadorEmail: null,
            dataOferta: null,
            dataCadastro: new Date().toISOString()
        };

        const novasDoacoesAtualizadas = [doacaoCompleta, ...doacoes];
        setDoacoes(novasDoacoesAtualizadas);
        salvarNoServidor(contas, novasDoacoesAtualizadas);
    };

    // Atualiza uma doação, grava no servidor e desfaz a mudança se a gravação falhar
    const atualizarDoacao = async (id, mudancas) => {
        const anteriores = doacoes;
        const novasDoacoes = doacoes.map(d =>
            d.id === id ? { ...d, ...mudancas } : d
        );

        setDoacoes(novasDoacoes);

        const ok = await salvarNoServidor(contas, novasDoacoes);

        if (!ok) {
            setDoacoes(anteriores);
        }

        return ok;
    };

    // Doações concluídas não podem ser excluídas: ficam no histórico
    const handleExcluirDoacao = (idParaExcluir) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') {
            return;
        }

        const alvo = doacoes.find(d => d.id === idParaExcluir);

        if (!alvo || alvo.empresaId !== usuarioLogado.id) {
            return;
        }

        if (alvo.status === 'concluida') {
            return;
        }

        const novasDoacoesAtualizadas = doacoes.filter(doacao => doacao.id !== idParaExcluir);
        setDoacoes(novasDoacoesAtualizadas);
        salvarNoServidor(contas, novasDoacoesAtualizadas);
    };

    // ONG oferece a doação
    const handleOferecerDoacao = async (id) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'usuario') return false;

        const alvo = doacoes.find(d => d.id === id);

        if (!alvo || (alvo.status ?? 'disponivel') !== 'disponivel') {
            alert('Esta doação não está mais disponível.');
            return false;
        }

        const ok = await atualizarDoacao(id, {
            status: 'pendente',
            doadorId: usuarioLogado.id,
            doadorNome: usuarioLogado.nome,
            doadorEmail: usuarioLogado.email,
            dataOferta: new Date().toISOString()
        });

        if (!ok) {
            alert('Não foi possível enviar sua oferta. Tente novamente.');
        }

        return ok;
    };

    // Empresa confirma ou cancela a oferta
    const handleResponderDoacao = async (id, aceitar) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') return false;

        const alvo = doacoes.find(d => d.id === id);

        if (!alvo || alvo.empresaId !== usuarioLogado.id || alvo.status !== 'pendente') {
            return false;
        }

        const mudancas = aceitar
            ? {
                status: 'concluida',
                dataConclusao: new Date().toISOString()
            }
            : {
                status: 'disponivel',
                doadorId: null,
                doadorNome: null,
                doadorEmail: null,
                dataOferta: null,
                dataConclusao: null
            };

        const ok = await atualizarDoacao(id, mudancas);

        if (!ok) {
            alert('Não foi possível salvar a resposta. Tente novamente.');
        }

        return ok;
    };

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
                    onResponderDoacao={handleResponderDoacao}
                />
            )}

            {tela === 'homeUsuario' && usuarioLogado?.tipo === 'usuario' && (
                <HomeUsuario
                    usuario={usuarioLogado}
                    doacoes={doacoes}
                    onLogout={handleLogout}
                    onOferecerDoacao={handleOferecerDoacao}
                />
            )}
        </div>
    );
}

export default App;