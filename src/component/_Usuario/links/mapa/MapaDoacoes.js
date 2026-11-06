import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGeolocalizacao } from './useGeolocalizacao';
import './MapaDoacoes.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const iconeUsuario = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const AtualizarCentroMapa = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom(), { animate: true });
        }
    }, [center, map]);
    return null;
};

function MapaDoacoes({ doacoes = [] }) {
    // Aplica o filtro estrito de 50 km
    const { posicaoUsuario, statusPermissao, doacoesFiltradas } = useGeolocalizacao(doacoes, 50);

    const centroPadrao = [-23.550520, -46.633308];
    const centroMapa = posicaoUsuario || centroPadrao;

    return (
        <div className="mapaDoacoesContainer">
            <h2 className="mapaDoacoesTitulo">Mapa de Pontos de Doação Próximos</h2>
            
            {statusPermissao === 'pendente' && (
                <div className="avisoPermissaoGeo">
                    <p>📍 O <strong>DoaCerto</strong> precisa acessar sua localização para exibir campanhas e ONGs em um raio de até 50 km.</p>
                </div>
            )}

            {statusPermissao === 'negada' && (
                <div className="avisoPermissaoErro">
                    <p>⚠️ Permissão de localização negada. Ative no navegador para ver os pontos perto de você.</p>
                </div>
            )}

            <p className="mapaDoacoesSubtitulo">
                {posicaoUsuario 
                    ? `Exibindo campanhas de doação cadastradas a até 50 km da sua localização atual.`
                    : `Carregando sua posição em tempo real...`}
            </p>

            <div className="mapaWrapperReal">
                <MapContainer 
                    center={centroMapa} 
                    zoom={13} 
                    scrollWheelZoom={true} 
                    style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                >
                    <AtualizarCentroMapa center={posicaoUsuario} />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Ponto azul da posição atual do usuário */}
                    {posicaoUsuario && (
                        <Marker position={posicaoUsuario} icon={iconeUsuario}>
                            <Popup>
                                <div className="popupMapaCard">
                                    <h3>📍 Você está aqui</h3>
                                    <p>Sua posição é atualizada em tempo real.</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Apenas exibe no mapa as doações que estão DENTRO do raio de 50 km */}
                    {doacoesFiltradas.map((doacao) => (
                        <Marker key={doacao.id} position={doacao.coords}>
                            <Popup>
                                <div className="popupMapaCard">
                                    <h3>{doacao.empresaNome || 'Instituição'}</h3>
                                    <p><strong>Item:</strong> {doacao.item}</p>
                                    <p><strong>Local:</strong> {doacao.localizacao || 'Endereço informado'}</p>
                                    <p><strong>Distância:</strong> {doacao.distanciaKm} km de você</p>
                                    <p><strong>Quantidade:</strong> {doacao.quantidade} peças</p>
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(doacao.localizacao || 'São Paulo')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="linkRotaMaps"
                                    >
                                        Traçar Rota (Google Maps) 🗺️
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapaDoacoes;