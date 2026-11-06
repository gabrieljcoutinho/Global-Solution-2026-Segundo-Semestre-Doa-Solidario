import React, { useState, useRef, useEffect } from 'react';
import './chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: 'Olá! 👋\n\nComo posso ajudar você hoje? Você pode tirar dúvidas sobre doações, encontrar campanhas ou descobrir instituições que precisam de ajuda.',
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

    return (
        <div className="chat-master-container">

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
                                Online
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
                                    {msg.sender === 'bot' ? 'Assistente' : 'Você'}
                                </span>

                                <p>{msg.text}</p>

                                <span className="chat-msg-time">
                                    {msg.time}
                                </span>

                            </div>

                        </div>
                    ))}

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
                        Suas mensagens ajudam a conectar solidariedade e transformação.
                    </p>

                </footer>

            </main>

        </div>
    );
};

export default Chat;