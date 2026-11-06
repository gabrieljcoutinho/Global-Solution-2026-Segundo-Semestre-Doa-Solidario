import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGeolocalizacao } from './useGeolocalizacao';
import './MapaDoacoes.css';

// Correção dos ícones padrão do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone azul personalizado para a posição do utilizador
const iconeUsuario = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Componente para forçar o Leaflet a atualizar o tamanho e as ruas aparecerem
const ForcarRedenrizacaoMapa = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize(); // Força o mapa a recalcular os tiles das ruas
            if (center) {
                map.setView(center, 13, { animate: false });
            }
        }, 250);
    }, [center, map]);
    return null;
};

function MapaDoacoes({ doacoes = [] }) {
    const { posicaoUsuario, statusPermissao, doacoesFiltradas } = useGeolocalizacao(doacoes, 50);

    const centroPadrao = [-23.550520, -46.633308];
    const centroMapa = posicaoUsuario || centroPadrao;

    return (
        <div className="mapaDoacoesContainer">
            <h2 className="mapaDoacoesTitulo">Mapa de Pontos de Doação Próximos</h2>
            
            {statusPermissao === 'pendente' && (
                <div className="avisoPermissaoGeo">
                    <p>📍 O <strong>DoaCerto</strong> precisa aceder à sua localização para exibir campanhas e ONGs num raio de até 50 km.</p>
                </div>
            )}

            {statusPermissao === 'negada' && (
                <div className="avisoPermissaoErro">
                    <p>⚠️ Permissão de localização negada. Ative nas definições do navegador para ver os pontos perto de si.</p>
                </div>
            )}

            <p className="mapaDoacoesSubtitulo">
                {posicaoUsuario 
                    ? `A exibir campanhas de doação cadastradas a até 50 km da sua localização atual.`
                    : `A carregar a sua posição em tempo real...`}
            </p>

            <div className="mapaWrapperReal">
                <MapContainer 
                    center={centroMapa} 
                    zoom={13} 
                    scrollWheelZoom={true} 
                    style={{ width: '100%', height: '100%' }}
                >
                    <ForcarRedenrizacaoMapa center={posicaoUsuario} />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Ponto azul da posição atual do utilizador */}
                    {posicaoUsuario && (
                        <Marker position={posicaoUsuario} icon={iconeUsuario}>
                            <Popup>
                                <div className="popupMapaCard">
                                    <h3>📍 Você está aqui</h3>
                                    <p>A sua posição é atualizada em tempo real.</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Exibe as doações filtradas até 50 km */}
                    {doacoesFiltradas.map((doacao) => (
                        <Marker key={doacao.id} position={doacao.coords}>
                            <Popup>
                                <div className="popupMapaCard">
                                    <h3>{doacao.empresaNome || 'Instituição'}</h3>
                                    <p><strong>Item:</strong> {doacao.item}</p>
                                    <p><strong>Local:</strong> {doacao.localizacao || 'Endereço informado'}</p>
                                    <p><strong>Distância:</strong> aprox. {doacao.distanciaKm} km de você</p>
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