import React, { useState } from 'react';
import SidebarEmpresa from '../navBar/SidebarEmpresa';
import CadastrarDoacao from '../../../component/_Empresa/Links/cadastrarDoacao/cadastrarDoacao';
import MinhasDoacoes from '../../../component/_Empresa/Links/minhasDoacoes/minhasDoacoes';
import './HomeEmpresa.css';

function HomeEmpresa({ usuario }) {
    const [abaAtiva, setAbaAtiva] = useState('cadastrar-doacao');
    const [doacoes, setDoacoes] = useState([]);

    const adicionarDoacao = (novaDoacao) => {
        setDoacoes(prev => [
            {
                id: Date.now(),
                ...novaDoacao
            },
            ...prev
        ]);
    };

    return (
        <div className="home-empresa-container">
            <SidebarEmpresa
                usuario={usuario}
                abaAtiva={abaAtiva}
                setAbaAtiva={setAbaAtiva}
            />

            <main className="content-empresa">
                {abaAtiva === 'cadastrar-doacao' && (
                    <CadastrarDoacao onPublicar={adicionarDoacao} />
                )}

                {abaAtiva === 'minhas-doacoes' && (
                    <MinhasDoacoes doacoes={doacoes} />
                )}
            </main>
        </div>
    );
}

export default HomeEmpresa;