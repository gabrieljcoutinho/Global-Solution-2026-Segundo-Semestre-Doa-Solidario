import React from 'react';
import './MapaDoacoes.css';

function MapaDoacoes({ doacoes = [] }) {
    return (
        <div className="mapaDoacoesContainer">
            <h2 className="mapaDoacoesTitulo">Mapa de Locais de Doação</h2>
            <p className="mapaDoacoesSubtitulo">
                Visualize abaixo todos os pontos de atendimento e locais que estão solicitando doações na região.
            </p>

            <div className="mapaVisualizadorMock">
                {/* Simulação visual do mapa de radar para abranger todos os locais */}
                <div className="radarEfeito"></div>
                <div className="pinCentral">📍 Você está aqui</div>
            </div>

            <div className="listaLocaisProximos">
                <h3>Locais e ONGs Cadastradas ({doacoes.length})</h3>
                {doacoes.length === 0 ? (
                    <p className="semLocais">Nenhum local cadastrado no momento.</p>
                ) : (
                    <div className="gridLocais">
                        {doacoes.map((doacao) => (
                            <div key={doacao.id} className="cardLocalMapa">
                                <h4>{doacao.empresaNome || 'Instituição / Empresa'}</h4>
                                <p><strong>Item Necessário:</strong> {doacao.item}</p>
                                <p><strong>Local / Endereço:</strong> {doacao.localizacao || 'Endereço não informado'}</p>
                                <p><strong>Quantidade:</strong> {doacao.quantidade || '1'} peças</p>
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doacao.localizacao || 'São Paulo')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btnAbrirMaps"
                                >
                                    Abrir no Google Maps 🗺️
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MapaDoacoes;