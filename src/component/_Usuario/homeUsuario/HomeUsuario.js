import React, { useState } from 'react';
import './HomeUsuario.css';

import SidebarUsuario from '../navBar/SidebarUsuario';

function HomeUsuario({ usuario }) {

    const [abaAtiva, setAbaAtiva] = useState('inicio');

    return (
        <div className="layout-usuario">

            <SidebarUsuario
                abaAtiva={abaAtiva}
                setAbaAtiva={setAbaAtiva}
            />

            <main className="conteudo-usuario">

                {abaAtiva === 'inicio' && (
                    <div className="pagina-inicio-usuario">

                        <h1>Bem-vindo à plataforma!</h1>

                        <p>
                            Encontre oportunidades para ajudar e transformar vidas.
                        </p>

                    </div>
                )}

                {abaAtiva === 'minhas-doacoes' && (
                    <div className="pagina-minhas-doacoes">

                        <h1>Minhas Doações</h1>

                        <p>
                            Aqui você poderá visualizar e acompanhar suas doações.
                        </p>

                    </div>
                )}

            </main>

        </div>
    );
}

export default HomeUsuario;