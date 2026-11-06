import React from 'react';
import './InicioUsuario.css';


import Banner from './Banner/Banner';
import Chat from './Chat/Chat';

function InicioUsuario({ usuario }) {
    return (
        <div className="inicio-usuario-container">
            <br/>
            <Banner />
            <Chat />
        </div>
    );
}

export default InicioUsuario;