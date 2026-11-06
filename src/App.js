
import React, { useState, useEffect } from 'react';
import './App.css';

import Login from './component/login/Login';
import Cadastro from './component/cadastro/Cadastro';

import HomeEmpresa from './component/_Empresa/homeEmpresa/HomeEmpresa';
import HomeUsuario from './component/_Usuario/homeUsuario/HomeUsuario';

function App() {
    const [tela, setTela] = useState('login');
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    // Carrega as doações salvas no navegador
    const [doacoes, setDoacoes] = useState(() => {
        try {
            const dadosSalvos = localStorage.getItem('doacoes');
            return dadosSalvos ? JSON.parse(dadosSalvos) : [];
        } catch (error) {
            console.error('Erro ao carregar doações:', error);
            return [];
        }
    });

    // Salva automaticamente sempre que as doações forem alteradas
    useEffect(() => {
        try {
            localStorage.setItem('doacoes', JSON.stringify(doacoes));
        } catch (error) {
            console.error('Erro ao salvar doações:', error);
            alert('Não foi possível salvar as doações no navegador.');
        }
    }, [doacoes]);

    // Adiciona uma nova doação
    const handleAdicionarDoacao = (novaDoacao) => {
        const doacaoCompleta = {
            ...novaDoacao,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            dataCadastro: new Date().toISOString()
        };

        setDoacoes((estadoAtual) => [
            doacaoCompleta,
            ...estadoAtual
        ]);
    };

    // Exclui uma doação somente quando solicitado
    const handleExcluirDoacao = (idParaExcluir) => {
        setDoacoes((estadoAtual) =>
            estadoAtual.filter(
                (doacao) => doacao.id !== idParaExcluir
            )
        );
    };

    // Autenticação
    const handleLogin = (email) => {
        if (email.toLowerCase().trim() === 'empresa@gmail.com') {
            setUsuarioLogado({
                email,
                tipo: 'empresa'
            });

            setTela('homeEmpresa');
        } else {
            setUsuarioLogado({
                email,
                tipo: 'usuario'
            });

            setTela('homeUsuario');
        }
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
                />
            )}

            {tela === 'homeEmpresa' && (
                <HomeEmpresa
                    usuario={usuarioLogado}
                    onLogout={handleLogout}
                    doacoes={doacoes}
                    onPublicarDoacao={handleAdicionarDoacao}
                    onExcluirDoacao={handleExcluirDoacao}
                />
            )}

            {tela === 'homeUsuario' && (
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
