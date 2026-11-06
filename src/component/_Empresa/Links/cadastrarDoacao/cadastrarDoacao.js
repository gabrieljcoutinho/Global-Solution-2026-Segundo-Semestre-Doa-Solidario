
import React, { useState, useRef } from 'react';
import './cadastrarDoacao.css';

const CadastrarDoacao = ({ onPublicar }) => {
    const [item, setItem] = useState('');
    const [tamanho, setTamanho] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [urgencia, setUrgencia] = useState('Alta');
    const [prazo, setPrazo] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagem, setImagem] = useState(null);

    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImagem(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagem(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePublicar = () => {
        if (!item || !quantidade.trim()) {
            alert('Preencha pelo menos o Item e a Quantidade.');
            return;
        }

        // Envia os dados para publicação
        onPublicar({
            item,
            tamanho,
            quantidade,
            urgencia,
            prazo,
            localizacao,
            descricao,
            imagem
        });

        // Reseta todos os campos
        setItem('');
        setTamanho('');
        setQuantidade('');
        setUrgencia('Alta');
        setPrazo('');
        setLocalizacao('');
        setDescricao('');
        setImagem(null);

        // Limpa o campo de upload
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        alert('Necessidade publicada com sucesso!');
    };

    return (
        <div className="cadastrarDoacaoContainer">

            {/* Formulário */}
            <div className="cadastrarDoacaoContent">
                <div className="doacaoFormCard">

                    <h2>Informações da Necessidade</h2>

                    <div className="doacaoGrid">

                        {/* Item necessário */}
                        <div className="doacaoInputGroup">
                            <label>Item Necessário *</label>

                            <div className="doacaoInputWrapper">
                                <select
                                    value={item}
                                    onChange={(e) => setItem(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Roupas Infantis">Roupas Infantis</option>
                                    <option value="Alimentos Não Perecíveis">Alimentos Não Perecíveis</option>
                                    <option value="Brinquedos">Brinquedos</option>
                                </select>

                                <span className="selectArrow">▼</span>
                            </div>
                        </div>

                        {/* Tamanho */}
                        <div className="doacaoInputGroup">
                            <label>Tamanhos (opcional)</label>

                            <div className="doacaoInputWrapper">
                                <select
                                    value={tamanho}
                                    onChange={(e) => setTamanho(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="2 a 8 anos">2 a 8 anos</option>
                                    <option value="P - M - G">P - M - G</option>
                                    <option value="Único">Único</option>
                                </select>

                                <span className="selectArrow">▼</span>
                            </div>
                        </div>

                        {/* Quantidade */}
                        <div className="doacaoInputGroup">
                            <label>Quantidade Necessária *</label>

                            <div className="doacaoInputWrapper suffixWrapper">
                                <input
                                    type="text"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                    placeholder="Digite a quantidade"
                                />

                                <span className="inputSuffix">peças</span>
                            </div>
                        </div>

                        {/* Urgência */}
                        <div className="doacaoInputGroup">
                            <label>Urgência</label>

                            <div className={`doacaoInputWrapper urgencyWrapper ${urgencia.toLowerCase()}`}>
                                <span className="urgencyDot"></span>

                                <select
                                    value={urgencia}
                                    onChange={(e) => setUrgencia(e.target.value)}
                                >
                                    <option value="Alta">Alta</option>
                                    <option value="Média">Média</option>
                                    <option value="Baixa">Baixa</option>
                                </select>

                                <span className="selectArrow">▼</span>
                            </div>
                        </div>

                        {/* Prazo */}
                        <div className="doacaoInputGroup">
                            <label>Prazo para Atendimento</label>

                            <div className="doacaoInputWrapper">
                                <input
                                    type="text"
                                    value={prazo}
                                    onChange={(e) => setPrazo(e.target.value)}
                                    placeholder="Ex: 15/05/2026"
                                />
                            </div>
                        </div>

                        {/* Localização */}
                        <div className="doacaoInputGroup">
                            <label>Localização</label>

                            <div className="doacaoInputWrapper">
                                <input
                                    type="text"
                                    value={localizacao}
                                    onChange={(e) => setLocalizacao(e.target.value)}
                                    placeholder="Digite o endereço"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Upload de imagem */}
                    <div className="doacaoInputGroup fullWidth imageUploadGroup">
                        <label>Imagem do Item (opcional)</label>

                        {!imagem ? (
                            <div
                                className="imageUploadArea"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="uploadIcon">+</div>
                                <p>Clique para adicionar uma imagem</p>
                                <span>PNG, JPG ou WEBP</span>
                            </div>
                        ) : (
                            <div className="imagePreviewContainer">
                                <img
                                    src={imagem}
                                    alt="Pré-visualização"
                                    className="uploadedImage"
                                />

                                <button
                                    type="button"
                                    className="removeImageBtn"
                                    onClick={removeImage}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* Descrição */}
                    <div className="doacaoInputGroup fullWidth">
                        <label>Descrição Adicional (opcional)</label>

                        <div className="doacaoTextareaWrapper">
                            <textarea
                                rows="3"
                                maxLength="200"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Adicione informações importantes sobre a necessidade..."
                            />

                            <span className="charCounter">
                                {descricao.length}/200
                            </span>
                        </div>
                    </div>

                    {/* Botão publicar */}
                    <button
                        type="button"
                        className="doacaoSubmitBtn"
                        onClick={handlePublicar}
                    >
                        Publicar Necessidade
                        <span className="btnArrow">→</span>
                    </button>

                </div>
            </div>

            {/* Pré-visualização */}
            <div className="cadastrarDoacaoPreview">

                <div className="previewNotificationCard">
                    <div className="previewMegaphone">!</div>

                    <p>
                        Sua necessidade será divulgada para doadores próximos!
                    </p>
                </div>

                <div className="previewMainCard">

                    <div className="previewCardBanner">
                        {imagem ? (
                            <img
                                src={imagem}
                                alt="Item"
                                className="previewBannerImage"
                            />
                        ) : (
                            <div className="previewPlaceholder">
                                <span>Sem imagem</span>
                            </div>
                        )}
                    </div>

                    <div className="previewCardBody">

                        <h3>{item || 'Item'}</h3>

                        <div className={`previewBadge ${urgencia.toLowerCase()}`}>
                            <span className="dot"></span>
                            {urgencia} Prioridade
                        </div>

                        <div className="previewDetails">

                            <div className="previewDetailRow">
                                <span className="listLabel">Tamanho</span>
                                <span>{tamanho || 'Não informado'}</span>
                            </div>

                            <div className="previewDetailRow">
                                <span className="listLabel">Quantidade</span>
                                <span>{quantidade ? `${quantidade} peças` : 'Não informada'}</span>
                            </div>

                            <div className="previewDetailRow">
                                <span className="listLabel">Prazo</span>
                                <span>{prazo ? `Até ${prazo}` : 'Não informado'}</span>
                            </div>

                            <div className="previewDetailRow">
                                <span className="listLabel">Local</span>
                                <span>{localizacao || 'Não informado'}</span>
                            </div>

                        </div>

                        {descricao && (
                            <div className="previewDescription">
                                <p>{descricao}</p>
                            </div>
                        )}

                        <div className="previewFooterAlert">
                            <span className="infoCircle">i</span>

                            <p>
                                Doadores receberão alertas personalizados com base na sua localização e
                                preferências.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default CadastrarDoacao;
