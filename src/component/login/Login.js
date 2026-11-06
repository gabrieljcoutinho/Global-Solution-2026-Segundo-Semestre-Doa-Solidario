
import React, { useState } from 'react';
import './login.css';

import imagemLogin from '../../img/telaLogim.png';

const Login = ({ onMudarTela, onLogin }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password.length < 6) {
            alert('A senha precisa ter pelo menos 6 caracteres.');
            return;
        }

        onLogin(email);
    };

    return (
        <div className="login-container">

            <div className="login-left-side login-bg-unico">
                <img
                    src={imagemLogin}
                    alt="Login Background"
                    className="side-bg-image"
                />

                <div className="side-overlay"></div>

                <div className="left-header">
                    <div className="logo-icon">D</div>

                    <div className="logo-text">
                        <span>DOA</span>
                        <span className="logo-subtitle">
                            Solidário
                        </span>
                    </div>
                </div>
            </div>

            <div className="login-right-side">

                <div className="form-wrapper">

                    <div className="form-header">
                        <span className="welcome-tag">
                            BEM-VINDO À REDE DOA SOLIDÁRIO
                        </span>

                        <h1>Que bom ter você aqui.</h1>

                        <p>
                            Entre para continuar conectando.
                        </p>
                    </div>

                    <div className="tab-navigation">

                        <button
                            type="button"
                            className="tab-btn active"
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className="tab-btn"
                            onClick={() => onMudarTela('cadastro')}
                        >
                            Criar conta
                        </button>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="login-form"
                    >

                        <div className="input-group">

                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                type="email"
                                id="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                        </div>

                        <div className="input-group">

                            <label htmlFor="password">
                                Senha
                            </label>

                            <input
                                type="password"
                                id="password"
                                placeholder="Mínimo de 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                        >
                            Entrar na minha conta →
                        </button>

                    </form>

                    

                    <span className="security-footer-text">
                        Acesso seguro para doadores e organizações.
                    </span>

                </div>

            </div>

        </div>
    );
};

export default Login;
