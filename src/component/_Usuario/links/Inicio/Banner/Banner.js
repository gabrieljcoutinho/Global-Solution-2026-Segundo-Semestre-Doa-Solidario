import React from 'react'

const Banner = () => {
  return (
    <div>
      <div className="banner-doacao">
                <div className="banner-overlay"></div>
                <div className="banner-conteudo">
                    <h1 className="banner-titulo">
                        Sua doação faz <span className="destaque-verde">a diferença!</span>
                    </h1>
                    <p className="banner-descricao">
                        Ajude pessoas em situação de vulnerabilidade com um simples gesto.
                    </p>
                    <p className="banner-botao">
                        Doe Agora &rarr;
                    </p>
                </div>
            </div>
    </div>
  )
}

export default Banner
