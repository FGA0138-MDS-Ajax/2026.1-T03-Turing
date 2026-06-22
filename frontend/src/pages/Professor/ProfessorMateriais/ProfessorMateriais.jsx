import { useState, useEffect, useCallback } from 'react';
import { ProfessorLayout } from '../../../components/professor/ProfessorLayout';
import { listarMateriais, deletarMaterial, criarMaterial, editarMaterial, listarConteudos, listarProfessoresAprovados,} from '../../../services/disciplinasService';
import { listarDisciplinas } from '../../../services/disciplinasService';
import { useAuth } from '../../../context/AuthContext';
import ModalCriarMaterial from '../../../components/professor/ModalCriarMaterial';
import './ProfessorMateriais.css';


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


function ModalConfirmacao({ nome, onConfirmar, onCancelar, loading }) {
  return (
    <ModalOverlay onClose={onCancelar}>
      <div className="pm-modal-header">
        <h2 className="pm-modal-titulo">Remover material</h2>
        <button className="pm-modal-fechar" onClick={onCancelar}>✕</button>
      </div>
      <div className="pm-modal-body">
        <p style={{ fontSize: '0.875rem', color: '#4A5565' }}>
          Tem certeza que deseja remover <strong>{nome}</strong>? Esta ação não pode ser desfeita.
        </p>
      </div>
      <div className="pm-modal-acoes">
        <button className="pm-btn-cancelar" onClick={onCancelar} disabled={loading}>Cancelar</button>
        <button className="pm-btn-remover-confirm" onClick={onConfirmar} disabled={loading}>
          {loading ? 'Removendo...' : 'Confirmar remoção'}
        </button>
      </div>
    </ModalOverlay>
  );
}

const TIPOS = [
  { value: 'pdf',          label: 'Documento',    sub: 'PDF' },
  { value: 'video',        label: 'Vídeo',        sub: 'Link do youtube' },
  { value: 'link',         label: 'Link externo',        sub: 'Site ou artigo online' },
];


