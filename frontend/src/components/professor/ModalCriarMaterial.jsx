import { useState } from "react";

const TIPOS = [
  { value: 'pdf',          label: 'Documento',    sub: 'PDF' },
  { value: 'video',        label: 'Vídeo',        sub: 'Link do youtube' },
  { value: 'link',       label: 'Link externo', sub: 'Site ou artigo online' },
];

function TipoIcone({ tipo }) {
  if (tipo === 'video') {
    return (
      <div className="pm-tipo-icone pm-tipo-icone--video">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <polygon points="5,3 19,12 5,21" fill="currentColor" />
        </svg>
      </div>
    );
  }
  if (tipo === 'link') {
    return (
      <div className="pm-tipo-icone pm-tipo-icone--link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </div>
    );
  }
  return (
    <div className="pm-tipo-icone pm-tipo-icone--doc">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.8" fill="none" />
      </svg>
    </div>
  );
}

function ModalOverlay({ onClose, children }) {
  return (
    <div className="pm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pm-modal">{children}</div>
    </div>
  );
}

function ModalCriarMaterial({ onClose, onSalvar, loading, conteudos }) {
  const [tipo, setTipo] = useState('');
  const [form, setForm] = useState({ nome: '', conteudo: '', descricao: '', link: '' });
  const [arquivo, setArquivo] = useState(null);
  const [erros, setErros] = useState({});
  const [dragging, setDragging] = useState(false);

  const precisaArquivo = ['pdf', 'documento'].includes(tipo);
  const precisaLink = ['video', 'link'].includes(tipo);

  const validar = () => {
    const e = {};
    if (!tipo) e.tipo = 'Selecione o tipo de material';
    if (!form.nome.trim()) e.nome = 'Título é obrigatório';
    if (!form.conteudo) e.conteudo = 'Conteúdo é obrigatório';
    if (precisaLink && !form.link.trim()) e.link = 'Link é obrigatório para este tipo';
    if (precisaArquivo && !arquivo) e.arquivo = 'Arquivo é obrigatório para este tipo';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    const formData = new FormData();
    formData.append('nome', form.nome);
    formData.append('tipo', tipo);
    formData.append('conteudo', form.conteudo);
    if (form.descricao) formData.append('descricao', form.descricao);
    if (form.link) formData.append('link', form.link);
    if (arquivo) formData.append('arquivo', arquivo);
    const ok = await onSalvar(formData);
    if (ok) onClose();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setArquivo(file); setErros(prev => ({ ...prev, arquivo: undefined })); }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="pm-modal-header">
        <h2 className="pm-modal-titulo">Adicionar novo material</h2>
        <button className="pm-modal-fechar" onClick={onClose}>✕</button>
      </div>

      <div className="pm-modal-body">
        <p className="pm-label-section">Selecione tipo de material</p>
        <div className="pm-tipo-grid">
          {TIPOS.map(t => (
            <button
              key={t.value}
              type="button"
              className={`pm-tipo-card ${tipo === t.value ? 'pm-tipo-card--ativo' : ''}`}
              onClick={() => { setTipo(t.value); setErros(prev => ({ ...prev, tipo: undefined })); }}
            >
              <TipoIcone tipo={t.value} />
              <span className="pm-tipo-label">{t.label}</span>
              <span className="pm-tipo-sub">{t.sub}</span>
            </button>
          ))}
        </div>
        {erros.tipo && <span className="pm-erro-msg">{erros.tipo}</span>}

        <label className="pm-label">Título do material</label>
        <input
          className={`pm-input ${erros.nome ? 'pm-input--erro' : ''}`}
          placeholder="Ex: Introdução a funções quadráticas"
          value={form.nome}
          onChange={e => { setForm({ ...form, nome: e.target.value }); setErros(prev => ({ ...prev, nome: undefined })); }}
        />
        {erros.nome && <span className="pm-erro-msg">{erros.nome}</span>}

        <label className="pm-label">Conteúdo</label>
        <select
          className={`pm-input pm-select ${erros.conteudo ? 'pm-input--erro' : ''}`}
          value={form.conteudo}
          onChange={e => { setForm({ ...form, conteudo: e.target.value }); setErros(prev => ({ ...prev, conteudo: undefined })); }}
        >
          <option value="">Selecione o conteúdo</option>
          {conteudos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        {erros.conteudo && <span className="pm-erro-msg">{erros.conteudo}</span>}

        <label className="pm-label">Descrição</label>
        <input
          className="pm-input"
          placeholder="desc do material"
          value={form.descricao}
          onChange={e => setForm({ ...form, descricao: e.target.value })}
        />

        {precisaLink && (
          <>
            <label className="pm-label">Link <span className="pm-required">*</span></label>
            <input
              className={`pm-input ${erros.link ? 'pm-input--erro' : ''}`}
              placeholder="https://..."
              type ="url"
              autoComplete="off"
              name="material-url"
              value={form.link}
              onChange={e => { setForm({ ...form, link: e.target.value }); setErros(prev => ({ ...prev, link: undefined })); }}
            />
            {erros.link && <span className="pm-erro-msg">{erros.link}</span>}
          </>
        )}

        {precisaArquivo && (
          <>
            <label className="pm-label">Arquivo <span className="pm-required">*</span></label>
            <div
              className={`pm-dropzone ${dragging ? 'pm-dropzone--drag' : ''} ${erros.arquivo ? 'pm-dropzone--erro' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('pm-file-input').click()}
            >
              {arquivo ? (
                <span className="pm-dropzone-nome">{arquivo.name}</span>
              ) : (
                <>
                  <span>arraste e solte o arquivo</span>
                  <span>ou clique para selecionar</span>
                  <span className="pm-dropzone-hint">PDF, DOC, PPT, etc</span>
                </>
              )}
            </div>
            <input
              id="pm-file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={e => { setArquivo(e.target.files[0]); setErros(prev => ({ ...prev, arquivo: undefined })); }}
            />
            {erros.arquivo && <span className="pm-erro-msg">{erros.arquivo}</span>}
          </>
        )}
      </div>

      <div className="pm-modal-acoes pm-modal-acoes--center">
        <button className="pm-btn-adicionar" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enviando...' : 'Adicionar'}
        </button>
      </div>
    </ModalOverlay>
  );
}

export default ModalCriarMaterial;