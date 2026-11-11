import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
    iconSize: [25, 41],
    iconAnchor: [12, 20],
    popupAnchor: [1, -14],
});

const iconeDoacao = L.divIcon({
    className: 'marcadorDoacao',
    html: '<span class="pinoDoacao"></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
});

const criarIconeCluster = (cluster) =>
    L.divIcon({
        className: 'marcadorCluster',
        html: `<span class="clusterDoacao">${cluster.getChildCount()}</span>`,
        iconSize: [36, 36],
    });

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

// Grade de pontos ao redor da posição do usuário (aprox. 45 km de cada lado)
const DESLOCAMENTOS = [-0.4, -0.2, 0, 0.2, 0.4];

// Quantas horas à frente entram na previsão
const JANELA_HORAS = 6;

function gerarGrade([lat, lng]) {
    const pontos = [];
    DESLOCAMENTOS.forEach((dLat) => {
        DESLOCAMENTOS.forEach((dLng) => {
            pontos.push([lat + dLat, lng + dLng]);
        });
    });
    return pontos;
}

// Busca chuva atual e previsão horária em todos os pontos (Open-Meteo)
async function buscarChuva(pontos) {
    const latitudes = pontos.map((p) => p[0].toFixed(4)).join(',');
    const longitudes = pontos.map((p) => p[1].toFixed(4)).join(',');
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}` +
        `&current=precipitation&hourly=precipitation,precipitation_probability` +
        `&forecast_days=2&timezone=America%2FSao_Paulo`;

    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error('Falha ao buscar dados de chuva.');

    const dados = await resposta.json();
    const lista = Array.isArray(dados) ? dados : [dados];

    return lista.map((item, i) => {
        const agora = item.current?.precipitation ?? 0;
        const horas = item.hourly?.time ?? [];
        const mmHoras = item.hourly?.precipitation ?? [];
        const probHoras = item.hourly?.precipitation_probability ?? [];

        // Começa na hora atual (formato "AAAA-MM-DDTHH:00", igual ao da API)
        const chaveAgora = item.current?.time ? item.current.time.slice(0, 13) + ':00' : null;
        let inicio = chaveAgora ? horas.findIndex((t) => t >= chaveAgora) : 0;
        if (inicio < 0) inicio = 0;

        const janela = horas.slice(inicio, inicio + JANELA_HORAS).map((t, j) => ({
            hora: t,
            mm: mmHoras[inicio + j] ?? 0,
            prob: probHoras[inicio + j] ?? 0
        }));

        const pico = janela.reduce((a, b) => (b.mm > a.mm ? b : a), { hora: null, mm: 0 });
        const probMax = janela.reduce((m, h) => Math.max(m, h.prob), 0);

        return {
            coords: pontos[i],
            agora,
            pico: pico.mm,
            horaPico: pico.hora,
            probMax
        };
    });
}

// Classificação por intensidade (mm/h)
function classificarChuva(mm) {
    if (mm >= 7.6) return { cor: '#dc2626', nivel: 'Risco de enchente' };
    if (mm >= 2.5) return { cor: '#f97316', nivel: 'Chuva forte' };
    if (mm > 0) return { cor: '#facc15', nivel: 'Chuva fraca' };
    return { cor: '#ffffff', nivel: 'Sem chuva' };
}

// Recalcula o tamanho do mapa quando o contêiner muda de tamanho
const AjustarTamanhoMapa = () => {
    const map = useMap();

    useEffect(() => {
        map.whenReady(() => map.invalidateSize());

        const observer = new ResizeObserver(() => map.invalidateSize());
        observer.observe(map.getContainer());

        return () => observer.disconnect();
    }, [map]);

    return null;
};

const CentralizarMapa = ({ center, rota }) => {
    const map = useMap();
    const centradoRef = useRef(false);

    useEffect(() => {
        if (center && !centradoRef.current) {
            map.setView(center, 9, { animate: false });
            centradoRef.current = true;
        }
    }, [center, map]);

    useEffect(() => {
        if (rota && rota.pontos.length > 0) {
            map.fitBounds(rota.pontos, { padding: [40, 40] });
        }
    }, [rota, map]);

    return null;
};

// Um círculo por ponto da grade. Em "agora" a cor é a chuva atual; em "previsao" é o pico previsto.
const CamadaChuva = ({ dados, posicaoUsuario, modo }) => {
    const ehCentro = (p) =>
        p.coords[0] === posicaoUsuario[0] && p.coords[1] === posicaoUsuario[1];

    const valorDo = (p) => (modo === 'previsao' ? p.pico : p.agora);

    const pontoUsuario = dados.find(ehCentro);
    const outros = dados.filter((p) => !ehCentro(p));

    const textoPopup = (p) => {
        const mm = valorDo(p);
        const { nivel } = classificarChuva(mm);

        if (modo === 'previsao') {
            if (mm === 0) {
                return (
                    <>
                        <h3>Sem chuva prevista</h3>
                        <p>Nenhuma chuva prevista neste ponto nas próximas {JANELA_HORAS} horas.</p>
                    </>
                );
            }
            return (
                <>
                    <h3>{nivel} prevista</h3>
                    <p><strong>Pico:</strong> {mm.toFixed(1)} mm/h às {p.horaPico?.slice(11, 16)}</p>
                    <p><strong>Chance de chuva:</strong> {p.probMax}%</p>
                </>
            );
        }

        if (mm === 0) {
            return (
                <>
                    <h3>Sem chuva agora</h3>
                    <p>Nenhuma chuva neste ponto neste momento.</p>
                </>
            );
        }
        return (
            <>
                <h3>{nivel}</h3>
                <p><strong>Precipitação:</strong> {mm.toFixed(1)} mm/h</p>
            </>
        );
    };

    return (
        <>
            {outros.map((p, i) => {
                const mm = valorDo(p);
                const { cor } = classificarChuva(mm);
                const chove = mm > 0;
                return (
                    <CircleMarker
                        key={i}
                        center={p.coords}
                        radius={14}
                        pathOptions={{
                            color: chove ? cor : '#9ca3af',
                            fillColor: cor,
                            fillOpacity: chove ? 0.6 : 0.8,
                            weight: 2
                        }}
                    >
                        <Popup>
                            <div className="popupMapaCard">{textoPopup(p)}</div>
                        </Popup>
                    </CircleMarker>
                );
            })}

            {pontoUsuario && (
                <CircleMarker
                    center={posicaoUsuario}
                    radius={24}
                    pathOptions={{
                        color: valorDo(pontoUsuario) > 0 ? classificarChuva(valorDo(pontoUsuario)).cor : '#9ca3af',
                        fillColor: classificarChuva(valorDo(pontoUsuario)).cor,
                        fillOpacity: 0.6,
                        weight: 2
                    }}
                >
                    <Popup>
                        <div className="popupMapaCard">
                            <h3>📍 Sua região</h3>
                            {textoPopup(pontoUsuario)}
                        </div>
                    </Popup>
                </CircleMarker>
            )}
        </>
    );
};

function MapaDoacoes({ doacoes = [] }) {
    const { posicaoUsuario, statusPermissao, doacoesFiltradas } = useGeolocalizacao(doacoes, 50);

    const [rota, setRota] = useState(null);
    const [doacaoRota, setDoacaoRota] = useState(null);
    const [carregandoRota, setCarregandoRota] = useState(false);
    const [erroRota, setErroRota] = useState(null);

    // null = camada oculta, 'agora' = chuva atual, 'previsao' = chuva prevista
    const [modo, setModo] = useState(null);
    const [dadosChuva, setDadosChuva] = useState([]);
    const [carregandoChuva, setCarregandoChuva] = useState(false);
    const [horaChuva, setHoraChuva] = useState(null);

    const centroPadrao = [-23.550520, -46.633308];
    const centroMapa = posicaoUsuario || centroPadrao;

    // Busca os dados ao ativar qualquer modo e atualiza a cada 10 minutos
    useEffect(() => {
        if (!modo || !posicaoUsuario) return;
        let cancelado = false;

        const carregar = async () => {
            setCarregandoChuva(true);
            try {
                const resultado = await buscarChuva(gerarGrade(posicaoUsuario));
                if (!cancelado) {
                    setDadosChuva(resultado);
                    setHoraChuva(new Date());
                }
            } catch (err) {
                console.error('Erro ao carregar chuva:', err);
            } finally {
                if (!cancelado) setCarregandoChuva(false);
            }
        };

        carregar();
        const intervalo = setInterval(carregar, 10 * 60 * 1000);

        return () => {
            cancelado = true;
            clearInterval(intervalo);
        };
    }, [modo, posicaoUsuario]);

    const alternarModo = (novo) => setModo((atual) => (atual === novo ? null : novo));

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

    const linkGoogleMaps = (doacao) =>
        `https://www.google.com/maps/dir/?api=1&origin=${posicaoUsuario[0]},${posicaoUsuario[1]}&destination=${doacao.coords[0]},${doacao.coords[1]}&travelmode=driving`;

    const horaFormatada = horaChuva
        ? horaChuva.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
        : null;

    // Valor que define a cor de cada ponto, de acordo com o modo
    const valorDo = (p) => (modo === 'previsao' ? p.pico : p.agora);
    const pontosComChuva = dadosChuva.filter((p) => valorDo(p) > 0);
    const totalComChuva = pontosComChuva.length;
    const pontoMaisForte = pontosComChuva.reduce(
        (a, b) => (valorDo(b) > valorDo(a) ? b : a),
        pontosComChuva[0]
    );

    const textoOrientacao =
        modo === 'previsao'
            ? `Círculos mostram a chuva prevista para as próximas ${JANELA_HORAS} horas, na cor do pico esperado. Branco significa nenhuma chuva prevista naquele ponto.`
            : 'Círculos mostram a chuva neste momento. O círculo grande é a sua região. Branco significa que não está chovendo naquele ponto.';

    let resumo = null;
    if (modo && !carregandoChuva && dadosChuva.length > 0) {
        if (modo === 'previsao') {
            resumo = totalComChuva > 0
                ? `Vai chover em ${totalComChuva} de ${dadosChuva.length} pontos nas próximas ${JANELA_HORAS} horas. Pico de ${valorDo(pontoMaisForte).toFixed(1)} mm/h às ${pontoMaisForte.horaPico?.slice(11, 16)}.`
                : `Nenhuma chuva prevista nas próximas ${JANELA_HORAS} horas.`;
        } else {
            resumo = `${totalComChuva} de ${dadosChuva.length} pontos com chuva agora · atualizado às ${horaFormatada}`;
        }
    }

    return (
        <div className="mapaDoacoesContainer">
            <h2 className="mapaDoacoesTitulo">Mapa de Pontos de Doação Próximos</h2>

            {statusPermissao === 'pendente' && (
                <div className="avisoPermissaoGeo">
                    <p>📍 O <strong>DoaCerto</strong> precisa acessar sua localização para exibir campanhas e ONGs num raio de até 50 km.</p>
                </div>
            )}

            {statusPermissao === 'negada' && (
                <div className="avisoPermissaoErro">
                    <p>⚠️ Permissão de localização negada. Ative nas configurações do navegador para ver os pontos perto de você.</p>
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
                        <a
                            href={linkGoogleMaps(doacaoRota)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="linkRotaMaps"
                        >
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
                    ? 'Exibindo campanhas de doação cadastradas a até 50 km da sua localização atual.'
                    : 'Carregando sua posição em tempo real...'}
            </p>

            <div className="controlesMapa">
                <button
                    type="button"
                    className={`btnCamada ${modo === 'agora' ? 'btnCamadaAtiva' : ''}`}
                    onClick={() => alternarModo('agora')}
                >
                    {modo === 'agora' ? 'Ocultar chuva' : 'Mostrar chuva'}
                </button>

                <button
                    type="button"
                    className={`btnCamada ${modo === 'previsao' ? 'btnCamadaAtiva' : ''}`}
                    onClick={() => alternarModo('previsao')}
                >
                    {modo === 'previsao' ? 'Ocultar previsão' : 'Previsão'}
                </button>
            </div>

            {modo && (
                <div className="legendaChuva">
                    {carregandoChuva && dadosChuva.length === 0 && (
                        <span>Consultando chuva na região...</span>
                    )}

                    {resumo && <span className="legendaTexto">{resumo}</span>}

                    {resumo && (
                        <>
                            <span className="legendaItem">
                                <span className="legendaBolinha" style={{ background: '#ffffff' }} /> Sem chuva
                            </span>
                            <span className="legendaItem">
                                <span className="legendaBolinha" style={{ background: '#facc15' }} /> Chuva fraca
                            </span>
                            <span className="legendaItem">
                                <span className="legendaBolinha" style={{ background: '#f97316' }} /> Chuva forte
                            </span>
                            <span className="legendaItem">
                                <span className="legendaBolinha" style={{ background: '#dc2626' }} /> Risco de enchente
                            </span>
                        </>
                    )}
                </div>
            )}

            {modo && resumo && (
                <p className="chuvaOrientacao">{textoOrientacao}</p>
            )}

            {modo && totalComChuva > 0 && (
                <div className="avisoChuvaAtiva">
                    ⚠️ {modo === 'previsao'
                        ? `Previsão de chuva em ${totalComChuva} ponto(s) perto de você. Confira antes de sair para entregar ou retirar doações.`
                        : `Está chovendo em ${totalComChuva} ponto(s) perto de você. Confira as condições antes de sair.`}
                </div>
            )}

            <div
                className="mapaWrapperReal"
                style={{ width: '100%', height: '600px', position: 'relative' }}
            >
                <MapContainer
                    center={centroMapa}
                    zoom={9}
                    scrollWheelZoom={true}
                    style={{ width: '100%', height: '100%' }}
                >
                    <AjustarTamanhoMapa />
                    <CentralizarMapa center={posicaoUsuario} rota={rota} />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, dados de chuva: <a href="https://open-meteo.com/">Open-Meteo</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom={19}
                    />

                    {modo && dadosChuva.length > 0 && posicaoUsuario && (
                        <CamadaChuva dados={dadosChuva} posicaoUsuario={posicaoUsuario} modo={modo} />
                    )}

                    {rota && (
                        <Polyline
                            positions={rota.pontos}
                            pathOptions={{ color: '#dc2626', weight: 6, opacity: 0.9 }}
                        />
                    )}

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

                    <MarkerClusterGroup chunkedLoading iconCreateFunction={criarIconeCluster}>
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
                    </MarkerClusterGroup>
                </MapContainer>
            </div>
        </div>
    );
}

export default MapaDoacoes;