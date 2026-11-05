import React from 'react';

function SidebarEmpresa({ usuario, abaAtiva, setAbaAtiva }) {
    return (
        <aside className="sidebar-empresa">
            <div className="sidebar-header">
                <h2>Painel Empresa</h2>
                <p className="sidebar-user-email">{usuario?.email}</p>
            </div>

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

            <div className="sidebar-footer-card">
                <div className="footer-card-icon">❤️</div>
                <p>Juntos por uma sociedade mais solidária.</p>
            </div>
        </aside>
    );
}

export default SidebarEmpresa;