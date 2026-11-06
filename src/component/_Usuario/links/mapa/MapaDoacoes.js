import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './MapaDoacoes.css';

// Correção padrão para os ícones do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone personalizado diferenciado para a localização do usuário
const iconeUsuario = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Componente auxiliar para recentrar o mapa quando a localização do usuário for encontrada
function RecenterMap({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 14);
        }
    }, [center, map]);
    return null;
}

function MapaDoacoes({ doacoes = [] }) {
    // Coordenada padrão inicial (Centro de São Paulo caso o usuário negue a localização)
    const [posicaoUsuario, setPosicaoUsuario] = useState([-23.550520, -46.633308]);
    const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(true);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosicaoUsuario([latitude, longitude]);
                    setCarregandoLocalizacao(false);
                },
                (error) => {
                    console.error("Erro ao obter localização do usuário:", error);
                    setCarregandoLocalizacao(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            setCarregandoLocalizacao(false);
        }
    }, []);

    return (
        <div className="mapaDoacoesContainer">
            <h2 className="mapaDoacoesTitulo">Mapa de Pontos de Doação</h2>
            <p className="mapaDoacoesSubtitulo">
                {carregandoLocalizacao 
                    ? "Obtendo sua localização atual no mapa..." 
                    : "Sua localização exata foi encontrada. Veja os pontos de doação próximos abaixo:"}
            </p>

            <div className="mapaWrapperReal">
                <MapContainer 
                    center={posicaoUsuario} 
                    zoom={14} 
                    scrollWheelZoom={true} 
                    style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                >
                    <RecenterMap center={posicaoUsuario} />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Pin indicando onde o usuário está */}
                    <Marker position={posicaoUsuario} icon={iconeUsuario}>
                        <Popup>
                            <div className="popupMapaCard">
                                <h3>📍 Você está aqui</h3>
                                <p>Esta é a sua posição atual aproximada.</p>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Pins das doações cadastradas pelas empresas */}
                    {doacoes.map((doacao, index) => {
                        // Gerando coordenadas relativas ao redor do usuário para demonstração dos locais
                        const latOffset = ((index % 3) - 1) * 0.012;
                        const lngOffset = ((index % 2) === 0 ? 1 : -1) * 0.015 * (index + 1);
                        const posicaoPin = [posicaoUsuario[0] + latOffset, posicaoUsuario[1] + lngOffset];

                        return (
                            <Marker key={doacao.id || index} position={posicaoPin}>
                                <Popup>
                                    <div className="popupMapaCard">
                                        <h3>{doacao.empresaNome || 'Instituição'}</h3>
                                        <p><strong>Item:</strong> {doacao.item}</p>
                                        <p><strong>Local:</strong> {doacao.localizacao || 'Endereço informado'}</p>
                                        <p><strong>Quantidade:</strong> {doacao.quantidade || '1'} peças</p>
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
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapaDoacoes;