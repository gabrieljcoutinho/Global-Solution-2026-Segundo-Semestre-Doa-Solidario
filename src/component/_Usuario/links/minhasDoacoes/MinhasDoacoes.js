import React, { useState } from 'react';
import './MinhasDoacoes.css';

const rotuloStatus = {
    disponivel: 'Disponível',
    pendente: 'Aguardando resposta da empresa',
};

function MinhasDoacoes({ usuario, doacoes = [], onOferecerDoacao }) {
    const [processandoId, setProcessandoId] = useState(null);
    const [quantidades, setQuantidades] = useState({});
    const [erros, setErros] = useState({});

    // Mostra as doações disponíveis e as que esta ONG ofereceu e ainda aguardam resposta.
    // Concluídas saem daqui e ficam só em "Doação Concluída".
    // Pendentes ou concluídas de outras ONGs ficam ocultas.
    const visiveis = doacoes.filter(doacao => {
        const status = doacao.status ?? 'disponivel';

        if (status === 'concluida') return false;
        if (status === 'disponivel') return true;

        return doacao.doadorId === usuario?.id;
    });

    const alterarQuantidade = (id, valor) => {
        setQuantidades(prev => ({ ...prev, [id]: valor }));
        setErros(prev => ({ ...prev, [id]: null }));
    };

    const oferecer = async (doacao) => {
        const qtd = Number(quantidades[doacao.id]);
        const qtdMaxima = Number(doacao.quantidade);

        if (!Number.isInteger(qtd) || qtd < 1 || qtd > qtdMaxima) {
            setErros(prev => ({
                ...prev,
                [doacao.id]: `Digite um número entre 1 e ${qtdMaxima}.`
            }));
            return;
        }

        setProcessandoId(doacao.id);

        try {
            await onOferecerDoacao?.(doacao.id, qtd);
        } finally {
            setProcessandoId(null);
        }
    };

    return (
        <div className="minhasDoacoesContainer">

            <h2 className="minhasDoacoesTitulo">
                Doações Disponíveis
            </h2>

            {visiveis.length === 0 ? (

                <p className="minhasDoacoesVazio">
                    Nenhuma doação disponível no momento.
                </p>

            ) : (

                <div className="minhasDoacoesGrid">

                    {visiveis.map((doacao) => {
                        const status = doacao.status ?? 'disponivel';
                        const ofereciPorMim = doacao.doadorId === usuario?.id;
                        const emEspera = processandoId === doacao.id || (status === 'pendente' && ofereciPorMim);
                        const qtdMaxima = Number(doacao.quantidade);

                        return (
                            <div key={doacao.id} className="doacaoCard">

                                <div className="doacaoCardBanner">

                                    {doacao.imagem ? (

                                        <img
                                            src={doacao.imagem}
                                            alt={doacao.item}
                                        />

                                    ) : (

                                        <div className="doacaoCardPlaceholder">
                                            Sem imagem
                                        </div>

                                    )}

                                </div>

                                <div className="doacaoCardBody">

                                    <h3>{doacao.item}</h3>

                                    <div
                                        className={`doacaoBadge ${
                                            doacao.urgencia
                                                ? doacao.urgencia
                                                    .normalize('NFD')
                                                    .replace(/[\u0300-\u036f]/g, '')
                                                    .toLowerCase()
                                                : ''
                                        }`}
                                    >
                                        <span className="dot"></span>
                                        {doacao.urgencia} Prioridade
                                    </div>

                                    <div className="doacaoStatus">
                                        <span className={`statusTag status-${status}`}>
                                            {rotuloStatus[status] ?? status}
                                        </span>
                                    </div>

                                    <div className="doacaoInfo">

                                        <div>
                                            <span>Tamanho</span>
                                            <strong>
                                                {doacao.tamanho || 'Não informado'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Quantidade</span>
                                            <strong>
                                                {doacao.quantidade
                                                    ? `${doacao.quantidade} peças`
                                                    : 'Não informada'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Prazo</span>
                                            <strong>
                                                {doacao.prazo
                                                    ? `Até ${doacao.prazo}`
                                                    : 'Não informado'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Local</span>
                                            <strong>
                                                {doacao.localizacao || 'Não informado'}
                                            </strong>
                                        </div>

                                    </div>

                                    {doacao.descricao && (
                                        <p className="doacaoDescricao">
                                            {doacao.descricao}
                                        </p>
                                    )}

                                    {status === 'disponivel' && !emEspera && (
                                        <div className="doacaoOferta">
                                            <label className="doacaoOfertaLabel">
                                                Quantas peças você vai doar? (até {qtdMaxima})
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={qtdMaxima}
                                                className="doacaoOfertaInput"
                                                placeholder={`De 1 a ${qtdMaxima}`}
                                                value={quantidades[doacao.id] ?? ''}
                                                onChange={(e) => alterarQuantidade(doacao.id, e.target.value)}
                                            />

                                            {erros[doacao.id] && (
                                                <p className="doacaoOfertaErro">
                                                    {erros[doacao.id]}
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                className="btnQueroDoar"
                                                onClick={() => oferecer(doacao)}
                                            >
                                                Quero doar
                                            </button>
                                        </div>
                                    )}

                                    {status === 'pendente' && ofereciPorMim && (
                                        <p className="doacaoOfertaInfo">
                                            Você ofereceu {doacao.quantidadeOferecida} peças.
                                        </p>
                                    )}

                                    {emEspera && (
                                        <button
                                            type="button"
                                            className="btnEmEspera"
                                            disabled
                                        >
                                            Em espera...
                                        </button>
                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>

            )}

        </div>
    );
}

export default MinhasDoacoes;