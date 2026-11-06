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
                    Cadastrar Doação
                </button>

                <button
                    className={abaAtiva === 'minhas-doacoes' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setAbaAtiva('minhas-doacoes')}
                >
                    Doações Cadastradas
                </button>
            </nav>
        </aside>
    );
}

export default SidebarEmpresa;