import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeolocalizacao } from './useGeolocalizacao';
import './MapaDoacoes.css';

// Correção dos ícones padrão do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone azul para a posição do usuário
const iconeUsuario = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Ícone vermelho para as doações
const iconeDoacao = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Busca o caminho pelas ruas entre dois pontos [lat, lng] (OSRM, sem chave)
async function buscarRota(origem, destino) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origem[1]},${origem[0]};${destino[1]},${destino[0]}?overview=full&geometries=geojson`;

    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error('Falha ao buscar a rota.');

    const dados = await resposta.json();
    if (!dados.routes || dados.routes.length === 0) return null;

    const rota = dados.routes[0];

    return {
        pontos: rota.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        distanciaKm: (rota.distance / 1000).toFixed(1),
        minutos: Math.round(rota.duration / 60)
    };
}

// Recalcula o tamanho do mapa, centraliza na primeira posição e ajusta a tela à rota
const ForcarRedenrizacaoMapa = ({ center, rota }) => {
    const map = useMap();
    const centradoRef = useRef(false);

    useEffect(() => {
        const t = setTimeout(() => map.invalidateSize(), 250);
        return () => clearTimeout(t);
    }, [map]);

    useEffect(() => {
        if (center && !centradoRef.current) {
            map.setView(center, 13, { animate: false });
            centradoRef.current = true;
        }
    }, [center, map]);

    // Quando uma rota é traçada, enquadra o mapa para mostrar o caminho inteiro
    useEffect(() => {
        if (rota && rota.pontos.length > 0) {
            map.fitBounds(rota.pontos, { padding: [40, 40] });
        }
    }, [rota, map]);

    return null;
};

function MapaDoacoes({ doacoes = [] }) {
    const { posicaoUsuario, statusPermissao, doacoesFiltradas } = useGeolocalizacao(doacoes, 50);

    const [rota, setRota] = useState(null);
    const [doacaoRota, setDoacaoRota] = useState(null);
    const [carregandoRota, setCarregandoRota] = useState(false);
    const [erroRota, setErroRota] = useState(null);

    const centroPadrao = [-23.550520, -46.633308];
    const centroMapa = posicaoUsuario || centroPadrao;

    const tracarRota = async (doacao) => {
        if (!posicaoUsuario) return;

        setCarregandoRota(true);
        setErroRota(null);

        try {
            const resultado = await buscarRota(posicaoUsuario, doacao.coords);

            if (!resultado) {
                setErroRota('Não foi possível encontrar um caminho até esta doação.');
                setRota(null);
                setDoacaoRota(null);
                return;
            }

            setRota(resultado);
            setDoacaoRota(doacao);
        } catch (err) {
            console.error(err);
            setErroRota('Erro ao traçar a rota. Verifique sua conexão.');
        } finally {
            setCarregandoRota(false);
        }
    };

    const limparRota = () => {
        setRota(null);
        setDoacaoRota(null);
        setErroRota(null);
    };

    // Link para o Google Maps com a sua posição como origem (para escolher outro caminho)
    const linkGoogleMaps = (doacao) =>
        `https://www.google.com/maps/dir/?api=1&origin=${posicaoUsuario[0]},${posicaoUsuario[1]}&destination=${doacao.coords[0]},${doacao.coords[1]}&travelmode=driving`;

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

            {erroRota && (
                <div className="avisoPermissaoErro">
                    <p>⚠️ {erroRota}</p>
                </div>
            )}

            {rota && doacaoRota && (
                <div className="avisoRota">
                    <p>
                        🛣️ Rota até <strong>{doacaoRota.item}</strong>: {rota.distanciaKm} km, aprox. {rota.minutos} min de carro.
                    </p>
                    <div className="avisoRotaAcoes">
                        <a href={linkGoogleMaps(doacaoRota)} target="_blank" rel="noopener noreferrer" className="linkRotaMaps">
                            Ver outras opções no Google Maps
                        </a>
                        <button type="button" className="btnLimparRota" onClick={limparRota}>
                            Limpar rota
                        </button>
                    </div>
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
                    <ForcarRedenrizacaoMapa center={posicaoUsuario} rota={rota} />

                    <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                        maxZoom={19}
                    />

                    {/* Linha da rota traçada, em laranja */}
                    {rota && (
                        <Polyline
                            positions={rota.pontos}
                            pathOptions={{ color: '#dc2626', weight: 6, opacity: 0.9 }}
                        />
                    )}

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

                    {/* Pontos vermelhos das doações filtradas até 50 km */}
                    {doacoesFiltradas.map((doacao) => (
                        <Marker key={doacao.id} position={doacao.coords} icon={iconeDoacao}>
                            <Popup>
                                <div className="popupMapaCard">
                                    <h3>{doacao.empresaNome || 'Instituição'}</h3>
                                    <p><strong>Item:</strong> {doacao.item}</p>
                                    <p><strong>Local:</strong> {doacao.localizacao || 'Endereço informado'}</p>
                                    <p><strong>Distância:</strong> aprox. {doacao.distanciaKm} km de você</p>
                                    <p><strong>Quantidade:</strong> {doacao.quantidade} peças</p>
                                    <button
                                        type="button"
                                        className="linkRotaMaps btnTracarRota"
                                        onClick={() => tracarRota(doacao)}
                                        disabled={carregandoRota}
                                    >
                                        {carregandoRota ? 'Traçando...' : 'Traçar rota no mapa 🗺️'}
                                    </button>
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