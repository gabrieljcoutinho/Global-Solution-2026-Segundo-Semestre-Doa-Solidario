import React, { useState } from 'react';
import './HomeUsuario.css';

import SidebarUsuario from '../navBar/SidebarUsuario';
import InicioUsuario from '../links/Inicio/InicioUsuario';
import MinhasDoacoes from '../links/minhasDoacoes/MinhasDoacoes';
import MapaDoacoes from '../links/mapa/MapaDoacoes';
import DoacoesConcluidas from '../links/doacoesConcluidas/DoacoesConcluidas';

function HomeUsuario({
    usuario,
    onLogout,
    doacoes = [],
    onOferecerDoacao,
    onExcluirConclusao
}) {
    const [abaAtiva, setAbaAtiva] = useState('inicio');

    return (
        <div className="layout-usuario">

            <SidebarUsuario
                abaAtiva={abaAtiva}
                setAbaAtiva={setAbaAtiva}
                onLogout={onLogout}
            />

            <main className="conteudo-usuario">

                {abaAtiva === 'inicio' && (
                    <InicioUsuario
                        usuario={usuario}
                        doacoes={doacoes}
                    />
                )}

                {abaAtiva === 'minhas-doacoes' && (
                    <MinhasDoacoes
                        usuario={usuario}
                        doacoes={doacoes}
                        onOferecerDoacao={onOferecerDoacao}
                    />
                )}

                {abaAtiva === 'mapa' && (
                    <MapaDoacoes
                        doacoes={doacoes}
                    />
                )}

                {abaAtiva === 'doacoes-concluidas' && (
                    <DoacoesConcluidas
                        usuario={usuario}
                        doacoes={doacoes}
                        onExcluir={onExcluirConclusao}
                    />
                )}

            </main>
        </div>
    );
}

export default HomeUsuario;