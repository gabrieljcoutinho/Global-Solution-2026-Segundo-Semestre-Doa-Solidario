import React, { useState } from 'react';
import './HomeEmpresa.css';

function HomeEmpresa({ usuario }) {
    const [abaAtiva, setAbaAtiva] = useState('dashboard');

    return (
        <div className="home-empresa-container">
            {/* Sidebar / Navbar Lateral */}
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

            {/* Conteúdo Dinâmico com base na aba selecionada */}
            <main className="content-empresa">
                {abaAtiva === 'dashboard' && (
                    <div className="secao-conteudo">
                        <h1>Visão Geral</h1>
                        <p>Bem-vindo ao painel corporativo. Aqui você acompanha as principais métricas.</p>
                    </div>
                )}

                {abaAtiva === 'produtos' && (
                    <div className="secao-conteudo">
                        <h1>Gerenciar Produtos</h1>
                        <p>Adicione, edite ou remova os produtos cadastrados pela sua empresa.</p>
                    </div>
                )}

                {abaAtiva === 'configuracoes' && (
                    <div className="secao-conteudo">
                        <h1>Configurações da Conta</h1>
                        <p>Atualize as informações corporativas e preferências de acesso.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default HomeEmpresa;