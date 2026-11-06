
import React, { useState } from 'react';
import '../cadastro/Cadastro.css';
import imagemCadastro from '../../img/imgCadastro.png';

const Cadastro = ({ onMudarTela, onCadastrarConta }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tipo, setTipo] = useState('usuario');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password.length < 6) {
            alert('A senha precisa ter pelo menos 6 caracteres.');
            return;
        }

        const resultado = onCadastrarConta({
            nome,
            email,
            senha: password,
            tipo
        });

        if (!resultado?.sucesso) {
            alert(resultado?.mensagem || 'Erro ao cadastrar conta.');
            return;
        }

        alert('Conta criada com sucesso! Faça login para continuar.');

        setNome('');
        setEmail('');
        setPassword('');
        setTipo('usuario');

        onMudarTela('login');
    };

    return (
        <div className="cadastro-container">

            <div className="cadastro-left-side">
                <img
                    src={imagemCadastro}
                    alt="Cadastro Background"
                    className="cadastro-side-bg-image"
                />

                <div className="cadastro-side-overlay"></div>

                <div className="cadastro-left-header">
                    <div className="cadastro-logo-icon">D</div>

                    <div className="cadastro-logo-text">
                        <span>DOA</span>
                        <span className="cadastro-logo-subtitle">
                            Solidário
                        </span>
                    </div>
                </div>
            </div>

            <div className="cadastro-right-side">

                <div className="cadastro-form-wrapper">

                    <div className="cadastro-form-header">
                        <span className="cadastro-welcome-tag">
                            BEM-VINDO À REDE DOA SOLIDÁRIO
                        </span>

                        <h1>Comece a fazer parte.</h1>

                        <p>
                            Crie sua conta e faça a solidariedade circular.
                        </p>
                    </div>

                    <div className="cadastro-tab-navigation">

                        <button
                            type="button"
                            className="cadastro-tab-btn"
                            onClick={() => onMudarTela('login')}
                        >
                            Entrar
                        </button>

                        <button
                            type="button"
                            className="cadastro-tab-btn active"
                        >
                            Criar conta
                        </button>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="cadastro-login-form"
                    >

                        <div className="cadastro-input-group">
                            <label htmlFor="nome">
                                Nome completo
                            </label>

                            <input
                                type="text"
                                id="nome"
                                placeholder="Como podemos chamar você?"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>

                        <div className="cadastro-input-group">
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

                        <div className="cadastro-input-group">
                            <label htmlFor="tipo">
                                Tipo de conta
                            </label>

                            <select
                                id="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                required
                            >
                                <option value="usuario">
                                    Pessoa física
                                </option>

                                <option value="empresa">
                                    Empresa / Organização
                                </option>
                            </select>
                        </div>

                        <div className="cadastro-input-group">
                            <label htmlFor="password">
                                Senha
                            </label>

                            <input
                                type="password"
                                id="password"
                                placeholder="Mínimo de 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="cadastro-submit-btn"
                        >
                            Criar minha conta →
                        </button>

                    </form>

                    <span className="cadastro-security-footer-text">
                        Use seu e-mail pessoal para acessar as doações ou
                        cadastre sua organização para publicar e gerenciar
                        necessidades.
                    </span>

                </div>

            </div>

        </div>
    );
};

export default Cadastro;
