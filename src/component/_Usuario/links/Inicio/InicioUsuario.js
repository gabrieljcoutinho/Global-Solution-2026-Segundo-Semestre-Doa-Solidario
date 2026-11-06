import React from 'react';
import './InicioUsuario.css';


import Banner from './Banner/Banner';

function InicioUsuario({ usuario }) {
    return (
        <div className="inicio-usuario-container">
            <br/>
            <Banner />
        </div>
    );
}

export default InicioUsuario;