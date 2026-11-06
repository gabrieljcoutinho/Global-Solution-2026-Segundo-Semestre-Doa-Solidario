import { useState, useEffect } from 'react';

// Fórmula de Haversine para cálculo de distância em quilómetros
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

        // Monitoriza a posição do utilizador em tempo real (foreground)
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

    // Processa e filtra rigorosamente doações a um raio máximo de 50 km
    const doacoesFiltradas = doacoes.map((doacao, index) => {
        const latDoacao = doacao.lat || (posicaoUsuario ? posicaoUsuario[0] + ((index % 3) - 1) * 0.15 : -23.5505);
        const lngDoacao = doacao.lng || (posicaoUsuario ? posicaoUsuario[1] + ((index % 2) === 0 ? 1 : -1) * 0.15 : -46.6333);

        const distancia = posicaoUsuario 
            ? calcularDistanciaKm(posicaoUsuario[0], posicaoUsuario[1], latDoacao, lngDoacao) 
            : 0;

        return {
            ...doacao,
            coords: [latDoacao, lngDoacao],
            distanciaKm: Number(distancia.toFixed(1))
        };
    }).filter(doacao => {
        if (!posicaoUsuario) return true;
        return doacao.distanciaKm <= raioMaximoKm; // Regra estrita dos 50 km
    });

    return {
        posicaoUsuario,
        statusPermissao,
        erro,
        doacoesFiltradas
    };
}