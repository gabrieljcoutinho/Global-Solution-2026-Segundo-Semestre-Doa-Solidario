import React, { useState, useEffect } from 'react';
import './App.css';

import Login from './component/login/Login';
import Cadastro from './component/cadastro/Cadastro';

import HomeEmpresa from './component/_Empresa/homeEmpresa/HomeEmpresa';
import HomeUsuario from './component/_Usuario/homeUsuario/HomeUsuario';

import { buscarCoordenadas } from './utils/geocodificacao';

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

    // Geocodifica o endereço antes de salvar, para que a doação apareça no mapa
    const handleAdicionarDoacao = async (novaDoacao) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') {
            alert('Somente empresas podem publicar doações.');
            return;
        }

        const quantidade = Number(novaDoacao.quantidade);

        if (!Number.isInteger(quantidade) || quantidade < 1) {
            alert('A quantidade precisa ser um número inteiro maior que zero.');
            return;
        }

        const coords = await buscarCoordenadas(novaDoacao.localizacao);

        if (!coords) {
            alert('Não foi possível localizar este endereço no mapa. Verifique e tente novamente.');
            return;
        }

        const doacaoCompleta = {
            ...novaDoacao,
            quantidade,
            lat: coords.lat,
            lng: coords.lng,
            imagem: '',
            id: `doacao-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            empresaId: usuarioLogado.id,
            empresaNome: usuarioLogado.nome,
            empresaEmail: usuarioLogado.email,
            status: 'disponivel',
            doadorId: null,
            doadorNome: null,
            doadorEmail: null,
            quantidadeOferecida: null,
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

    // Marca uma doação concluída como oculta para um dos lados (empresa ou ONG).
    // Só remove de vez do servidor quando os dois lados já ocultaram.
    const ocultarConcluida = (id, campo) => {
        const anteriores = doacoes;
        const outroCampo = campo === 'ocultaEmpresa' ? 'ocultaUsuario' : 'ocultaEmpresa';

        const novasDoacoes = doacoes.flatMap(d => {
            if (d.id !== id) return [d];

            const atualizada = { ...d, [campo]: true };
            return atualizada[outroCampo] ? [] : [atualizada];
        });

        setDoacoes(novasDoacoes);

        salvarNoServidor(contas, novasDoacoes).then(ok => {
            if (!ok) {
                setDoacoes(anteriores);
                alert('Não foi possível excluir. Tente novamente.');
            }
        });
    };

    // Empresa exclui uma doação.
    // Concluída: some só da visão da empresa (a ONG continua vendo).
    // Disponível: é removida de vez. Pendente: precisa responder a oferta antes.
    const handleExcluirDoacao = (idParaExcluir) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') {
            return;
        }

        const alvo = doacoes.find(d => d.id === idParaExcluir);

        if (!alvo || alvo.empresaId !== usuarioLogado.id) {
            return;
        }

        if (alvo.status === 'pendente') {
            alert('Responda a oferta antes de excluir esta doação.');
            return;
        }

        if (alvo.status === 'concluida') {
            ocultarConcluida(idParaExcluir, 'ocultaEmpresa');
            return;
        }

        const novasDoacoesAtualizadas = doacoes.filter(doacao => doacao.id !== idParaExcluir);
        setDoacoes(novasDoacoesAtualizadas);
        salvarNoServidor(contas, novasDoacoesAtualizadas);
    };

    // ONG exclui uma doação concluída do próprio histórico (não afeta a empresa)
    const handleExcluirConclusaoUsuario = (idParaExcluir) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'usuario') {
            return;
        }

        const alvo = doacoes.find(d => d.id === idParaExcluir);

        if (!alvo || alvo.doadorId !== usuarioLogado.id || alvo.status !== 'concluida') {
            return;
        }

        ocultarConcluida(idParaExcluir, 'ocultaUsuario');
    };

    // ONG oferece uma quantidade da doação (1 até a quantidade pedida pela empresa)
    const handleOferecerDoacao = async (id, quantidadeOferecida) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'usuario') return false;

        const alvo = doacoes.find(d => d.id === id);

        if (!alvo || (alvo.status ?? 'disponivel') !== 'disponivel') {
            alert('Esta doação não está mais disponível.');
            return false;
        }

        const qtd = Number(quantidadeOferecida);
        const qtdMaxima = Number(alvo.quantidade);

        if (!Number.isInteger(qtd) || qtd < 1 || qtd > qtdMaxima) {
            alert(`Informe uma quantidade entre 1 e ${qtdMaxima}.`);
            return false;
        }

        const ok = await atualizarDoacao(id, {
            status: 'pendente',
            quantidadeOferecida: qtd,
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

    // Empresa aceita ou recusa a oferta
    const handleResponderDoacao = async (id, aceitar) => {
        if (!usuarioLogado || usuarioLogado.tipo !== 'empresa') return false;

        const alvo = doacoes.find(d => d.id === id);

        if (!alvo || alvo.empresaId !== usuarioLogado.id || alvo.status !== 'pendente') {
            return false;
        }

        const agora = new Date().toISOString();
        const limparOferta = {
            doadorId: null,
            doadorNome: null,
            doadorEmail: null,
            dataOferta: null,
            quantidadeOferecida: null
        };

        const anteriores = doacoes;
        let novasDoacoes;

        if (aceitar) {
            const oferecida = Number(alvo.quantidadeOferecida);
            const restante = Number(alvo.quantidade) - oferecida;

            if (restante <= 0) {
                // Aceitou tudo: a doação inteira fica concluída
                novasDoacoes = doacoes.map(d =>
                    d.id === id
                        ? { ...d, status: 'concluida', dataConclusao: agora }
                        : d
                );
            } else {
                // Aceitou parte: a parte aceita vira concluída e o restante volta a ficar disponível
                const registroConcluido = {
                    ...alvo,
                    id: `doacao-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    quantidade: oferecida,
                    status: 'concluida',
                    dataConclusao: agora
                };

                const restanteDisponivel = {
                    ...alvo,
                    ...limparOferta,
                    quantidade: restante,
                    status: 'disponivel'
                };

                novasDoacoes = doacoes.flatMap(d =>
                    d.id === id ? [restanteDisponivel, registroConcluido] : [d]
                );
            }
        } else {
            // Recusou: a doação volta a ficar disponível com a quantidade original
            novasDoacoes = doacoes.map(d =>
                d.id === id
                    ? { ...d, ...limparOferta, status: 'disponivel' }
                    : d
            );
        }

        setDoacoes(novasDoacoes);

        const ok = await salvarNoServidor(contas, novasDoacoes);

        if (!ok) {
            setDoacoes(anteriores);
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
                    onExcluirConclusao={handleExcluirConclusaoUsuario}
                />
            )}
        </div>
    );
}

export default App;