import React, { useState } from 'react';

import SidebarEmpresa from '../navBar/SidebarEmpresa';

import CadastrarDoacao from '../../../component/_Empresa/Links/cadastrarDoacao/cadastrarDoacao';
import MinhasDoacoes from '../../../component/_Empresa/Links/minhasDoacoes/minhasDoacoes';
import DoacoesConcluidas from '../../../component/_Empresa/Links/doacoesConcluidas/DoacoesConcluidas';

import './HomeEmpresa.css';

function HomeEmpresa({
    usuario,
    onLogout,
    doacoes = [],
    onPublicarDoacao,
    onExcluirDoacao,
    onResponderDoacao
}) {
    const [abaAtiva, setAbaAtiva] = useState('cadastrar-doacao');

    // Publicações da empresa logada, sem as que ela ocultou (exclusão)
    const minhasDoacoes = doacoes.filter(
        doacao =>
            doacao.empresaId === usuario?.id &&
            !doacao.ocultaEmpresa
    );

    // Cadastradas: deixa de fora as concluídas, que ficam só no histórico
    const doacoesCadastradas = minhasDoacoes.filter(
        doacao => doacao.status !== 'concluida'
    );

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
                        doacoes={doacoesCadastradas}
                        onExcluir={onExcluirDoacao}
                        onResponder={onResponderDoacao}
                    />
                )}

                {abaAtiva === 'doacoes-concluidas' && (
                    <DoacoesConcluidas
                        doacoes={minhasDoacoes}
                        onExcluir={onExcluirDoacao}
                    />
                )}

            </main>
        </div>
    );
}

export default HomeEmpresa;