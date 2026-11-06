
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

    // Selecionar imagem
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImagem(reader.result);
            };

            reader.readAsDataURL(file);
        } else if (file) {
            alert('Selecione um arquivo de imagem válido.');
            e.target.value = '';
        }
    };

    // Remover imagem
    const removeImage = () => {
        setImagem(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Publicar necessidade
    const handlePublicar = () => {

        if (!item.trim() || !quantidade.trim()) {
            alert('Preencha pelo menos o Item e a Quantidade.');
            return;
        }

        // Envia os dados para publicação
        onPublicar({
            item: item.trim(),
            tamanho: tamanho.trim(),
            quantidade: quantidade.trim(),
            urgencia,
            prazo: prazo.trim(),
            localizacao: localizacao.trim(),
            descricao: descricao.trim(),
            imagem
        });

        // Limpa todos os campos
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

                        {/* Item necessário - TEXTO LIVRE */}
                        <div className="doacaoInputGroup">

                            <label>Item Necessário *</label>

                            <div className="doacaoInputWrapper">

                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => setItem(e.target.value)}
                                    placeholder="Digite o item necessário"
                                />

                            </div>

                        </div>

                        {/* Tamanho - TEXTO LIVRE */}
                        <div className="doacaoInputGroup">

                            <label>Tamanho / Especificação (opcional)</label>

                            <div className="doacaoInputWrapper">

                                <input
                                    type="text"
                                    value={tamanho}
                                    onChange={(e) => setTamanho(e.target.value)}
                                    placeholder="Ex: P, M, G, 42, Infantil..."
                                />

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

                                <span className="inputSuffix">
                                    peças
                                </span>

                            </div>

                        </div>

                        {/* Urgência */}
                        <div className="doacaoInputGroup">

                            <label>Urgência</label>

                            <div
                                className={`doacaoInputWrapper urgencyWrapper ${urgencia.toLowerCase()}`}
                            >

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

                        {/* Nome do item atualizado em tempo real */}
                        <h3>{item || 'Item'}</h3>

                        {/* Urgência */}
                        <div className={`previewBadge ${urgencia.toLowerCase()}`}>

                            <span className="dot"></span>

                            {urgencia} Prioridade

                        </div>

                        <div className="previewDetails">

                            {/* Tamanho */}
                            <div className="previewDetailRow">

                                <span className="listLabel">
                                    Tamanho
                                </span>

                                <span>
                                    {tamanho || 'Não informado'}
                                </span>

                            </div>

                            {/* Quantidade */}
                            <div className="previewDetailRow">

                                <span className="listLabel">
                                    Quantidade
                                </span>

                                <span>
                                    {quantidade
                                        ? `${quantidade} peças`
                                        : 'Não informada'}
                                </span>

                            </div>

                            {/* Prazo */}
                            <div className="previewDetailRow">

                                <span className="listLabel">
                                    Prazo
                                </span>

                                <span>
                                    {prazo
                                        ? `Até ${prazo}`
                                        : 'Não informado'}
                                </span>

                            </div>

                            {/* Localização */}
                            <div className="previewDetailRow">

                                <span className="listLabel">
                                    Local
                                </span>

                                <span>
                                    {localizacao || 'Não informado'}
                                </span>

                            </div>

                        </div>

                        {/* Descrição */}
                        {descricao && (

                            <div className="previewDescription">

                                <p>{descricao}</p>

                            </div>

                        )}

                        {/* Aviso */}
                        <div className="previewFooterAlert">

                            <span className="infoCircle">i</span>

                            <p>
                                Doadores receberão alertas personalizados
                                com base na sua localização e preferências.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default CadastrarDoacao;
