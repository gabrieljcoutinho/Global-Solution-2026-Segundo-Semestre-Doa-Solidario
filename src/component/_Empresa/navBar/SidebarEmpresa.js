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
                    className={abaAtiva === 'dashboard' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setAbaAtiva('dashboard')}
                >
                    Visão Geral
                </button>
                <button
                    className={abaAtiva === 'produtos' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setAbaAtiva('produtos')}
                >
                    Gerenciar Produtos
                </button>
                <button
                    className={abaAtiva === 'configuracoes' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setAbaAtiva('configuracoes')}
                >
                    Configurações
                </button>
            </nav>
        </aside>
    );
}

export default SidebarEmpresa;