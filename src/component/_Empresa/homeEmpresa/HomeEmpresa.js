import React, { useState } from 'react';
import SidebarEmpresa from '../navBar/SidebarEmpresa';
import CadastrarDoacao from '../../../component/_Empresa/Links/cadastrarDoacao/cadastrarDoacao';
import MinhasDoacoes from '../../../component/_Empresa/Links/minhasDoacoes/minhasDoacoes';
import './HomeEmpresa.css';

function HomeEmpresa({ usuario, onLogout }) {
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

    // Função para excluir a doação pelo ID dentro da HomeEmpresa
    const excluirDoacao = (idParaExcluir) => {
        setDoacoes(prev => prev.filter(doacao => doacao.id !== idParaExcluir));
    };

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
                    <CadastrarDoacao onPublicar={adicionarDoacao} />
                )}

                {abaAtiva === 'minhas-doacoes' && (
                    <MinhasDoacoes 
                        doacoes={doacoes} 
                        onExcluir={excluirDoacao} 
                    />
                )}
            </main>
        </div>
    );
}

export default HomeEmpresa;