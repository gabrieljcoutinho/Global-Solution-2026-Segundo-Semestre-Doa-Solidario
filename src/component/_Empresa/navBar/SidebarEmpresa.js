import React from 'react';

import "./sidebar.css"

function SidebarEmpresa({ usuario, abaAtiva, setAbaAtiva }) {
    return (
        <aside className="sidebar-empresa">
            {/* Cabeçalho inspirado na nova imagem */}
            <div className="sidebar-header-custom">
                <div className="logo-container">
                    <span className="logo-letter">H</span>
                </div>
                <h2>HADES<br /><span>Solidário</span></h2>
                <p className="sidebar-subtitle">Conectando doações,<br />transformando vidas.</p>
                {usuario?.email && <p className="sidebar-user-email">{usuario.email}</p>}
            </div>

            {/* Navegação com os dois links solicitados */}
            <nav className="sidebar-nav">
                <button
                    className={abaAtiva === 'cadastrar-doacao' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setAbaAtiva('cadastrar-doacao')}
                >
                    <span className="nav-icon">📢</span>
                    Cadastrar Doação
                </button>

                <button
                    className={abaAtiva === 'minhas-doacoes' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setAbaAtiva('minhas-doacoes')}
                >
                    <span className="nav-icon">❤️</span>
                    Minhas Doações
                </button>
            </nav>

            {/* Card Inferior */}
            <div className="sidebar-footer-card">
                <div className="footer-card-icon">❤️</div>
                <p>Juntos por uma sociedade mais solidária.</p>
            </div>
        </aside>
    );
}

export default SidebarEmpresa;