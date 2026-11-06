import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGeolocalizacao } from './useGeolocalizacao';
import './MapaDoacoes.css';

// Correção dos ícones do Leaflet
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

// Componente para atualizar o centro do mapa automaticamente quando o usuário se movimenta
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
    // Utiliza o hook customizado com raio limite de 50 km
    const { posicaoUsuario, statusPermissao, doacoesFiltradas } = useGeolocalizacao(doacoes, 50);

    // Centro padrão (São Paulo capital) caso a permissão esteja pendente
    const centroPadrao = [-23.550520, -46.633308];
    const centroMapa = posicaoUsuario || centroPadrao;

    return (
        <div className="mapaDoacoesContainer">
            <h2 className="mapaDoacoesTitulo">Mapa de Pontos de Doação Próximos</h2>
            
            {/* Caixa de aviso de permissão explicativa */}
            {statusPermissao === 'pendente' && (
                <div className="avisoPermissaoGeo">
                    <p>📍 O <strong>DoaCerto</strong> precisa acessar sua localização atual apenas enquanto o aplicativo estiver aberto para mostrar as ONGs e pontos de coleta mais próximos de você (num raio de até 50 km).</p>
                </div>
            )}

            {statusPermissao === 'negada' && (
                <div className="avisoPermissaoErro">
                    <p>⚠️ A permissão de localização foi negada. Exibindo pontos gerais na região central de São Paulo.</p>
                </div>
            )}

            <p className="mapaDoacoesSubtitulo">
                {posicaoUsuario 
                    ? `Mostrando doações e pontos de coleta a até 50 km da sua localização em tempo real.`
                    : `Buscando sua posição atual...`}
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

                    {/* Marcador da Posição Atual do Usuário */}
                    {posicaoUsuario && (
                        <Marker position={posicaoUsuario} icon={iconeUsuario}>
                            <Popup>
                                <div className="popupMapaCard">
                                    <h3>📍 Você está aqui</h3>
                                    <p>Sua localização é atualizada em tempo real conforme você se movimenta.</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Marcadores das Doações Filtradas (<= 50km) */}
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