function ModalMaterialEditar({ material, onClose, onSalvar, loading, conteudos }) {
  const [tipo, setTipo] = useState(material.tipo);
  const [form, setForm] = useState({
    nome: material.nome || '',
    conteudo: String(material.conteudo || ''),
    descricao: material.descricao || '',
    link: material.link || '',
  });
  const [arquivo, setArquivo] = useState(null);
  const [erros, setErros] = useState({});
  const [dragging, setDragging] = useState(false);

  const precisaArquivo = ['pdf','documento'].includes(tipo);
  const precisaLink = ['video', 'link'].includes(tipo);

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Título é obrigatório';
    if (!form.conteudo) e.conteudo = 'Conteúdo é obrigatório';
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
    const ok = await onSalvar(material.id, formData);
    if (ok) onClose();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="pm-modal-header">
        <h2 className="pm-modal-titulo">Editar material</h2>
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
              onClick={() => setTipo(t.value)}
            >
              <TipoIcone tipo={t.value} />
              <span className="pm-tipo-label">{t.label}</span>
              <span className="pm-tipo-sub">{t.sub}</span>
            </button>
          ))}
        </div>

        <label className="pm-label">Título do material</label>
        <input
          className="pm-input"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        />
        {erros.nome && <span className="pm-erro-msg">{erros.nome}</span>}

        <label className="pm-label">Conteúdo</label>
        <select
          className="pm-input pm-select"
          value={form.conteudo}
          onChange={e => setForm({ ...form, conteudo: e.target.value })}
        >
          {conteudos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        {erros.conteudo && <span className="pm-erro-msg">{erros.conteudo}</span>}

        <label className="pm-label">Descrição</label>
        <input
          className="pm-input"
          value={form.descricao}
          onChange={e => setForm({ ...form, descricao: e.target.value })}
        />

        {precisaLink && (
          <>
            <label className="pm-label">Link</label>
            <input
              className="pm-input"
              value={form.link}
              onChange={e => setForm({ ...form, link: e.target.value })}
            />
          </>
        )}

        <label className="pm-label">Substituir arquivo</label>
        <div
          className={`pm-dropzone ${dragging ? 'pm-dropzone--drag' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) setArquivo(file);
          }}
          onClick={() => document.getElementById('pm-file-input-editar').click()}
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
          id="pm-file-input-editar"
          type="file"
          style={{ display: 'none' }}
          onChange={e => setArquivo(e.target.files?.[0] || null)}
        />
      </div>

      <div className="pm-modal-acoes">
        <button className="pm-btn-adicionar pm-modal-acoes--center" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </ModalOverlay>
  );
}


function MaterialCard({ material, conteudos, disciplinas, onRemover, onEditar }) {
  const conteudo = conteudos.find(c => c.id === material.conteudo);
  const disciplina = disciplinas.find(d => d.id === conteudo?.disciplina);

  const dataFormatada = material.data_create
    ? new Date(material.data_create).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  const urlAbrir = material.link || (material.arquivo
    ? (material.arquivo.startsWith('http') ? material.arquivo : `http://localhost:8000${material.arquivo}`)
    : null);

  return (
    <div className="pm-card">
      <div className="pm-card-topo">
        <TipoIcone tipo={material.tipo} />
        <div className="pm-card-info">
          <span className="pm-card-nome">{material.nome}</span>
          {material.descricao && <span className="pm-card-desc">{material.descricao}</span>}
          <div className="pm-card-meta">
            {disciplina && <span className="pm-card-disciplina">{disciplina.nome}</span>}
            {disciplina && <span className="pm-meta-sep">•</span>}
            {conteudo && <span className="pm-meta-txt">{conteudo.nome}</span>}
            <span className="pm-meta-sep">•</span>
            <span className="pm-meta-txt">{dataFormatada}</span>
          </div>
        </div>
      </div>

      <div className="pm-card-acoes">
        <button className="pm-btn-remover" onClick={() => onRemover(material)}>Remover</button>
        <button className="pm-btn-editar" onClick={() => { console.log(material); onEditar(material); }}>Editar</button>
        {urlAbrir && (
          <>
            <a href={urlAbrir} download={!!material.arquivo} target="_blank" rel="noopener noreferrer">
              <button className="pm-btn-download" title="Baixar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" />
                  <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" />
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </a>
            <a href={urlAbrir} target="_blank" rel="noopener noreferrer">
              <button className="pm-btn-abrir">Abrir</button>
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`pm-toast pm-toast--${toast.tipo}`}>
      {toast.mensagem}
    </div>
  );
}


export function ProfessorMateriais() {
  const { user } = useAuth();

  const [materiais, setMateriais] = useState([]);
  const [conteudos, setConteudos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAcao, setLoadingAcao] = useState(false);
  const [erro, setErro] = useState(null);
  const [toast, setToast] = useState(null);

  const [busca, setBusca] = useState('');
  const [filtroConteudo, setFiltroConteudo] = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('');

  const [modalCriar, setModalCriar] = useState(false);
  const [materialParaRemover, setMaterialParaRemover] = useState(null);
  const [materialEditando, setMaterialEditando] = useState(null);

  const exibirToast = (tipo, mensagem) => {
    setToast({ tipo, mensagem });
    setTimeout(() => setToast(null), 3500);
  };

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const token = localStorage.getItem('authToken');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
      const perfilId = Number(payload.user_id);

      const [materiaisRes, conteudosRes, disciplinasRes, professoresRes] = await Promise.all([
        listarMateriais(),
        listarConteudos(),
        listarDisciplinas(),
        listarProfessoresAprovados(),
      ]);

      const todosConteudos = Array.isArray(conteudosRes.data) ? conteudosRes.data : [];
      const todasDisciplinas = Array.isArray(disciplinasRes.data) ? disciplinasRes.data : [];
      const todosMateriais = Array.isArray(materiaisRes.data) ? materiaisRes.data : [];

      const professorLogado = professoresRes.data.find(p => p.perfil?.id === perfilId);
      const professorId = professorLogado?.id;

      const conteudosDoProfessor = professorId
        ? todosConteudos.filter(c =>
          Array.isArray(c.professores) && c.professores.includes(professorId)
        )
        : [];

      const idsConteudos = new Set(conteudosDoProfessor.map(c => c.id));
      const materiaisDoProfessor = todosMateriais.filter(m => idsConteudos.has(m.conteudo));

      setConteudos(conteudosDoProfessor);
      setDisciplinas(todasDisciplinas);
      setMateriais(materiaisDoProfessor);
    } catch (err) {
      console.error(err);
      setErro('Não foi possível carregar os materiais. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    carregar();
  }, [carregar]);

  const materiaisFiltrados = materiais.filter(m => {
    const conteudo = conteudos.find(c => c.id === m.conteudo);
    const disciplina = disciplinas.find(d => d.id === conteudo?.disciplina);

    const buscaOk = !busca || m.nome.toLowerCase().includes(busca.toLowerCase());
    const conteudoOk = !filtroConteudo || String(m.conteudo) === filtroConteudo;
    const disciplinaOk = !filtroDisciplina || String(disciplina?.id) === filtroDisciplina;

    return buscaOk && conteudoOk && disciplinaOk;
  });

  const handleCriar = async (formData) => {
    setLoadingAcao(true);
    try {
      await criarMaterial(formData);
      exibirToast('sucesso', 'Material adicionado com sucesso!');
      await carregar();
      return true;
    } catch (err) {
      console.error(err);
      exibirToast('erro', 'Erro ao adicionar material.');
      return false;
    } finally {
      setLoadingAcao(false);
    }
  };

  const handleEditar = async (id, formData) => {
    setLoadingAcao(true);
    try {
      await editarMaterial(id, formData);
      exibirToast('sucesso', 'Material atualizado com sucesso!');
      await carregar();
      return true;
    } catch (err) {
      console.error(err);
      exibirToast('erro', 'Erro ao atualizar material.');
      return false;
    } finally {
      setLoadingAcao(false);
    }
  };

  const handleRemover = async () => {
    if (!materialParaRemover) return;
    setLoadingAcao(true);
    try {
      await deletarMaterial(materialParaRemover.id);
      exibirToast('sucesso', 'Material removido com sucesso!');
      setMaterialParaRemover(null);
      await carregar();
    } catch {
      exibirToast('erro', 'Erro ao remover material.');
    } finally {
      setLoadingAcao(false);
    }
  };

  return (
    <ProfessorLayout>
      <div className="pm-cabecalho">
        <div>
          <h1 className="pm-titulo">Meus materiais</h1>
          <p className="pm-subtitulo">Acesse materiais de estudo, vídeo-aulas e documentos compartilhados.</p>
        </div>
        <button className="pm-btn-novo" onClick={() => setModalCriar(true)}>
          + Novo material
        </button>
      </div>

      <div className="pm-filtros">
        <div className="pm-busca-wrap">
          <svg className="pm-busca-icone" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            className="pm-busca"
            placeholder="Buscar materiais..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            aria-label="Buscar materiais"
          />
        </div>

        <select
          className="pm-filtro-select"
          value={filtroDisciplina}
          onChange={e => setFiltroDisciplina(e.target.value)}
          aria-label="Filtrar por disciplina"
        >
          <option value="">Filtrar por disciplina</option>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
      </div>

      {loading && <p className="pm-estado">Carregando materiais...</p>}
      {!loading && erro && <p className="pm-estado pm-estado--erro">{erro}</p>}
      {!loading && !erro && materiaisFiltrados.length === 0 && (
        <p className="pm-estado">Nenhum material encontrado.</p>
      )}

      {!loading && !erro && (
        <div className="pm-grid">
          {materiaisFiltrados.map(m => (
            <MaterialCard
              key={m.id}
              material={m}
              conteudos={conteudos}
              disciplinas={disciplinas}
              onRemover={mat => setMaterialParaRemover(mat)}
              onEditar={mat => setMaterialEditando(mat)}
            />
          ))}
        </div>
      )}

      {modalCriar && (
        <ModalCriarMaterial
          onClose={() => setModalCriar(false)}
          onSalvar={handleCriar}
          loading={loadingAcao}
          conteudos={conteudos}
        />
      )}

      {materialEditando && (
        <ModalMaterialEditar
          material={materialEditando}
          conteudos={conteudos}
          onClose={() => setMaterialEditando(null)}
          onSalvar={handleEditar}
          loading={loadingAcao}
        />
      )}

      {materialParaRemover && (
        <ModalConfirmacao
          nome={materialParaRemover.nome}
          onConfirmar={handleRemover}
          onCancelar={() => setMaterialParaRemover(null)}
          loading={loadingAcao}
        />
      )}

      <Toast toast={toast} />
    </ProfessorLayout>
  );
}

export default ProfessorMateriais;