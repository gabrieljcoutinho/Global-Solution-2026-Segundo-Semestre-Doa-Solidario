import React, { useState, useRef, useEffect } from 'react';
import './chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Olá! Seja bem-vindo ao Lúmen IA. 👋\n\nEstou aqui para ajudar você a encontrar oportunidades de doação, conhecer campanhas e conectar pessoas que precisam de ajuda.',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const newMessage = {
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const handleActionClick = (actionName) => {
    const actionMessage = {
      sender: 'user',
      text: actionName,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages(prev => [...prev, actionMessage]);
  };

  return (
    <div className="chat-master-container">

      <aside className="chat-sidebar-left">

        <div className="chat-sidebar-brand">
          <div className="chat-brand-avatar">
            <svg viewBox="0 0 24 24" width="27" height="27"
              fill="none" stroke="currentColor" strokeWidth="1.7"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>

          <div>
            <h2>Lúmen IA</h2>
            <span>Assistente inteligente</span>
          </div>
        </div>

        <div className="chat-sidebar-divider"></div>

        <div className="chat-sidebar-profile">
          <span className="chat-sidebar-label">SEU ASSISTENTE</span>

          <div className="chat-profile-card">
            <div className="chat-profile-icon">
              <svg viewBox="0 0 24 24" width="23" height="23"
                fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v2" />
                <path d="M12 19v2" />
                <path d="M3 12h2" />
                <path d="M19 12h2" />
                <circle cx="12" cy="12" r="6" />
                <path d="m9.5 12 1.7 1.7 3.5-3.5" />
              </svg>
            </div>

            <div>
              <strong>Lúmen</strong>
              <span>Pronto para ajudar</span>
            </div>

            <span className="chat-online-indicator"></span>
          </div>
        </div>

        <div className="chat-sidebar-bottom">
          <div className="chat-sidebar-help-icon">
            ?
          </div>

          <div>
            <strong>Estamos aqui por você</strong>
            <span>Conectando solidariedade.</span>
          </div>
        </div>

      </aside>

      <main className="chat-main-panel">

        <header className="chat-top-header">

          <div className="chat-header-info">
            <div className="chat-header-avatar">
              <svg viewBox="0 0 24 24" width="22" height="22"
                fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>

            <div>
              <h2>Assistente Virtual</h2>
              <div className="chat-header-status">
                <span></span>
                Lúmen IA está online
              </div>
            </div>
          </div>

          <div className="chat-header-tag">
            <span></span>
            Atendimento digital
          </div>

        </header>

        <section className="chat-body-content">

          <div className="chat-date-divider">
            <span>CONVERSA</span>
          </div>

          {messages.map((msg, index) => (
            <div key={index} className={`chat-msg-row ${msg.sender}`}>

              {msg.sender === 'bot' && (
                <div className="chat-message-avatar">
                  <svg viewBox="0 0 24 24" width="19" height="19"
                    fill="none" stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
              )}

              <div className={`chat-bubble-box ${msg.sender}`}>
                <span className="chat-sender-name">
                  {msg.sender === 'bot' ? 'Lúmen IA' : 'Você'}
                </span>

                <p>{msg.text}</p>

                <span className="chat-msg-time">
                  {msg.time}
                </span>
              </div>

            </div>
          ))}

          {messages.length === 1 && (
            <div className="chat-suggestions">

              <div className="chat-suggestions-heading">
                <span>COMO POSSO AJUDAR?</span>
                <p>Escolha uma opção para começar.</p>
              </div>

              <div className="chat-action-buttons-row">

                <button
                  className="chat-action-chip"
                  onClick={() => handleActionClick('Quero enviar uma foto dos itens que desejo doar.')}
                >
                  <div className="chat-action-icon photo">
                    <svg viewBox="0 0 24 24" width="21" height="21"
                      fill="none" stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>

                  <div>
                    <strong>Enviar uma foto</strong>
                    <span>Compartilhe seus itens para doação.</span>
                  </div>

                  <span className="chat-action-arrow">›</span>
                </button>

                <button
                  className="chat-action-chip"
                  onClick={() => handleActionClick('Quero conhecer as campanhas disponíveis.')}
                >
                  <div className="chat-action-icon campaign">
                    <svg viewBox="0 0 24 24" width="21" height="21"
                      fill="none" stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12v10H4V12" />
                      <path d="M2 7h20v5H2z" />
                      <path d="M12 22V7" />
                      <path d="M12 7H7.5a2.5 2.5 0 1 1 2.5-2.5V7" />
                      <path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5V7" />
                    </svg>
                  </div>

                  <div>
                    <strong>Ver campanhas</strong>
                    <span>Conheça iniciativas solidárias.</span>
                  </div>

                  <span className="chat-action-arrow">›</span>
                </button>

                <button
                  className="chat-action-chip"
                  onClick={() => handleActionClick('Quero encontrar instituições próximas.')}
                >
                  <div className="chat-action-icon institution">
                    <svg viewBox="0 0 24 24" width="21" height="21"
                      fill="none" stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>

                  <div>
                    <strong>Encontrar instituições</strong>
                    <span>Descubra onde sua ajuda é necessária.</span>
                  </div>

                  <span className="chat-action-arrow">›</span>
                </button>

              </div>
            </div>
          )}

          <div ref={messagesEndRef} />

        </section>

        <footer className="chat-bottom-footer">

          <form className="chat-input-wrapper-form" onSubmit={handleSendMessage}>

            <button
              type="button"
              className="chat-tool-icon-btn"
              title="Falar por voz"
            >
              <svg viewBox="0 0 24 24" width="21" height="21"
                fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="13" rx="3" />
                <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                <path d="M12 19v3" />
                <path d="M8 22h8" />
              </svg>
            </button>

            <input
              type="text"
              className="chat-text-field-input"
              placeholder="Escreva sua mensagem..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <span className="chat-input-separator"></span>

            <button
              type="submit"
              className="chat-submit-btn"
              title="Enviar mensagem"
              disabled={!inputText.trim()}
            >
              <svg viewBox="0 0 24 24" width="20" height="20"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>

          </form>

          <p className="chat-footer-caption">
            O Lúmen IA pode ajudar você a transformar solidariedade em ação.
          </p>

        </footer>

      </main>

    </div>
  );
};

export default Chat;