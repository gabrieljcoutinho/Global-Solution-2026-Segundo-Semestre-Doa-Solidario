
import React from 'react';
import './InicioUsuario.css';

import Banner from './Banner/Banner';
import Chat from './Chat/Chat';
import MinhasDoacoes from '../minhasDoacoes/MinhasDoacoes';

function InicioUsuario({ usuario, doacoes = [] }) {
    return (
        <div className="inicio-usuario-container">
            <br />

            <Banner />

            <Chat />

            <MinhasDoacoes
                usuario={usuario}
                doacoes={doacoes}
            />
        </div>
    );
}

export default InicioUsuario;
