import React, { useState } from 'react';
import "./chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Olá, Lucas! 👋\nComo posso ajudar hoje?\n\nVocê pode me dizer o que deseja doar ou pedir, ou enviar uma foto dos itens.',
      time: '12:00'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleActionClick = (actionName) => {
    const actionMessage = {
      sender: 'user',
      text: `Ação selecionada: ${actionName}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, actionMessage]);
  };

  return (
    <div className="chat-master-container">
      {/* Barra Lateral Esquerda */}
      <aside className="chat-sidebar-left">
        <div className="chat-brand-box">
          <div className="chat-avatar-glow"></div>
          <div className="chat-brand-avatar">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20"></path>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
        </div>
        <div className="chat-sidebar-info">
          <h3>Lúmen IA</h3>
          <div className="chat-status-wrapper">
            <span className="chat-status-dot"></span>
            <span>Online</span>
          </div>
        </div>
      </aside>

      {/* Janela Principal do Chat */}
      <div className="chat-main-panel">
        <header className="chat-top-header">
          <h2>Assistente Virtual</h2>
        </header>

        <div className="chat-body-content">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-msg-row ${msg.sender}`}>
              <div className={`chat-bubble-box ${msg.sender}`}>
                <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                <span className="chat-msg-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Botões de Ação Rápida */}
          <div className="chat-action-buttons-row">
            <button className="chat-action-chip" onClick={() => handleActionClick('Enviar Foto')}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Enviar Foto
            </button>
            <button className="chat-action-chip" onClick={() => handleActionClick('Ver Campanhas')}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
              </svg>
              Ver Campanhas
            </button>
            <button className="chat-action-chip" onClick={() => handleActionClick('Encontrar Instituições')}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Encontrar Instituições
            </button>
          </div>
        </div>

        <footer className="chat-bottom-footer">
          <form className="chat-input-wrapper-form" onSubmit={handleSendMessage}>
            <button type="button" className="chat-tool-icon-btn" title="Falar por voz">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
              </svg>
            </button>
            
            <input 
              type="text" 
              className="chat-text-field-input" 
              placeholder="Digite sua mensagem ou fale..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <button type="submit" className="chat-submit-btn" title="Enviar">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Chat;