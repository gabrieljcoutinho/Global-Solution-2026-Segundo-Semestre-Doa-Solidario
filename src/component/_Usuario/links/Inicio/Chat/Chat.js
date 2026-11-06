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
    <div className="chat-container">
      {/* Cabeçalho do Chat */}
      <header className="chat-header">
        <div className="chat-header-avatar-container">
          <div className="chat-avatar-glow"></div>
          <div className="chat-header-avatar">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
        </div>
        <div className="chat-header-info">
          <h2>Lúmen IA</h2>
          <div className="chat-status-indicator">
            <span className="chat-status-dot"></span>
            <span className="chat-status-text">Online</span>
          </div>
        </div>
      </header>

      {/* Corpo / Mensagens do Chat */}
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message-wrapper ${msg.sender}`}>
            {msg.sender === 'bot' && (
              <div className="chat-bot-avatar-container">
                <div className="chat-bot-avatar">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
              </div>
            )}
            <div className={`chat-bubble ${msg.sender}`}>
              <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Botões de Ação Rápida */}
        <div className="chat-actions-container">
          <button className="chat-action-btn" onClick={() => handleActionClick('Enviar Foto')}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Enviar Foto
          </button>
          <button className="chat-action-btn" onClick={() => handleActionClick('Ver Campanhas')}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            Ver Campanhas
          </button>
          <button className="chat-action-btn" onClick={() => handleActionClick('Encontrar Instituições')}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Encontrar Instituições
          </button>
        </div>
      </div>

      {/* Rodapé / Input de Mensagem */}
      <footer className="chat-footer">
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <button type="button" className="chat-input-icon-btn" title="Falar por voz">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>
          
          <input 
            type="text" 
            className="chat-text-input" 
            placeholder="Digite sua mensagem ou fale..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button type="submit" className="chat-send-btn" title="Enviar mensagem">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;