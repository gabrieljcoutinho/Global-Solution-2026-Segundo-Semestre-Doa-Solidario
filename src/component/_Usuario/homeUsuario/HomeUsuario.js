import React, { useState } from 'react';
import './HomeUsuario.css';

import SidebarUsuario from '../navBar/SidebarUsuario';
import InicioUsuario from '../links/Inicio/InicioUsuario';
import MinhasDoacoes from '../links/minhasDoacoes/MinhasDoacoes';
import MapaDoacoes from '../links/mapa/MapaDoacoes';

function HomeUsuario({ usuario, onLogout, doacoes = [] }) {
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
                    />
                )}

                {abaAtiva === 'mapa' && (
                    <MapaDoacoes
                        doacoes={doacoes}
                    />
                )}

            </main>
        </div>
    );
}

export default HomeUsuario;