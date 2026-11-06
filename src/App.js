import React, { useState } from 'react';
import './App.css';

import Login from './component/login/Login';
import Cadastro from './component/cadastro/Cadastro';

import HomeEmpresa from './component/_Empresa/homeEmpresa/HomeEmpresa';
import HomeUsuario from './component/_Usuario/homeUsuario/HomeUsuario';

function App() {
    const [tela, setTela] = useState('login');
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    // Estado global ou centralizado das doações para permitir a exclusão
    const [doacoes, setDoacoes] = useState([
        {
            id: 1,
            item: 'Roupas Infantis',
            urgencia: 'Média',
            tamanho: '2 a 8 anos',
            quantidade: 100,
            prazo: '15/05/2025',
            localizacao: 'Av. Solidariedade, 123 - São Paulo/SP',
            descricao: 'yguygytgyugtuyg',
            imagem: ''
        }
    ]);

    // Função para excluir a doação pelo ID (filtra tirando a doação clicada)
    const handleExcluirDoacao = (idParaExcluir) => {
        setDoacoes((estadoAtual) => estadoAtual.filter((doacao) => doacao.id !== idParaExcluir));
    };

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

    // Função para deslogar: limpa o usuário e volta para a tela de login
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
                    onMudarTela={setTela}
                />
            )}

            {tela === 'homeUsuario' && (
                <HomeUsuario
                    usuario={usuarioLogado}
                    doacoes={doacoes}
                    onExcluirDoacao={handleExcluirDoacao}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
}

export default App;