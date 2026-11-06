
import React, { useState } from 'react';

import SidebarEmpresa from '../navBar/SidebarEmpresa';

import CadastrarDoacao from '../../../component/_Empresa/Links/cadastrarDoacao/cadastrarDoacao';

import MinhasDoacoes from '../../../component/_Empresa/Links/minhasDoacoes/minhasDoacoes';

import './HomeEmpresa.css';

function HomeEmpresa({
    usuario,
    onLogout,
    doacoes,
    onPublicarDoacao,
    onExcluirDoacao
}) {
    const [abaAtiva, setAbaAtiva] = useState('cadastrar-doacao');

    return (
        <div className="home-empresa-container">

            <SidebarEmpresa
                usuario={usuario}
                abaAtiva={abaAtiva}
                setAbaAtiva={setAbaAtiva}
                onLogout={onLogout}
            />

            <main className="content-empresa">

                {abaAtiva === 'cadastrar-doacao' && (
                    <CadastrarDoacao
                        onPublicar={onPublicarDoacao}
                    />
                )}

                {abaAtiva === 'minhas-doacoes' && (
                    <MinhasDoacoes
                        doacoes={doacoes}
                        onExcluir={onExcluirDoacao}
                    />
                )}

            </main>
        </div>
    );
}

export default HomeEmpresa;
