import React, { useState } from 'react';
import './HomeUsuario.css';

import SidebarUsuario from '../navBar/SidebarUsuario';
import InicioUsuario from '../links/Inicio/InicioUsuario';
import MinhasDoacoes from '../links/minhasDoacoes/MinhasDoacoes';

function HomeUsuario({ usuario, onLogout }) {
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
                    <InicioUsuario usuario={usuario} />
                )}

                {abaAtiva === 'minhas-doacoes' && (
                    <MinhasDoacoes usuario={usuario} />
                )}
            </main>
        </div>
    );
}

export default HomeUsuario;