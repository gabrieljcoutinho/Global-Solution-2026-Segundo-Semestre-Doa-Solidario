import React from 'react';
import "./sidebar.css";

function SidebarEmpresa({ abaAtiva, setAbaAtiva, onLogout }) {
    return (
        <aside className="sidebar-empresa">
            <nav className="sidebar-nav">
                <button
                    type="button"
                    className={abaAtiva === 'cadastrar-doacao' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setAbaAtiva('cadastrar-doacao')}
                >
                    Cadastrar Doação
                </button>

                <button
                    type="button"
                    className={abaAtiva === 'minhas-doacoes' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setAbaAtiva('minhas-doacoes')}
                >
                    Doações Cadastradas
                </button>

                <button
                    type="button"
                    className={abaAtiva === 'doacoes-concluidas' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setAbaAtiva('doacoes-concluidas')}
                >
                    Doação Concluída
                </button>
            </nav>

            {/* Container do botão de logout fixado na parte inferior */}
            <div className="sidebar-footer">
                <button
                    type="button"
                    className="btn-logout"
                    onClick={onLogout}
                >
                    Deslogar
                </button>
            </div>
        </aside>
    );
}

export default SidebarEmpresa;