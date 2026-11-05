import React from 'react';

function MinhasDoacoes() {
    // Dados de exemplo (depois você busca do backend)
    const doacoes = [
        {
            id: 1,
            titulo: 'Cestas Básicas',
            categoria: 'Alimentos',
            quantidade: '15 unidades',
            local: 'Centro - São Paulo',
            status: 'Ativa',
            data: '03/11/2026'
        },
        {
            id: 2,
            titulo: 'Roupas de Inverno',
            categoria: 'Roupas',
            quantidade: '30 peças',
            local: 'Zona Norte',
            status: 'Ativa',
            data: '01/11/2026'
        },
        {
            id: 3,
            titulo: 'Kits de Higiene',
            categoria: 'Higiene',
            quantidade: '20 kits',
            local: 'Mooca',
            status: 'Finalizada',
            data: '28/10/2026'
        }
    ];

    return (
        <div className="pagina-conteudo">
            <h1>Minhas Doações</h1>
            <p className="subtitulo">Acompanhe todas as doações que você cadastrou.</p>

            {doacoes.length === 0 ? (
                <div className="sem-doacoes">
                    <p>Você ainda não cadastrou nenhuma doação.</p>
                </div>
            ) : (
                <div className="lista-doacoes">
                    {doacoes.map((doacao) => (
                        <div key={doacao.id} className="card-doacao">
                            <div className="card-header">
                                <h3>{doacao.titulo}</h3>
                                <span className={`status ${doacao.status.toLowerCase()}`}>
                                    {doacao.status}
                                </span>
                            </div>

                            <div className="card-body">
                                <p><strong>Categoria:</strong> {doacao.categoria}</p>
                                <p><strong>Quantidade:</strong> {doacao.quantidade}</p>
                                <p><strong>Local:</strong> {doacao.local}</p>
                                <p><strong>Data:</strong> {doacao.data}</p>
                            </div>

                            <div className="card-actions">
                                <button className="btn-editar">Editar</button>
                                <button className="btn-excluir">Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MinhasDoacoes;