import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
// [Integração]: Importa o hook que concentra as requisições pro Django
import { useGerenciamentoDisciplinas } from '../../hooks/useGerenciamentoDisciplinas';
import './Disciplinas.css';

// ─── MOCKS ────────────────────────
const MOCK_DISCIPLINAS = [
  { id: 1, nome: 'Matemática',  descricao: 'Álgebra, cálculo e geometria', conteudos: 30, cor: '#4A90D9', icone: '⊞' },
  { id: 2, nome: 'Física',      descricao: 'Mecânica, termodinâmica e eletromagnetismo', conteudos: 87, cor: '#50B87A', icone: '⚛' },
  { id: 3, nome: 'Geografia',   descricao: 'Geografia humana e física', conteudos: 92, cor: '#C8A96E', icone: '🌐' },
];

const MOCK_CONTEUDOS = [
  { id: 1, nome: 'Probabilidade e estatística', disciplina: 'Matemática', professor: 'Prof. Carlos Silva', status: 'ativo', alunos: 45, cor: '#4A90D9', icone: '⊞' },
  { id: 2, nome: 'Eletromagnetismo',            disciplina: 'Física',     professor: 'Prof. Roberto Lima', status: 'ativo', alunos: 62, cor: '#50B87A', icone: '⚛' },
  { id: 3, nome: 'Geomorfologia',               disciplina: 'Geografia',  professor: 'Prof. Carlos Silva', status: 'pendente', alunos: 0, cor: '#C8A96E', icone: '🌐' },
];

const MOCK_MATERIAIS = [
  { id: 1, nome: 'Introdução às Funções Quadráticas', descricao: 'Material completo sobre funções quadráticas...', disciplina: 'Matemática', professor: 'Prof. Carlos Silva', data: '14 Mai 2026', tipo: 'pdf', cor: '#4A90D9' },
  { id: 2, nome: 'Leis de Newton - Aula Prática',     descricao: 'Vídeo-aula demonstrando as três leis de Newton...', disciplina: 'Física', professor: 'Prof. Ana Costa', data: '13 Mai 2026', tipo: 'video', cor: '#50B87A' },
];

const MOCK_ALUNOS = [
  { id: 1, nome: 'Alice Ferreira', matricula: '2024001' },
  { id: 2, nome: 'Bruno Mendes',   matricula: '2024002' },
];

function FileIcon({ tipo }) {
  if (tipo === 'video') return (
    <div className="mat-icon mat-icon--video">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>
    </div>
  );
  return (
    <div className="mat-icon mat-icon--pdf">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.8" fill="none"/><polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
    </div>
  );
}

function ModalOverlay({ onClose, children }) {
  return (
    <div className="disc-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="disc-modal">{children}</div>
    </div>
  );
}

// ─── MODAIS ───────────────────

function ModalDisciplinaCriar({ onClose, onSalvar, loading }) {
  const [form, setForm] = useState({ nome: '', descricao: '', ementa: '' });
  
  // [Integração]: Estado pra segurar os erros e não deixar enviar form vazio
  const [erros, setErros] = useState({});

  // [Integração]: Validação simples no front antes de bater na API
  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    if (!form.descricao.trim()) e.descricao = 'Descrição é obrigatória';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    // [Integração]: Dispara o POST pro backend
    const ok = await onSalvar({ nome: form.nome, descricao: form.descricao });
    if (ok) onClose();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title">Nova Disciplina</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <label className="disc-label">Nome <span className="disc-required">*</span></label>
        <input className={`disc-input ${erros.nome ? 'disc-input--erro' : ''}`} placeholder="Ex: Matemática" value={form.nome} onChange={e => { setForm({...form, nome: e.target.value}); setErros({...erros, nome: undefined}); }} />
        {/* [Integração]: Texto vermelho pra avisar do erro no campo */}
        {erros.nome && <span className="disc-erro-msg" style={{color:'red', fontSize:12, display:'block', marginBottom:8}}>{erros.nome}</span>}
        
        <label className="disc-label">Descrição <span className="disc-required">*</span></label>
        <input className={`disc-input ${erros.descricao ? 'disc-input--erro' : ''}`} placeholder="Breve descrição da disciplina" value={form.descricao} onChange={e => { setForm({...form, descricao: e.target.value}); setErros({...erros, descricao: undefined}); }} />
        {erros.descricao && <span className="disc-erro-msg" style={{color:'red', fontSize:12, display:'block', marginBottom:8}}>{erros.descricao}</span>}
        
        <label className="disc-label">Ementa</label>
        <textarea className="disc-input disc-textarea" placeholder="Conteúdo programático da disciplina..." value={form.ementa} onChange={e => setForm({...form, ementa: e.target.value})} rows={3} />
      </div>
      <div className="disc-modal-actions">
        {/* [Integração]: Desabilita os botões pra evitar double click enquanto a API carrega */}
        <button className="disc-btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="disc-btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'A criar...' : 'Criar Disciplina'}</button>
      </div>
    </ModalOverlay>
  );
}

