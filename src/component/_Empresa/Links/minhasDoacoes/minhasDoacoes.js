import React from 'react';
import './minhasDoacoes.css';

const rotuloStatus = {
  disponivel: 'Disponível',
  pendente: 'Aguardando sua resposta',
  concluida: 'Concluída'
};

const MinhasDoacoes = ({ doacoes = [], onExcluir, onResponder }) => {
  return (
    <div className="minhasDoacoesContainer">
      <h2 className="minhasDoacoesTitulo">Doações Cadastradas</h2>

      {doacoes.length === 0 ? (
        <p className="minhasDoacoesVazio">
          Nenhuma doação cadastrada ainda.
        </p>
      ) : (
        <div className="minhasDoacoesGrid">
          {doacoes.map((doacao) => {
            const status = doacao.status ?? 'disponivel';
            const concluida = status === 'concluida';

            return (
              <div
                key={doacao.id}
                className={`doacaoCard ${concluida ? 'doacaoCardConcluida' : ''}`}
              >
                <div className="doacaoCardBanner">
                  {doacao.imagem ? (
                    <img src={doacao.imagem} alt={doacao.item} />
                  ) : (
                    <div className="doacaoCardPlaceholder">Sem imagem</div>
                  )}

                  <button
                    type="button"
                    className="doacaoBtnExcluir"
                    onClick={() => onExcluir && onExcluir(doacao.id)}
                    title="Excluir doação"
                    disabled={status === 'pendente'}
                  >
                    ✕
                  </button>
                </div>

                <div className="doacaoCardBody">
                  <h3>{doacao.item}</h3>

                  <div className={`doacaoBadge ${doacao.urgencia ? doacao.urgencia.toLowerCase() : ''}`}>
                    <span className="dot"></span>
                    {doacao.urgencia} Prioridade
                  </div>

                  <div className="doacaoStatus">
                    <span className={`statusTag status-${status}`}>
                      {rotuloStatus[status]}
                    </span>
                    {doacao.doadorNome && (
                      <span className="doadorNome">de {doacao.doadorNome}</span>
                    )}
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

                  {status === 'pendente' && (
                    <div className="doacaoAcoesResposta">
                      <button
                        type="button"
                        className="btnAceitar"
                        onClick={() => onResponder && onResponder(doacao.id, true)}
                      >
                        Aceitar
                      </button>
                      <button
                        type="button"
                        className="btnRecusar"
                        onClick={() => onResponder && onResponder(doacao.id, false)}
                      >
                        Recusar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MinhasDoacoes;