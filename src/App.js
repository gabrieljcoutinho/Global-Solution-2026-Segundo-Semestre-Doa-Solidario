import React, { useState } from 'react';
import './App.css';

import Login from './component/login/Login';
import Cadastro from './component/cadastro/Cadastro';

import HomeEmpresa from './component/_Empresa/homeEmpresa/HomeEmpresa';
import HomeUsuario from './component/_Usuario/homeUsuario/HomeUsuario';

function App() {
    const [tela, setTela] = useState('login');
    const [usuarioLogado, setUsuarioLogado] = useState(null);

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
                />
            )}

            {tela === 'homeUsuario' && (
                <HomeUsuario
                    usuario={usuarioLogado}
                />
            )}
        </div>
    );
}

export default App;