function ModalDisciplinaEditar({ disciplina, onClose, onSalvar, loading, professores }) {
  const [form, setForm] = useState({ nome: disciplina.nome, descricao: disciplina.descricao || '', professoresVinculados: disciplina.professores || [] });
  const [erros, setErros] = useState({});

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    // [Integração]: Monta as alterações e atira pro PATCH usando o ID da disciplina
    const ok = await onSalvar(disciplina.id, { nome: form.nome, descricao: form.descricao, professores: form.professoresVinculados });
    if (ok) onClose();
  };

  // [Integração]: Lógica pra incluir ou remover o ID do professor no array de selecionados
  const toggleProfessor = (id) => {
    setForm(prev => ({
      ...prev,
      professoresVinculados: prev.professoresVinculados.includes(id) 
        ? prev.professoresVinculados.filter(pId => pId !== id) 
        : [...prev.professoresVinculados, id]
    }));
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title">Editar Disciplina</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <label className="disc-label">Nome <span className="disc-required">*</span></label>
        <input className={`disc-input ${erros.nome ? 'disc-input--erro' : ''}`} value={form.nome} onChange={e => { setForm({...form, nome: e.target.value}); setErros({...erros, nome: undefined}); }} />
        {erros.nome && <span className="disc-erro-msg" style={{color:'red', fontSize:12}}>{erros.nome}</span>}
        
        <label className="disc-label">Descrição</label>
        <input className="disc-input" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />

        <div className="disc-section-divider"><span>Alocar Professores na Disciplina</span></div>
        <div className="disc-dropdown-list disc-dropdown-list--static" style={{maxHeight: 120, overflowY: 'auto'}}>
          {professores && professores.map(p => {
            const nomeProf = p.perfil?.nome || p.nome || 'Professor';
            const isChecked = form.professoresVinculados.includes(p.id);
            return (
              <div key={p.id} className={`disc-dropdown-item ${isChecked ? 'disc-dropdown-item--active' : ''}`} onClick={() => toggleProfessor(p.id)}>
                <span className="disc-prof-avatar">{nomeProf[0]}</span>
                {nomeProf}
                {/* [Integração]: Renderiza o check "✓" condicionalmente */}
                {isChecked && <span className="disc-check" style={{marginLeft: 'auto'}}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="disc-btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'A guardar...' : 'Salvar Alterações'}</button>
      </div>
    </ModalOverlay>
  );
}

function ModalConfirmDelete({ titulo, subtitulo, aviso, onClose, onConfirm, loading }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title disc-modal-title--danger">Confirmar Exclusão</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <div className="disc-delete-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
        </div>
        <p className="disc-delete-title">{titulo}</p>
        <p className="disc-delete-sub">{subtitulo}</p>
        {aviso && <div className="disc-delete-aviso">{aviso}</div>}
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="disc-btn-danger" onClick={onConfirm} disabled={loading}>{loading ? 'A remover...' : 'Confirmar Exclusão'}</button>
      </div>
    </ModalOverlay>
  );
}

function ModalConteudoCriar({ onClose, onSalvar, loading, disciplinas }) {
  const [form, setForm] = useState({ nome: '', disciplina: '', descricao: '' });
  const [erros, setErros] = useState({});

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    if (!form.disciplina) e.disciplina = 'Disciplina é obrigatória';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    // [Integração]: Converte o ID da disciplina para Número pro Django não chiar
    const ok = await onSalvar({ nome: form.nome, descricao: form.descricao, disciplina: Number(form.disciplina) });
    if (ok) onClose();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title">Novo Conteúdo</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <label className="disc-label">Nome do conteúdo <span className="disc-required">*</span></label>
        <input className={`disc-input ${erros.nome ? 'disc-input--erro' : ''}`} value={form.nome} onChange={e => { setForm({...form, nome: e.target.value}); setErros({...erros, nome: undefined}); }} />
        {erros.nome && <span className="disc-erro-msg" style={{color:'red', fontSize:12}}>{erros.nome}</span>}
        
        <label className="disc-label">Disciplina <span className="disc-required">*</span></label>
        {/* [Integração]: Popula o select com as disciplinas vindas direto da API */}
        <select className={`disc-input disc-select ${erros.disciplina ? 'disc-input--erro' : ''}`} value={form.disciplina} onChange={e => { setForm({...form, disciplina: e.target.value}); setErros({...erros, disciplina: undefined}); }}>
          <option value="">Selecione uma disciplina</option>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
        {erros.disciplina && <span className="disc-erro-msg" style={{color:'red', fontSize:12}}>{erros.disciplina}</span>}
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="disc-btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'A criar...' : 'Criar Conteúdo'}</button>
      </div>
    </ModalOverlay>
  );
}

function ModalConteudoEditar({ conteudo, onClose, onSalvar, loading, disciplinas }) {
  const [form, setForm] = useState({
    nome: conteudo.nome,
    disciplina: String(conteudo.disciplina),
    descricao: conteudo.descricao || ''
  });
  const [erros, setErros] = useState({});

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    const ok = await onSalvar(conteudo.id, {
      nome: form.nome,
      descricao: form.descricao,
      disciplina: Number(form.disciplina)
    });
    if (ok) onClose();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title">Editar Conteúdo</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <label className="disc-label">Nome <span className="disc-required">*</span></label>
        <input className={`disc-input ${erros.nome ? 'disc-input--erro' : ''}`} value={form.nome} onChange={e => { setForm({...form, nome: e.target.value}); setErros({...erros, nome: undefined}); }} />
        {erros.nome && <span className="disc-erro-msg" style={{color:'red', fontSize:12}}>{erros.nome}</span>}

        <label className="disc-label">Disciplina</label>
        <select className="disc-input disc-select" value={form.disciplina} onChange={e => setForm({...form, disciplina: e.target.value})}>
          {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>

        <label className="disc-label">Descrição</label>
        <textarea className="disc-input disc-textarea" rows={3} value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="disc-btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'A guardar...' : 'Salvar Alterações'}</button>
      </div>
    </ModalOverlay>
  );
}

function ModalAlocarProfessorConteudo({ conteudo, onClose, onAlocar, professores, loading }) {
  const [professoresSelecionados, setProfessoresSelecionados] = useState(conteudo.professores || []);

  const handleSave = async () => {
    // [Integração]: Manda pro back só a listinha de IDs de quem tá com o check ativo
    const ok = await onAlocar(conteudo.id, professoresSelecionados);
    if (ok) onClose();
  };

  const toggleProfessor = (id) => {
    setProfessoresSelecionados(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title">Alocar Professor em "{conteudo.nome}"</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <label className="disc-label">Selecione os professores aprovados</label>
        <div className="disc-dropdown-list disc-dropdown-list--static">
          {professores && professores.length === 0 && <p className="disc-empty-text">Nenhum professor disponível.</p>}
          {professores && professores.map(p => {
            const nomeProf = p.perfil?.nome || p.nome || 'Professor';
            const isChecked = professoresSelecionados.includes(p.id);
            return (
              <div key={p.id} className={`disc-dropdown-item ${isChecked ? 'disc-dropdown-item--active' : ''}`} onClick={() => toggleProfessor(p.id)}>
                <span className="disc-prof-avatar">{nomeProf[0]}</span>
                {nomeProf}
                {isChecked && <span className="disc-check" style={{marginLeft: 'auto'}}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="disc-btn-primary" onClick={handleSave} disabled={loading}>Confirmar Alocação</button>
      </div>
    </ModalOverlay>
  );
}

// [Integração]: Modal de Matrículas refatorado pra usar os dados vivos do Django
function ModalMatriculas({ conteudo, onClose, alunos, matriculas, onMatricular, onCancelar, loading }) {
  const [busca, setBusca] = useState('');
  const [confirmRemover, setConfirmRemover] = useState(null);

  // [Integração]: Pega só as matrículas que são desta turma/conteúdo
  const matriculasDoConteudo = matriculas.filter(m => m.conteudo === conteudo.id);
  
  // [Integração]: Filtra a lista de alunos (tira quem já tá matriculado) pra exibir na busca
  const filtrados = alunos.filter(a => {
    const nomeAluno = a.perfil?.nome || a.nome || '';
    const jaMatriculado = matriculasDoConteudo.some(m => m.aluno === a.id);
    return !jaMatriculado && nomeAluno.toLowerCase().includes(busca.toLowerCase());
  });
  
  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title">Alunos Matriculados</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <p className="disc-mat-conteudo-nome">{conteudo.nome}</p>
        <label className="disc-label">Adicionar aluno</label>
        <div className="disc-busca-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="disc-busca-icon"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/></svg>
          <input className="disc-input disc-input--search" placeholder="Buscar aluno por nome ou matrícula..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        
        {busca && filtrados.length > 0 && (
          <div className="disc-dropdown-list">
            {filtrados.map(a => {
              const nome = a.perfil?.nome || a.nome || 'Aluno';
              return (
                // [Integração]: Clicou no aluno da lista -> Chama a API pra criar a matrícula
                <div key={a.id} className="disc-dropdown-item" onClick={async () => { await onMatricular(conteudo.id, a.id); setBusca(''); }}>
                  <span className="disc-prof-avatar">{nome[0]}</span>
                  <div><div style={{fontSize:13, fontWeight:600}}>{nome}</div><div style={{fontSize:11,color:'#7A8A96'}}>Mat: {a.matricula || '—'}</div></div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="disc-section-divider"><span>Alunos matriculados ({matriculasDoConteudo.length})</span></div>
        
        {matriculasDoConteudo.length === 0 ? (
          <p className="disc-empty-text">Nenhum aluno matriculado.</p>
        ) : (
          <div className="disc-alunos-list">
            {matriculasDoConteudo.map(m => {
              // [Integração]: Procura o aluno correspondente ao ID da matrícula
              const a = alunos.find(al => al.id === m.aluno);
              const nome = a?.perfil?.nome || a?.nome || 'Aluno';
              return (
                <div key={m.id} className="disc-aluno-item">
                  <span className="disc-prof-avatar">{nome[0]}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:'#1C2B3A'}}>{nome}</div>
                    <div style={{fontSize:11,color:'#7A8A96'}}>Matrícula: {a?.matricula || '—'}</div>
                  </div>
                  <button className="disc-aluno-remove" onClick={() => setConfirmRemover(m)}>Cancelar matrícula</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose}>Fechar</button>
      </div>
      
      {/* [Integração]: Submodal de confirmação antes de deletar a matrícula no back */}
      {confirmRemover && (
        <div className="disc-overlay disc-overlay--nested" onClick={() => setConfirmRemover(null)}>
          <div className="disc-modal disc-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="disc-modal-header">
              <h2 className="disc-modal-title disc-modal-title--danger">Cancelar Matrícula</h2>
              <button className="disc-modal-close" onClick={() => setConfirmRemover(null)}>✕</button>
            </div>
            <div className="disc-modal-body">
              <p style={{fontSize:14,color:'#3A4A58',margin:'0 0 8px'}}>Deseja cancelar esta matrícula?</p>
              <div className="disc-delete-aviso">Esta ação não pode ser desfeita.</div>
            </div>
            <div className="disc-modal-actions">
              <button className="disc-btn-cancel" onClick={() => setConfirmRemover(null)} disabled={loading}>Voltar</button>
              <button className="disc-btn-danger" onClick={async () => { await onCancelar(confirmRemover.id); setConfirmRemover(null); }} disabled={loading}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </ModalOverlay>
  );
}

// ─── CARDS DA INTERFACE ───────────────────────────

const CORES = ['#4A90D9', '#50B87A', '#C8A96E', '#E07A5F', '#9B72CF', '#3D9970'];
const ICONES = ['⊞', '⚛', '🌐', '📐', '🔬', '📚'];

function DisciplinaCard({ d, index, onEditar, onDeletar }) {
  const cor = CORES[index % CORES.length] || d.cor;
  const icone = ICONES[index % ICONES.length] || d.icone;
  return (
    <div className="disc-card">
      <div className="disc-card-header" style={{ borderTopColor: cor }}>
        <div className="disc-card-icon" style={{ background: cor + '22', color: cor }}>{icone}</div>
        <h3 className="disc-card-nome">{d.nome}</h3>
      </div>
      <div className="disc-card-body">
        <div className="disc-card-meta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8"/></svg>
          {/* [Integração]: Formata a data bruta que vem do banco */}
          {d.data_create ? new Date(d.data_create).toLocaleDateString('pt-BR') : 'Sem data'}
        </div>
        <div className="disc-card-meta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><polyline points="12,7 12,12 15,15" stroke="currentColor" strokeWidth="1.8"/></svg>
          {d.conteudos_count ?? d.conteudos ?? 0} conteúdos vinculados
        </div>
        {d.descricao && <p className="disc-card-desc">{d.descricao}</p>}
      </div>
      <div className="disc-card-actions">
        <button className="disc-btn-outline" onClick={() => onEditar(d)}>Editar Disciplina</button>
        <button className="disc-btn-dark" onClick={() => onDeletar(d)}>Deletar Disciplina</button>
      </div>
    </div>
  );
}

function ConteudoCard({ c, index, disciplinas, onEditar, onDeletar, onMatriculas, onAlocarProfessor }) {
  const cor = CORES[index % CORES.length] || c.cor;
  const icone = ICONES[index % ICONES.length] || c.icone;
  // [Integração]: Caça o nome da disciplina pai batendo o ID
  const nomeDisciplina = disciplinas.find(d => d.id === c.disciplina)?.nome || c.disciplina || '—';

  return (
    <div className="disc-card">
      <div className="disc-card-header" style={{ borderTopColor: cor }}>
        <div className="disc-card-icon" style={{ background: cor + '22', color: cor }}>{icone}</div>
        <h3 className="disc-card-nome">{c.nome}</h3>
        <span className="disc-card-prof">{nomeDisciplina}</span>
      </div>
      <div className="disc-card-body">
        <div className="disc-card-meta">Professores: {c.professores?.length ?? 0}</div>
        
        <button className="disc-btn-outline" style={{marginBottom: 8, padding: '4px 0'}} onClick={() => onAlocarProfessor(c)}>
          👤 Alocar Professor
        </button>

        <button className="disc-alocar-btn" onClick={() => onMatriculas(c)}>
          Alunos ({c.alunos ?? 0})
        </button>
      </div>
      <div className="disc-card-actions">
        <button className="disc-btn-outline" onClick={() => onEditar(c)}>Editar Conteúdo</button>
        <button className="disc-btn-dark" onClick={() => onDeletar(c)}>Deletar Conteúdo</button>
      </div>
    </div>
  );
}

// [Integração]: Toast rapidinho pra não deixar o usuário no escuro (exibe erro/sucesso da API)
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`gs-toast gs-toast--${toast.tipo}`} style={{ position: 'fixed', bottom: 20, right: 20, padding: '12px 24px', borderRadius: 8, color: '#fff', background: toast.tipo === 'sucesso' ? '#2E8B57' : '#D94040', zIndex: 9999 }}>
      <span>{toast.mensagem}</span>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ────────────

export function Disciplinas() {
  const {
    disciplinas,
    conteudos,
    professores,
    // [Integração]: Puxa os dados e métodos das matrículas lá do hook
    alunos,
    matriculas,
    loading,
    erro,
    toast,
    handleCriarDisciplina,
    handleEditarDisciplina,
    handleDeletarDisciplina,
    handleCriarConteudo,
    handleEditarConteudo,
    handleDeletarConteudo,
    handleAlocarProfessor,
    handleMatricularAluno,
    handleCancelarMatricula,
    conteudosDaDisciplina,
  } = useGerenciamentoDisciplinas();

  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState(null);
  const [modalTarget, setModalTarget] = useState(null);

  const open = (tipo, target = null) => { setModal(tipo); setModalTarget(target); };
  const close = () => { setModal(null); setModalTarget(null); };

  // [Integração]: Filtro de busca na lista viva da API
  const disciplinasFiltradas = disciplinas.filter(d => d.nome.toLowerCase().includes(busca.toLowerCase()));
  const conteudosFiltrados = conteudos.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));

  // [Integração]: Manda os dados reais. Se a DB tiver vazia, manda os mocks pra tela não ficar esburacada
  const listaDisciplinasRender = disciplinas.length > 0 ? disciplinasFiltradas : MOCK_DISCIPLINAS;
  const listaConteudosRender = conteudos.length > 0 ? conteudosFiltrados : MOCK_CONTEUDOS;

  return (
    <AdminLayout>
      <div className="disc-topbar">
        <div>
          <h1 className="disc-page-title">Gerenciamento de disciplina, conteudo e material</h1>
          <p className="disc-page-sub">todos os conteúdos e atividades da plataforma</p>
        </div>
      </div>

      <div className="disc-filters">
        <div className="disc-search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="disc-search-icon"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/></svg>
          <input className="disc-search" placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
      </div>

      <section className="disc-section">
        <div className="disc-section-header">
          <h2 className="disc-section-title">Disciplinas</h2>
          <button className="disc-btn-primary disc-btn-new" onClick={() => open('nova-disc')}>
            <span>+</span> Nova disciplina
          </button>
        </div>
        
        {/* [Integração]: Mostra logo se o Django estiver dormindo ou der erro de rede */}
        {!loading && erro && <p className="disc-estado disc-estado--erro" style={{color:'red'}}>{erro}</p>}
        
        <div className="disc-grid">
          {listaDisciplinasRender.map((d, i) => (
            <DisciplinaCard key={d.id} d={d} index={i} onEditar={d => open('editar-disc', d)} onDeletar={d => open('deletar-disc', d)} />
          ))}
        </div>
      </section>

      <section className="disc-section">
        <div className="disc-section-header">
          <h2 className="disc-section-title">Conteúdos</h2>
          <button className="disc-btn-primary disc-btn-new" onClick={() => open('novo-cont')}>
            <span>+</span> Novo conteúdo
          </button>
        </div>
        <div className="disc-grid">
          {listaConteudosRender.map((c, i) => (
            <ConteudoCard key={c.id} c={c} index={i} disciplinas={disciplinas} onEditar={c => open('editar-cont', c)} onDeletar={c => open('deletar-cont', c)} onMatriculas={c => open('matriculas', c)} onAlocarProfessor={c => open('alocar-prof', c)} />
          ))}
        </div>
      </section>

      <section className="disc-section">
        <div className="disc-section-header">
          <h2 className="disc-section-title">Materiais</h2>
          <button className="disc-btn-primary disc-btn-new"><span>+</span> Novo material</button>
        </div>
        <div className="mat-grid">
          {MOCK_MATERIAIS.map(m => (
            <div key={m.id} className="mat-card">
              <div className="mat-card-left">
                <FileIcon tipo={m.tipo} />
                <div className="mat-info">
                  <p className="mat-nome">{m.nome}</p>
                  <p className="mat-desc">{m.descricao}</p>
                  <div className="mat-meta">
                    <span className="mat-tag" style={{ color: m.cor }}>{m.disciplina}</span>
                    <span className="mat-sep">·</span>
                    <span className="mat-meta-txt">{m.professor}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* [Integração]: Acoplando tudo nos modais */}
      {modal === 'nova-disc' && <ModalDisciplinaCriar onClose={close} onSalvar={handleCriarDisciplina} loading={loading} />}
      {modal === 'editar-disc' && <ModalDisciplinaEditar disciplina={modalTarget} onClose={close} onSalvar={handleEditarDisciplina} loading={loading} professores={professores} />}
      
      {modal === 'deletar-disc' && (() => {
        // [Integração]: Checa e avisa se tentar apagar disciplina que tem turma amarrada nela
        const vinculados = conteudosDaDisciplina(modalTarget?.id);
        return (
          <ModalConfirmDelete
            titulo={`Deletar "${modalTarget?.nome}"?`}
            subtitulo="Esta disciplina será permanentemente removida da plataforma."
            aviso={vinculados.length > 0 ? `⚠️ Atenção: esta disciplina possui ${vinculados.length} conteúdo(s) vinculado(s) que também serão removidos.` : null}
            onClose={close}
            onConfirm={async () => {
              const ok = await handleDeletarDisciplina(modalTarget.id);
              if (ok) close();
            }}
            loading={loading}
          />
        );
      })()}

      {modal === 'novo-cont' && <ModalConteudoCriar onClose={close} onSalvar={handleCriarConteudo} loading={loading} disciplinas={disciplinas} />}
      {modal === 'editar-cont' && <ModalConteudoEditar conteudo={modalTarget} onClose={close} onSalvar={handleEditarConteudo} loading={loading} disciplinas={disciplinas} professores={professores} />}
      
      {modal === 'alocar-prof' && <ModalAlocarProfessorConteudo conteudo={modalTarget} onClose={close} onAlocar={handleAlocarProfessor} professores={professores} loading={loading} />}

      {modal === 'deletar-cont' && (
        <ModalConfirmDelete
          titulo={`Deletar "${modalTarget?.nome}"?`}
          subtitulo="Este conteúdo será permanentemente removido."
          aviso="⚠️ Atenção: todas as matrículas de alunos vinculadas a este conteúdo também serão removidas."
          onClose={close}
          onConfirm={async () => {
            const ok = await handleDeletarConteudo(modalTarget.id);
            if (ok) close();
          }}
          loading={loading}
        />
      )}

      {/* [Integração]: Passa os alunos, matrículas e as funções de CRUD lá pro modal de Matrículas */}
      {modal === 'matriculas' && (
        <ModalMatriculas 
          conteudo={modalTarget} 
          onClose={close} 
          alunos={alunos} 
          matriculas={matriculas} 
          onMatricular={handleMatricularAluno} 
          onCancelar={handleCancelarMatricula} 
          loading={loading} 
        />
      )}

      <Toast toast={toast} />
    </AdminLayout>
  );
}

export default Disciplinas;