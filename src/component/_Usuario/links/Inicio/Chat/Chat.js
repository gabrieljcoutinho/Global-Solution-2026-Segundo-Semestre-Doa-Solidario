import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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

    const [imagemSelecionada, setImagemSelecionada] = useState(null);
    const [previewImagem, setPreviewImagem] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

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
    // FOTO: ESCOLHER E REMOVER
    // ==========================================

    const handleEscolherImagem = (e) => {
        const arquivo = e.target.files?.[0];
        if (!arquivo) return;

        if (arquivo.size > 5 * 1024 * 1024) {
            alert('A imagem precisa ter no máximo 5 MB.');
            return;
        }

        const leitor = new FileReader();

        leitor.onload = () => {
            const base64 = leitor.result.split(',')[1];

            setImagemSelecionada({
                mimeType: arquivo.type,
                data: base64
            });

            setPreviewImagem(leitor.result);
        };

        leitor.readAsDataURL(arquivo);
    };

    const removerImagem = () => {
        setImagemSelecionada(null);
        setPreviewImagem(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ==========================================
    // ENVIAR MENSAGEM PARA O GEMINI
    // ==========================================

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const textoDigitado = inputText.trim();
        const imagem = imagemSelecionada;
        const preview = previewImagem;

        if ((!textoDigitado && !imagem) || loading) return;

        const mensagem = imagem
            ? (textoDigitado || 'Avalie o estado desta peça para doação.')
            : textoDigitado;

        const novaMensagem = {
            sender: 'user',
            text: mensagem,
            time: obterHorario(),
            preview
        };

        setMessages(prev => [...prev, novaMensagem]);

        setInputText('');
        removerImagem();
        setLoading(true);

        try {

            // Histórico sem a saudação inicial e sem mensagens de erro
            const historico = messages
                .slice(1)
                .filter(msg => !msg.erro)
                .map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    text: msg.text
                }));

            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    mensagem,
                    historico,
                    imagem
                })
            });

            const dados = await response.json();

            if (!response.ok) {
                throw new Error(
                    dados.erro || 'Erro ao conversar com a IA.'
                );
            }

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

                                {msg.preview && (
                                    <img
                                        src={msg.preview}
                                        alt="Foto enviada"
                                        style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 6 }}
                                    />
                                )}

                                {msg.sender === 'bot' && !msg.erro ? (
                                    <div className="chat-markdown">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p style={{ whiteSpace: 'pre-wrap' }}>
                                        {msg.text}
                                    </p>
                                )}

                                <span className="chat-msg-time">
                                    {msg.time}
                                </span>

                            </div>

                        </div>

                    ))}

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

                    {previewImagem && (
                        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <img
                                src={previewImagem}
                                alt="Prévia"
                                style={{ maxHeight: 80, borderRadius: 8 }}
                            />
                            <button type="button" onClick={removerImagem}>
                                Remover
                            </button>
                        </div>
                    )}

                    <form
                        className="chat-input-wrapper-form"
                        onSubmit={handleSendMessage}
                    >

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleEscolherImagem}
                            style={{ display: 'none' }}
                        />

                        <button
                            type="button"
                            className="chat-tool-icon-btn"
                            title="Enviar foto"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                        >
                            📷
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
                            disabled={(!inputText.trim() && !imagemSelecionada) || loading}
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