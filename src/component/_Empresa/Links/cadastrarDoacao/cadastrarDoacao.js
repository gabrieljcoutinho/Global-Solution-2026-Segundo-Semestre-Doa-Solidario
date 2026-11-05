import React, { useState, useRef } from 'react';
import './cadastrarDoacao.css';

const CadastrarDoacao = ({ onPublicar }) => {
  const [item, setItem] = useState('Roupas Infantis');
  const [tamanho, setTamanho] = useState('2 a 8 anos');
  const [quantidade, setQuantidade] = useState('100');
  const [urgencia, setUrgencia] = useState('Alta');
  const [prazo, setPrazo] = useState('15/05/2025');
  const [localizacao, setLocalizacao] = useState('Av. Solidariedade, 123 - São Paulo/SP');
  const [descricao, setDescricao] = useState(
    'Estamos atendendo famílias em situação de vulnerabilidade e precisamos de roupas infantis, principalmente para o inverno.'
  );
  const [imagem, setImagem] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setImagem(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagem(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublicar = () => {
    if (!item || !quantidade) {
      alert('Preencha pelo menos o Item e a Quantidade.');
      return;
    }

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

    // Limpa o formulário depois de publicar
    setItem('Roupas Infantis');
    setTamanho('2 a 8 anos');
    setQuantidade('100');
    setUrgencia('Alta');
    setPrazo('15/05/2025');
    setLocalizacao('Av. Solidariedade, 123 - São Paulo/SP');
    setDescricao('');
    setImagem(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    alert('Necessidade publicada com sucesso!');
  };

  return (
    <div className="cadastrarDoacaoContainer">
      {/* Formulário */}
      <div className="cadastrarDoacaoContent">
        <div className="doacaoFormCard">
          <h2>Informações da Necessidade</h2>

          <div className="doacaoGrid">
            <div className="doacaoInputGroup">
              <label>Item Necessário *</label>
              <div className="doacaoInputWrapper">
                <select value={item} onChange={(e) => setItem(e.target.value)}>
                  <option value="Roupas Infantis">Roupas Infantis</option>
                  <option value="Alimentos Não Perecíveis">Alimentos Não Perecíveis</option>
                  <option value="Brinquedos">Brinquedos</option>
                </select>
                <span className="selectArrow">▼</span>
              </div>
            </div>

            <div className="doacaoInputGroup">
              <label>Tamanhos (opcional)</label>
              <div className="doacaoInputWrapper">
                <select value={tamanho} onChange={(e) => setTamanho(e.target.value)}>
                  <option value="2 a 8 anos">2 a 8 anos</option>
                  <option value="P - M - G">P - M - G</option>
                  <option value="Único">Único</option>
                </select>
                <span className="selectArrow">▼</span>
              </div>
            </div>

            <div className="doacaoInputGroup">
              <label>Quantidade Necessária *</label>
              <div className="doacaoInputWrapper suffixWrapper">
                <input
                  type="text"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
                <span className="inputSuffix">peças</span>
              </div>
            </div>

            <div className="doacaoInputGroup">
              <label>Urgência</label>
              <div className="doacaoInputWrapper urgencyWrapper">
                <span className="urgencyDot"></span>
                <select value={urgencia} onChange={(e) => setUrgencia(e.target.value)}>
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
                <span className="selectArrow">▼</span>
              </div>
            </div>

            <div className="doacaoInputGroup">
              <label>Prazo para Atendimento</label>
              <div className="doacaoInputWrapper">
                <input
                  type="text"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                />
              </div>
            </div>

            <div className="doacaoInputGroup">
              <label>Localização</label>
              <div className="doacaoInputWrapper">
                <input
                  type="text"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Upload */}
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
                <img src={imagem} alt="Pré-visualização" className="uploadedImage" />
                <button type="button" className="removeImageBtn" onClick={removeImage}>
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
              />
              <span className="charCounter">{descricao.length}/200</span>
            </div>
          </div>

          <button
            className="doacaoSubmitBtn"
            onClick={handlePublicar}
          >
            Publicar Necessidade
            <span className="btnArrow">→</span>
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="cadastrarDoacaoPreview">
        <div className="previewNotificationCard">
          <div className="previewMegaphone">!</div>
          <p>Sua necessidade será divulgada para doadores próximos!</p>
        </div>

        <div className="previewMainCard">
          <div className="previewCardBanner">
            {imagem ? (
              <img src={imagem} alt="Item" className="previewBannerImage" />
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
                <span>{tamanho}</span>
              </div>
              <div className="previewDetailRow">
                <span className="listLabel">Quantidade</span>
                <span>{quantidade} peças</span>
              </div>
              <div className="previewDetailRow">
                <span className="listLabel">Prazo</span>
                <span>Até {prazo}</span>
              </div>
              <div className="previewDetailRow">
                <span className="listLabel">Local</span>
                <span>{localizacao}</span>
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