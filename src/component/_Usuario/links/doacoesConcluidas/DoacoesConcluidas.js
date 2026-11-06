import React from 'react';
import '../minhasDoacoes/MinhasDoacoes.css';
import './doacoesConcluidas.css';

const formatarData = (iso) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR') : 'Não informada';

const DoacoesConcluidas = ({ usuario, doacoes = [] }) => {
  // Mostra só as doações concluídas em que esta ONG é a doadora
  const concluidas = doacoes
    .filter(
      (doacao) =>
        doacao.status === 'concluida' && doacao.doadorId === usuario?.id
    )
    .sort((a, b) => (b.dataConclusao || '').localeCompare(a.dataConclusao || ''));

  return (
    <div className="minhasDoacoesContainer">
      <h2 className="minhasDoacoesTitulo">Doação Concluída</h2>

      <div className="doacoesConcluidasResumo">
        Você fez <strong>{concluidas.length}</strong> doações
      </div>

      {concluidas.length === 0 ? (
        <p className="minhasDoacoesVazio">
          Nenhuma doação concluída ainda.
        </p>
      ) : (
        <div className="minhasDoacoesGrid">
          {concluidas.map((doacao) => (
            <div key={doacao.id} className="doacaoCard doacaoCardConcluida">

              <div className="doacaoCardBanner">
                {doacao.imagem ? (
                  <img src={doacao.imagem} alt={doacao.item} />
                ) : (
                  <div className="doacaoCardPlaceholder">Sem imagem</div>
                )}
              </div>

              <div className="doacaoCardBody">
                <h3>{doacao.item}</h3>

                <div className="doacaoStatus">
                  <span className="statusTag status-concluida">
                    Doação concluída
                  </span>
                </div>

                <div className="doacaoInfo">
                  <div>
                    <span>Quantidade</span>
                    <strong>
                      {doacao.quantidade ? `${doacao.quantidade} peças` : 'Não informada'}
                    </strong>
                  </div>
                  <div>
                    <span>Doada por</span>
                    <strong>{doacao.empresaNome || 'Empresa'}</strong>
                  </div>
                  <div>
                    <span>Concluída em</span>
                    <strong>{formatarData(doacao.dataConclusao)}</strong>
                  </div>
                  <div>
                    <span>Local</span>
                    <strong>{doacao.localizacao || 'Não informado'}</strong>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoacoesConcluidas;