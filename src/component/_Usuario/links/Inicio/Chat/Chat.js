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
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // ==========================================
    // ROLAGEM AUTOMÁTICA
    // ==========================================

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [messages, loading]);

    // ==========================================
    // HORÁRIO DAS MENSAGENS
    // ==========================================

    const obterHorario = () => {
        return new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // ==========================================
    // ENVIAR MENSAGEM PARA O GEMINI
    // ==========================================

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const mensagem = inputText.trim();

        if (!mensagem || loading) return;

        const novaMensagem = {
            sender: 'user',
            text: mensagem,
            time: obterHorario()
        };

        // Adiciona a mensagem do usuário
        setMessages(prev => [...prev, novaMensagem]);

        setInputText('');
        setLoading(true);

        try {

            // Prepara o histórico sem a saudação inicial
            const historico = messages
                .slice(1)
                .filter(msg => !msg.erro)
                .map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    text: msg.text
                }));

            // Envia a solicitação ao backend
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    mensagem,
                    historico
                })
            });

            const dados = await response.json();

            if (!response.ok) {
                throw new Error(
                    dados.erro || 'Erro ao conversar com a IA.'
                );
            }

            // Adiciona a resposta da inteligência artificial
            const respostaIA = {
                sender: 'bot',
                text: dados.resposta,
                time: obterHorario()
            };

            setMessages(prev => [...prev, respostaIA]);

        } catch (erro) {

            console.error('Erro ao enviar mensagem:', erro);

            setMessages(prev => [
                ...prev,
                {
                    sender: 'bot',
                    text: erro.message || 'Não foi possível conectar ao assistente. Tente novamente.',
                    time: obterHorario(),
                    erro: true
                }
            ]);

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INTERFACE DO CHAT
    // ==========================================

    return (
        <div className="chat-master-container">

            <main className="chat-main-panel">

                <header className="chat-top-header">

                    <div className="chat-header-info">

                        <div className="chat-header-avatar">

                            <svg
                                viewBox="0 0 24 24"
                                width="22"
                                height="22"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
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

                        <div
                            key={index}
                            className={`chat-msg-row ${msg.sender}`}
                        >

                            {msg.sender === 'bot' && (

                                <div className="chat-message-avatar">

                                    <svg
                                        viewBox="0 0 24 24"
                                        width="19"
                                        height="19"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
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

                                <p style={{ whiteSpace: 'pre-wrap' }}>
                                    {msg.text}
                                </p>

                                <span className="chat-msg-time">
                                    {msg.time}
                                </span>

                            </div>

                        </div>

                    ))}

                    {/* INDICADOR DE RESPOSTA DA IA */}

                    {loading && (

                        <div className="chat-msg-row bot">

                            <div className="chat-message-avatar">

                                <svg
                                    viewBox="0 0 24 24"
                                    width="19"
                                    height="19"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M2 12h20" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>

                            </div>

                            <div className="chat-bubble-box bot">

                                <span className="chat-sender-name">
                                    Assistente
                                </span>

                                <p>Estou preparando sua resposta...</p>

                            </div>

                        </div>

                    )}

                    <div ref={messagesEndRef} />

                </section>

                <footer className="chat-bottom-footer">

                    <form
                        className="chat-input-wrapper-form"
                        onSubmit={handleSendMessage}
                    >

                        <button
                            type="button"
                            className="chat-tool-icon-btn"
                            title="Falar por voz"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                width="21"
                                height="21"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
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
                            disabled={loading}
                        />

                        <span className="chat-input-separator"></span>

                        <button
                            type="submit"
                            className="chat-submit-btn"
                            title="Enviar mensagem"
                            disabled={!inputText.trim() || loading}
                        >

                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
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