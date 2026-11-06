
import React from 'react';
import './MinhasDoacoes.css';

function MinhasDoacoes({ usuario, doacoes = [] }) {

    return (
        <div className="pagina-minhas-doacoes">

            <div className="usuarioDoacoesHeader">
                <div>
                    <h1>Minhas Doações</h1>
                    <p>
                        Confira as necessidades publicadas pelas empresas
                        e encontre oportunidades para ajudar.
                    </p>
                </div>

                <span className="usuarioDoacoesContador">
                    {doacoes.length} {doacoes.length === 1 ? 'necessidade' : 'necessidades'}
                </span>
            </div>

            {doacoes.length === 0 ? (

                <div className="usuarioDoacoesVazio">
                    <div className="usuarioDoacoesVazioIcon">
                        ♡
                    </div>

                    <h2>Nenhuma necessidade disponível</h2>

                    <p>
                        Quando uma empresa publicar uma nova necessidade,
                        ela aparecerá aqui para você.
                    </p>
                </div>

            ) : (

                <div className="usuarioDoacoesGrid">

                    {doacoes.map((doacao) => (

                        <article
                            key={doacao.id}
                            className="usuarioDoacaoCard"
                        >

                            <div className="usuarioDoacaoBanner">

                                {doacao.imagem ? (

                                    <img
                                        src={doacao.imagem}
                                        alt={doacao.item}
                                    />

                                ) : (

                                    <div className="usuarioDoacaoPlaceholder">
                                        <span>Sem imagem</span>
                                    </div>

                                )}

                            </div>

                            <div className="usuarioDoacaoBody">

                                <h3>{doacao.item}</h3>

                                <div
                                    className={`usuarioDoacaoBadge ${
                                        doacao.urgencia
                                            ? doacao.urgencia.toLowerCase()
                                            : ''
                                    }`}
                                >
                                    <span className="dot"></span>
                                    {doacao.urgencia || 'Não informada'} Prioridade
                                </div>

                                <div className="usuarioDoacaoInfo">

                                    <div>
                                        <span>Tamanho / Especificação</span>
                                        <strong>
                                            {doacao.tamanho || 'Não informado'}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Quantidade necessária</span>
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
                                        <span>Localização</span>
                                        <strong>
                                            {doacao.localizacao || 'Não informada'}
                                        </strong>
                                    </div>

                                </div>

                                {doacao.descricao && (
                                    <div className="usuarioDoacaoDescricao">
                                        <p>{doacao.descricao}</p>
                                    </div>
                                )}

                                <div className="usuarioDoacaoFooter">
                                    <span>♡</span>
                                    <p>
                                        Sua ajuda pode fazer a diferença!
                                    </p>
                                </div>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MinhasDoacoes;
