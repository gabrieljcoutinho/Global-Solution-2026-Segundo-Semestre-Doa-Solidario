import React from 'react';
import "./sidebar.css";

function SidebarEmpresa({ abaAtiva, setAbaAtiva }) {
    return (
        <aside className="sidebar-empresa">
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
        </aside>
    );
}

export default SidebarEmpresa;