import React, { useState } from 'react';
import '../cadastro/Cadastro.css';
import imagemCadastro from '../../img/imgCadastro.png'; // Outra imagem diferente para o cadastro

const Cadastro = ({ onMudarTela }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastro efetuado');
  };

  return (
    <div className="cadastro-container">
      {/* Lado Esquerdo com fundo exclusivo de Cadastro */}
      <div className="cadastro-left-side">
        <img src={imagemCadastro} alt="Cadastro Background" className="cadastro-side-bg-image" />
        <div className="cadastro-side-overlay"></div>

        <div className="cadastro-left-header">
          <div className="cadastro-logo-icon">D</div>
          <div className="cadastro-logo-text">
            <span>DOA</span>
            <span className="cadastro-logo-subtitle">Solidário</span>
          </div>
        </div>

        
      </div>

      {/* Lado Direito - Formulário */}
      <div className="cadastro-right-side">
        <div className="cadastro-form-wrapper">
          <div className="cadastro-form-header">
            <span className="cadastro-welcome-tag">BEM-VINDO À REDE DOA SOLIDÁRIO</span>
            <h1>Comece a fazer parte.</h1>
            <p>Crie sua conta e faça a solidariedade circular.</p>
          </div>

          <div className="cadastro-tab-navigation">
            <button type="button" className="cadastro-tab-btn" onClick={() => onMudarTela('login')}>
              Entrar
            </button>
            <button type="button" className="cadastro-tab-btn active">
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="cadastro-login-form">
            <div className="cadastro-input-group">
              <label htmlFor="nome">Nome completo</label>
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
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                placeholder="seu@email.com/empresa@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="cadastro-input-group">
              <label htmlFor="password">Senha</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Mínimo de 6 caracteres" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="cadastro-submit-btn">
              Criar minha conta →
            </button>
          </form>

          

          <span className="cadastro-security-footer-text">
            Use seu e-mail pessoal para doar ou o e-mail corporativo da sua ONG para receber solicitações.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;