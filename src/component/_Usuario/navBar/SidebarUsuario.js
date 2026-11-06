import React from 'react';
import './SidebarUsuario.css';

function SidebarUsuario({ abaAtiva, setAbaAtiva, onLogout }) {
    return (
        <aside className="sidebar-usuario">
            <nav className="sidebar-usuario-nav">
                <button
                    type="button"
                    className={abaAtiva === 'inicio' ? 'nav-usuario-item active' : 'nav-usuario-item'}
                    onClick={() => setAbaAtiva('inicio')}
                >
                    Início
                </button>

                <button
                    type="button"
                    className={abaAtiva === 'minhas-doacoes' ? 'nav-usuario-item active' : 'nav-usuario-item'}
                    onClick={() => setAbaAtiva('minhas-doacoes')}
                >
                    Minhas Doações
                </button>

                <button
                    type="button"
                    className={abaAtiva === 'mapa' ? 'nav-usuario-item active' : 'nav-usuario-item'}
                    onClick={() => setAbaAtiva('mapa')}
                >
                    Mapa de Doações
                </button>

                <button
                    type="button"
                    className={abaAtiva === 'doacoes-concluidas' ? 'nav-usuario-item active' : 'nav-usuario-item'}
                    onClick={() => setAbaAtiva('doacoes-concluidas')}
                >
                    Doação Concluída
                </button>
            </nav>

            <div className="sidebar-usuario-footer">
                <button
                    type="button"
                    className="btn-usuario-logout"
                    onClick={onLogout}
                >
                    Deslogar
                </button>
            </div>
        </aside>
    );
}

export default SidebarUsuario;