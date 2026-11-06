
import React from 'react';
import './MinhasDoacoes.css';

function MinhasDoacoes({ usuario, doacoes = [] }) {
    return (
        <div className="minhasDoacoesContainer">

            <h2 className="minhasDoacoesTitulo">
                Doações Disponíveis
            </h2>

            {doacoes.length === 0 ? (

                <p className="minhasDoacoesVazio">
                    Nenhuma doação disponível no momento.
                </p>

            ) : (

                <div className="minhasDoacoesGrid">

                    {doacoes.map((doacao) => (

                        <div
                            key={doacao.id}
                            className="doacaoCard"
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

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MinhasDoacoes;
