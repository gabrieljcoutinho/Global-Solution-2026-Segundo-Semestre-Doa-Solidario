import React, { useState } from 'react';
import SidebarEmpresa from '../navBar/SidebarEmpresa';
import './HomeEmpresa.css';

function HomeEmpresa({ usuario }) {
    const [abaAtiva, setAbaAtiva] = useState('cadastrar-doacao');

    return (
        <div className="home-empresa-container">
            {/* Sidebar Isolada */}
            <SidebarEmpresa
                usuario={usuario}
                abaAtiva={abaAtiva}
                setAbaAtiva={setAbaAtiva}
            />

            {/* Conteúdo Dinâmico */}
            <main className="content-empresa">
                {abaAtiva === 'cadastrar-doacao' && (
                    <div className="secao-conteudo">
                        <h1>Cadastrar Doação</h1>
                        <p>Preencha as informações necessárias para registrar uma nova doação no sistema.</p>
                    </div>
                )}

                {abaAtiva === 'minhas-doacoes' && (
                    <div className="secao-conteudo">
                        <h1>Minhas Doações</h1>
                        <p>Acompanhe o histórico e o status de todas as doações cadastradas pela sua empresa.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default HomeEmpresa;