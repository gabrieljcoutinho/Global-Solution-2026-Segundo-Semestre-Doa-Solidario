import React, { useState } from 'react';
import './minhasDoacoes.css';
import './acoesOferta.css';
import '../../../doacaoConcluida.css';

const rotuloStatus = {
  disponivel: 'Disponível',
  pendente: 'Oferta recebida',
  concluida: 'Doação concluída'
};

const classeUrgencia = (urgencia) =>
  (urgencia || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const MinhasDoacoes = ({ doacoes = [], onExcluir, onResponder }) => {
  const [processando, setProcessando] = useState(null);

  const responder = async (id, aceitar) => {
    setProcessando({ id, aceitar });

    try {
      await onResponder?.(id, aceitar);
    } finally {
      setProcessando(null);
    }
  };

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
            const pendente = status === 'pendente';
            const ocupada = processando?.id === doacao.id;
            const confirmando = ocupada && processando.aceitar;

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

                  {!concluida && (
                    <button
                      type="button"
                      className="doacaoBtnExcluir"
                      onClick={() => onExcluir && onExcluir(doacao.id)}
                      title="Excluir doação"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="doacaoCardBody">
                  <h3>{doacao.item}</h3>

                  <div className={`doacaoBadge ${classeUrgencia(doacao.urgencia)}`}>
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
                      <strong>{doacao.tamanho || 'Não informado'}</strong>
                    </div>
                    <div>
                      <span>Quantidade</span>
                      <strong>
                        {pendente && doacao.quantidadeOferecida
                          ? `${doacao.quantidadeOferecida} de ${doacao.quantidade} peças`
                          : doacao.quantidade
                            ? `${doacao.quantidade} peças`
                            : 'Não informada'}
                      </strong>
                    </div>
                    <div>
                      <span>Prazo</span>
                      <strong>
                        {doacao.prazo ? `Até ${doacao.prazo}` : 'Não informado'}
                      </strong>
                    </div>
                    <div>
                      <span>Local</span>
                      <strong>{doacao.localizacao || 'Não informado'}</strong>
                    </div>
                  </div>

                  {doacao.descricao && (
                    <p className="doacaoDescricao">{doacao.descricao}</p>
                  )}

                  {pendente && (
                    <div className="doacaoOferta">
                      <p>
                        Oferecida por <strong>{doacao.doadorNome || 'ONG'}</strong>: {doacao.quantidadeOferecida} peças
                      </p>

                      <div className="doacaoOfertaAcoes">
                        {confirmando ? (
                          <button type="button" className="btnEmEspera" disabled>
                            Esperando confirmação...
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btnConfirmar"
                            disabled={ocupada}
                            onClick={() => responder(doacao.id, true)}
                          >
                            Confirmar Doação
                          </button>
                        )}

                        <button
                          type="button"
                          className="btnCancelarOferta"
                          disabled={ocupada}
                          onClick={() => responder(doacao.id, false)}
                        >
                          Cancelar
                        </button>
                      </div>
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