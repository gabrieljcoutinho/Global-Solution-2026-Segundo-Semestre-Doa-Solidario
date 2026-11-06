import React from 'react';
import './SidebarUsuario.css';

function SidebarUsuario({ abaAtiva, setAbaAtiva }) {
    return (
        <aside className="sidebar-usuario">
            <nav className="sidebar-usuario-nav">

                <button
                    className={abaAtiva === 'inicio' ? 'nav-usuario-item active' : 'nav-usuario-item'}
                    onClick={() => setAbaAtiva('inicio')}
                >
                    Início
                </button>

                <button
                    className={abaAtiva === 'minhas-doacoes' ? 'nav-usuario-item active' : 'nav-usuario-item'}
                    onClick={() => setAbaAtiva('minhas-doacoes')}
                >
                    Minhas Doações
                </button>

            </nav>
        </aside>
    );
}

export default SidebarUsuario;