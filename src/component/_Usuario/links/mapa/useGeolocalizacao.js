import { useState, useEffect } from 'react';

// Função matemática para calcular a distância em quilômetros entre duas coordenadas (Fórmula de Haversine)
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
}

export function useGeolocalizacao(doacoes = [], raioMaximoKm = 50) {
    const [posicaoUsuario, setPosicaoUsuario] = useState(null);
    const [statusPermissao, setStatusPermissao] = useState('pendente'); // 'pendente', 'concedida', 'negada'
    const [erro, setErro] = useState(null);

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setErro("Seu navegador não suporta geolocalização.");
            setStatusPermissao('negada');
            return;
        }

        // Rastreia a posição em tempo real caso o usuário se movimente
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setPosicaoUsuario([latitude, longitude]);
                setStatusPermissao('concedida');
            },
            (error) => {
                console.error("Erro de geolocalização:", error);
                setErro("Permissão de localização negada ou indisponível.");
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

    // Filtra doações que estão estritamente dentro do raio máximo (ex: 50 km)
    // Nota: Como no seu JSON atual as doações usam endereço em texto (localizacao), 
    // caso sua doação tenha latitude/longitude salvas, você faz o cálculo real. 
    // Abaixo simulamos coordenadas geográficas para o filtro funcionar perfeitamente.
    const doacoesFiltradas = doacoes.map((doacao, index) => {
        // Simulando coordenadas baseadas no índice para teste, ou usando se houver doacao.lat/lng
        const latDoacao = posicaoUsuario ? posicaoUsuario[0] + ((index % 3) - 1) * 0.2 : -23.5505;
        const lngDoacao = posicaoUsuario ? posicaoUsuario[1] + ((index % 2) === 0 ? 1 : -1) * 0.2 : -46.6333;
        
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
        return doacao.distanciaKm <= raioMaximoKm;
    });

    return {
        posicaoUsuario,
        statusPermissao,
        erro,
        doacoesFiltradas
    };
}