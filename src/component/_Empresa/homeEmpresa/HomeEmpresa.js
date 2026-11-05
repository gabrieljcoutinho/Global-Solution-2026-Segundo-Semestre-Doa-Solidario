import React, { useState } from 'react';
import SidebarEmpresa from '../navBar/SidebarEmpresa';
import './HomeEmpresa.css';

function HomeEmpresa({ usuario }) {
    const [abaAtiva, setAbaAtiva] = useState('dashboard');

    return (
        <div className="home-empresa-container">
            {/* Sidebar Isolada */}
            <SidebarEmpresa
                usuario={usuario}
                abaAtiva={abaAtiva}
                setAbaAtiva={setAbaAtiva}
            />

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