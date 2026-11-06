// Converte um endereço em { lat, lng } usando o Nominatim (OpenStreetMap, sem chave).
// Retorna null se o endereço não for encontrado.
export async function buscarCoordenadas(endereco) {
    const termo = endereco.toLowerCase().includes('brasil')
        ? endereco
        : `${endereco}, Brasil`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=1&q=${encodeURIComponent(termo)}`;

    const resposta = await fetch(url, {
        headers: { 'Accept-Language': 'pt-BR' }
    });

    if (!resposta.ok) {
        throw new Error('Falha ao consultar o endereço.');
    }

    const dados = await resposta.json();

    if (!dados.length) return null;

    return {
        lat: Number(dados[0].lat),
        lng: Number(dados[0].lon)
    };
}