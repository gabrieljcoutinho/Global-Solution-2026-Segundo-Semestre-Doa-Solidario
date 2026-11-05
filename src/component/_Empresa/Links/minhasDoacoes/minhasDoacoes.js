import React from 'react';
import './minhasDoacoes.css';

const MinhasDoacoes = ({ doacoes = [] }) => {
  return (
    <div className="minhasDoacoesContainer">
      <h2 className="minhasDoacoesTitulo">Minhas Doações</h2>

      {doacoes.length === 0 ? (
        <p className="minhasDoacoesVazio">
          Nenhuma doação cadastrada ainda.
        </p>
      ) : (
        <div className="minhasDoacoesGrid">
          {doacoes.map((doacao) => (
            <div key={doacao.id} className="doacaoCard">
              <div className="doacaoCardBanner">
                {doacao.imagem ? (
                  <img src={doacao.imagem} alt={doacao.item} />
                ) : (
                  <div className="doacaoCardPlaceholder">Sem imagem</div>
                )}
              </div>

              <div className="doacaoCardBody">
                <h3>{doacao.item}</h3>

                <div className={`doacaoBadge ${doacao.urgencia.toLowerCase()}`}>
                  <span className="dot"></span>
                  {doacao.urgencia} Prioridade
                </div>

                <div className="doacaoInfo">
                  <div>
                    <span>Tamanho</span>
                    <strong>{doacao.tamanho}</strong>
                  </div>
                  <div>
                    <span>Quantidade</span>
                    <strong>{doacao.quantidade} peças</strong>
                  </div>
                  <div>
                    <span>Prazo</span>
                    <strong>Até {doacao.prazo}</strong>
                  </div>
                  <div>
                    <span>Local</span>
                    <strong>{doacao.localizacao}</strong>
                  </div>
                </div>

                {doacao.descricao && (
                  <p className="doacaoDescricao">{doacao.descricao}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MinhasDoacoes;