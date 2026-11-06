import React from 'react';
import './MinhasDoacoes.css';

const rotuloStatus = {
    disponivel: 'Disponível',
    pendente: 'Aguardando resposta da empresa',
    concluida: 'Doação concluída'
};

function MinhasDoacoes({ usuario, doacoes = [], onOferecerDoacao }) {

    // Mostra as doações disponíveis e as que esta ONG já ofereceu para doar.
    // Doações pendentes ou concluídas de outras ONGs ficam ocultas.
    const visiveis = doacoes.filter(doacao => {
        const status = doacao.status ?? 'disponivel';

        if (status === 'disponivel') return true;

        return doacao.doadorId === usuario?.id;
    });

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
                        const concluida = status === 'concluida';
                        const ofereciPorMim = doacao.doadorId === usuario?.id;

                        return (
                            <div
                                key={doacao.id}
                                className={`doacaoCard ${concluida ? 'doacaoCardConcluida' : ''}`}
                            >

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
                                                ? doacao.urgencia.toLowerCase()
                                                : ''
                                        }`}
                                    >
                                        <span className="dot"></span>
                                        {doacao.urgencia} Prioridade
                                    </div>

                                    <div className="doacaoStatus">
                                        <span className={`statusTag status-${status}`}>
                                            {rotuloStatus[status]}
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
                                                {doacao.quantidade || 'Não informada'} peças
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

                                    {/* Botão para oferecer a doação (somente se estiver disponível) */}
                                    {status === 'disponivel' && (
                                        <button
                                            type="button"
                                            className="btnQueroDoar"
                                            onClick={() => onOferecerDoacao && onOferecerDoacao(doacao.id)}
                                        >
                                            Quero doar
                                        </button>
                                    )}

                                    {/* Estado depois do clique, enquanto a empresa não responde */}
                                    {status === 'pendente' && ofereciPorMim && (
                                        <button type="button" className="btnQueroDoar" disabled>
                                            Aguardando resposta
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