import React, { useState } from 'react';
import SidebarEmpresa from '../navBar/SidebarEmpresa';
import CadastrarDoacao from '../../../component/_Empresa/Links/cadastrarDoacao/cadastrarDoacao';   // ← importa a página
import MinhasDoacoes from '../../../component/_Empresa/Links/minhasDoacoes/minhasDoacoes';       // ← importa a página
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

            {/* Conteúdo Dinâmico - páginas separadas */}
            <main className="content-empresa">
                {abaAtiva === 'cadastrar-doacao' && <CadastrarDoacao />}
                {abaAtiva === 'minhas-doacoes' && <MinhasDoacoes />}
            </main>
        </div>
    );
}

export default HomeEmpresa;