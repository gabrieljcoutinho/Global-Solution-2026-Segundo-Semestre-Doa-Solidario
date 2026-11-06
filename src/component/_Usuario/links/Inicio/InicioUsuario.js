import React from 'react';
import './InicioUsuario.css';

function InicioUsuario({ usuario }) {
    return (
        <div className="inicio-usuario-container">
            {/* Div para iti imahen/banner principal */}
            <div className="divImagemInicio">
                <div className="banner-conteudo">
                    <h1>Sua doação faz a diferença!</h1>
                    <p>Ajude pessoas em situação de vulnerabilidade com um simples gesto.</p>
                    <button className="btn-doe-agora">Doe Agora &rarr;</button>
                </div>
            </div>

            {/* Container babaen para iti seksion ti chat */}
            <div className="inferior-conteudo">
                {/* Div para iti chat da IA */}
                <div className="chatIaDoaCerto">
                    <div className="chat-header">
                        <div className="chat-titulo-area">
                            <span className="chat-icone-ia">🤝</span>
                            <div>
                                <h3>Lúmen IA</h3>
                                <span className="status-online"><span className="dot"></span> Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="chat-mensagem-box">
                        <div className="avatar-esfera">🌐</div>
                        <div className="balao-mensagem">
                            <p>Olá, Lucas! 👋</p>
                            <p>Como posso ajudar hoje?</p>
                            <p>Você pode me dizer o que deseja doar ou pedir, ou enviar uma foto dos itens.</p>
                        </div>
                    </div>

                    <div className="chat-acoes">
                        <button className="acao-btn">📷 Enviar Foto</button>
                        <button className="acao-btn">🎁 Ver Campanhas</button>
                        <button className="acao-btn">📍 Encontrar Instituições</button>
                    </div>

                    <div className="chat-input-area">
                        <span className="mic-icone">🎤</span>
                        <input type="text" placeholder="Digite sua mensagem ou fale..." />
                        <button className="enviar-btn">&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioUsuario;