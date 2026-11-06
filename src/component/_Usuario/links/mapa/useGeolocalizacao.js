import { useState, useEffect } from 'react';

// Fórmula de Haversine para cálculo de distância em quilômetros
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function useGeolocalizacao(doacoes = [], raioMaximoKm = 50) {
    const [posicaoUsuario, setPosicaoUsuario] = useState(null);
    const [statusPermissao, setStatusPermissao] = useState('pendente');
    const [erro, setErro] = useState(null);

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setErro("Geolocalização não suportada pelo navegador.");
            setStatusPermissao('negada');
            return;
        }

        // Monitora a posição do usuário em tempo real (foreground)
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setPosicaoUsuario([latitude, longitude]);
                setStatusPermissao('concedida');
            },
            (error) => {
                console.error("Erro ao obter geolocalização:", error);
                setStatusPermissao('negada');
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 20000
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Sem posição do usuário, não há como calcular o raio: não mostra pontos
    if (!posicaoUsuario) {
        return {
            posicaoUsuario,
            statusPermissao,
            erro,
            doacoesFiltradas: []
        };
    }

    // Considera apenas doações com coordenadas reais salvas no cadastro
    const doacoesFiltradas = doacoes
        .filter(doacao => typeof doacao.lat === 'number' && typeof doacao.lng === 'number')
        .map(doacao => {
            const distancia = calcularDistanciaKm(
                posicaoUsuario[0],
                posicaoUsuario[1],
                doacao.lat,
                doacao.lng
            );

            return {
                ...doacao,
                coords: [doacao.lat, doacao.lng],
                distanciaKm: Number(distancia.toFixed(1))
            };
        })
        .filter(doacao => doacao.distanciaKm <= raioMaximoKm);

    return {
        posicaoUsuario,
        statusPermissao,
        erro,
        doacoesFiltradas
    };
}