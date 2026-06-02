import { useState } from 'react';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import './Disciplinas.css';

const MOCK_DISCIPLINAS = [
  { id: 1, nome: 'Matemática',  descricao: 'Álgebra, cálculo e geometria', conteudos: 30, cor: '#4A90D9', icone: '⊞', professorVinculado: 'Prof. Carlos Silva' },
  { id: 2, nome: 'Física',      descricao: 'Mecânica, termodinâmica e eletromagnetismo', conteudos: 87, cor: '#50B87A', icone: '⚛', professorVinculado: 'Prof. Roberto Lima' },
  { id: 3, nome: 'Geografia',   descricao: 'Geografia humana e física', conteudos: 92, cor: '#C8A96E', icone: '🌐', professorVinculado: null },
];

const MOCK_CONTEUDOS = [
  { id: 1, nome: 'Probabilidade e estatística', disciplina: 'Matemática', professor: 'Prof. Carlos Silva', status: 'ativo', alunos: 45, cor: '#4A90D9', icone: '⊞' },
  { id: 2, nome: 'Eletromagnetismo',            disciplina: 'Física',     professor: 'Prof. Roberto Lima', status: 'ativo', alunos: 62, cor: '#50B87A', icone: '⚛' },
  { id: 3, nome: 'Geomorfologia',               disciplina: 'Geografia',  professor: 'Prof. Carlos Silva', status: 'pendente', alunos: 0, cor: '#C8A96E', icone: '🌐' },
];

const MOCK_MATERIAIS = [
  { id: 1, nome: 'Introdução às Funções Quadráticas', descricao: 'Material completo sobre funções quadráticas, incluindo gráficos e exercícios resolvidos.', disciplina: 'Matemática', professor: 'Prof. Carlos Silva', data: '14 Mai 2026', tipo: 'pdf', cor: '#4A90D9' },
  { id: 2, nome: 'Leis de Newton - Aula Prática',     descricao: 'Vídeo-aula demonstrando as três leis de Newton com experimentos práticos.', disciplina: 'Física', professor: 'Prof. Ana Costa', data: '13 Mai 2026', tipo: 'video', cor: '#50B87A' },
];

const MOCK_PROFESSORES = [
  { id: 1, nome: 'Prof. Carlos Silva' },
  { id: 2, nome: 'Prof. Roberto Lima' },
  { id: 3, nome: 'Prof. Ana Costa' },
  { id: 4, nome: 'Prof. Mariana Rocha' },
];

const MOCK_ALUNOS = [
  { id: 1, nome: 'Alice Ferreira', matricula: '2024001' },
  { id: 2, nome: 'Bruno Mendes',   matricula: '2024002' },
  { id: 3, nome: 'Carla Santos',   matricula: '2024003' },
  { id: 4, nome: 'Daniel Costa',   matricula: '2024004' },
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

//criar disciplina
function ModalDisciplinaCriar({ onClose }) {
  const [form, setForm] = useState({ nome: '', descricao: '', ementa: '' });
  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title">Nova Disciplina</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <label className="disc-label">Nome <span className="disc-required">*</span></label>
        <input className="disc-input" placeholder="Ex: Matemática" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
        <label className="disc-label">Descrição</label>
        <input className="disc-input" placeholder="Breve descrição da disciplina" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
        <label className="disc-label">Ementa</label>
        <textarea className="disc-input disc-textarea" placeholder="Conteúdo programático da disciplina..." value={form.ementa} onChange={e => setForm({...form, ementa: e.target.value})} rows={4} />
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose}>Cancelar</button>
        <button className="disc-btn-primary">Criar Disciplina</button>
      </div>
    </ModalOverlay>
  );
}
// Editar disciplina
function ModalDisciplinaEditar({ disciplina, onClose }) {
  const [form, setForm] = useState({ nome: disciplina.nome, descricao: disciplina.descricao, ementa: '' });
  const [profSelecionado, setProfSelecionado] = useState(disciplina.professorVinculado || '');
  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title">Editar Disciplina</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <label className="disc-label">Nome <span className="disc-required">*</span></label>
        <input className="disc-input" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
        <label className="disc-label">Descrição</label>
        <input className="disc-input" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
        <label className="disc-label">Ementa</label>
        <textarea className="disc-input disc-textarea" rows={3} value={form.ementa} onChange={e => setForm({...form, ementa: e.target.value})} />
        <div className="disc-section-divider">
          <span>Alocar Professor</span>
        </div>
        <label className="disc-label">Professor responsável</label>
        <select className="disc-input disc-select" value={profSelecionado} onChange={e => setProfSelecionado(e.target.value)}>
          <option value="">— Sem professor —</option>
          {MOCK_PROFESSORES.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
        </select>
        {profSelecionado && (
          <div className="disc-prof-badge">
            <span className="disc-prof-avatar">{profSelecionado[0]}</span>
            <span>{profSelecionado}</span>
          </div>
        )}
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose}>Cancelar</button>
        <button className="disc-btn-primary">Salvar Alterações</button>
      </div>
    </ModalOverlay>
  );
}
// Confirmar exclusão disciplina
function ModalConfirmDelete({ titulo, subtitulo, aviso, onClose, onConfirm }) {
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
        <button className="disc-btn-cancel" onClick={onClose}>Cancelar</button>
        <button className="disc-btn-danger" onClick={onConfirm}>Confirmar Exclusão</button>
      </div>
    </ModalOverlay>
  );
}
// Criar conteudo
function ModalConteudoCriar({ onClose }) {
  const [form, setForm] = useState({ nome: '', disciplina: '', descricao: '' });
  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title">Novo Conteúdo</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <label className="disc-label">Nome do conteúdo <span className="disc-required">*</span></label>
        <input className="disc-input" placeholder="Ex: Probabilidade e Estatística" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
        <label className="disc-label">Disciplina <span className="disc-required">*</span></label>
        <select className="disc-input disc-select" value={form.disciplina} onChange={e => setForm({...form, disciplina: e.target.value})}>
          <option value="">Selecione uma disciplina</option>
          {MOCK_DISCIPLINAS.map(d => <option key={d.id} value={d.nome}>{d.nome}</option>)}
        </select>
        <label className="disc-label">Descrição</label>
        <textarea className="disc-input disc-textarea" rows={3} placeholder="Descreva o conteúdo..." value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose}>Cancelar</button>
        <button className="disc-btn-primary">Criar Conteúdo</button>
      </div>
    </ModalOverlay>
  );
}
// Editar conteudo
function ModalConteudoEditar({ conteudo, onClose }) {
  const [form, setForm] = useState({ nome: conteudo.nome, disciplina: conteudo.disciplina, descricao: '' });
  const [profDropdown, setProfDropdown] = useState(false);
  const [profSelecionado, setProfSelecionado] = useState(conteudo.professor);
  return (
    <ModalOverlay onClose={onClose}>
      <div className="disc-modal-header">
        <h2 className="disc-modal-title">Editar Conteúdo</h2>
        <button className="disc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="disc-modal-body">
        <label className="disc-label">Nome <span className="disc-required">*</span></label>
        <input className="disc-input" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
        <label className="disc-label">Disciplina</label>
        <select className="disc-input disc-select" value={form.disciplina} onChange={e => setForm({...form, disciplina: e.target.value})}>
          {MOCK_DISCIPLINAS.map(d => <option key={d.id} value={d.nome}>{d.nome}</option>)}
        </select>
        <label className="disc-label">Alocar professor</label>
        <div className="disc-dropdown-wrap">
          <button className="disc-input disc-dropdown-btn" onClick={() => setProfDropdown(!profDropdown)}>
            <span>{profSelecionado || 'Selecione um professor'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2"/></svg>
          </button>
          {profDropdown && (
            <div className="disc-dropdown-list">
              {MOCK_PROFESSORES.map(p => (
                <div key={p.id} className={`disc-dropdown-item ${profSelecionado === p.nome ? 'disc-dropdown-item--active' : ''}`}
                  onClick={() => { setProfSelecionado(p.nome); setProfDropdown(false); }}>
                  <span className="disc-prof-avatar">{p.nome[0]}</span>
                  {p.nome}
                </div>
              ))}
            </div>
          )}
        </div>
        {profSelecionado && (
          <div className="disc-prof-badge">
            <span className="disc-prof-avatar">{profSelecionado[0]}</span>
            <span>{profSelecionado}</span>
            <button className="disc-prof-remove" onClick={() => setProfSelecionado('')}>✕</button>
          </div>
        )}
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose}>Cancelar</button>
        <button className="disc-btn-primary">Salvar Alterações</button>
      </div>
    </ModalOverlay>
  );
}
// ALunos
function ModalMatriculas({ conteudo, onClose }) {
  const [busca, setBusca] = useState('');
  const [matriculados, setMatriculados] = useState([MOCK_ALUNOS[0], MOCK_ALUNOS[1]]);
  const [confirmRemover, setConfirmRemover] = useState(null);
  const filtrados = MOCK_ALUNOS.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()) && !matriculados.find(m => m.id === a.id));
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
            {filtrados.map(a => (
              <div key={a.id} className="disc-dropdown-item" onClick={() => { setMatriculados([...matriculados, a]); setBusca(''); }}>
                <span className="disc-prof-avatar">{a.nome[0]}</span>
                <div><div style={{fontSize:13, fontWeight:600}}>{a.nome}</div><div style={{fontSize:11,color:'#7A8A96'}}>Mat: {a.matricula}</div></div>
              </div>
            ))}
          </div>
        )}
        <div className="disc-section-divider"><span>Alunos matriculados ({matriculados.length})</span></div>
        {matriculados.length === 0 ? (
          <p className="disc-empty-text">Nenhum aluno matriculado.</p>
        ) : (
          <div className="disc-alunos-list">
            {matriculados.map(a => (
              <div key={a.id} className="disc-aluno-item">
                <span className="disc-prof-avatar">{a.nome[0]}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#1C2B3A'}}>{a.nome}</div>
                  <div style={{fontSize:11,color:'#7A8A96'}}>Matrícula: {a.matricula}</div>
                </div>
                <button className="disc-aluno-remove" onClick={() => setConfirmRemover(a)}>Cancelar matrícula</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="disc-modal-actions">
        <button className="disc-btn-cancel" onClick={onClose}>Fechar</button>
      </div>
      {confirmRemover && (
        <div className="disc-overlay disc-overlay--nested" onClick={() => setConfirmRemover(null)}>
          <div className="disc-modal disc-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="disc-modal-header">
              <h2 className="disc-modal-title disc-modal-title--danger">Cancelar Matrícula</h2>
              <button className="disc-modal-close" onClick={() => setConfirmRemover(null)}>✕</button>
            </div>
            <div className="disc-modal-body">
              <p style={{fontSize:14,color:'#3A4A58',margin:'0 0 8px'}}>Deseja cancelar a matrícula de <strong>{confirmRemover.nome}</strong>?</p>
              <div className="disc-delete-aviso">Esta ação não pode ser desfeita.</div>
            </div>
            <div className="disc-modal-actions">
              <button className="disc-btn-cancel" onClick={() => setConfirmRemover(null)}>Voltar</button>
              <button className="disc-btn-danger" onClick={() => { setMatriculados(matriculados.filter(m => m.id !== confirmRemover.id)); setConfirmRemover(null); }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </ModalOverlay>
  );
}
// Editar ou deletar disciplina
function DisciplinaCard({ d, onEditar, onDeletar }) {
  return (
    <div className="disc-card">
      <div className="disc-card-header" style={{ borderTopColor: d.cor }}>
        <div className="disc-card-icon" style={{ background: d.cor + '22', color: d.cor }}>{d.icone}</div>
        <h3 className="disc-card-nome">{d.nome}</h3>
      </div>
      <div className="disc-card-body">
        <div className="disc-card-meta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8"/></svg>
          Criada em data
        </div>
        <div className="disc-card-meta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><polyline points="12,7 12,12 15,15" stroke="currentColor" strokeWidth="1.8"/></svg>
          {d.conteudos} conteúdos
        </div>
      </div>
      <div className="disc-card-actions">
        <button className="disc-btn-outline" onClick={() => onEditar(d)}>Editar Disciplina</button>
        <button className="disc-btn-dark" onClick={() => onDeletar(d)}>Deletar Disciplina</button>
      </div>
    </div>
  );
}

function ConteudoCard({ c, onEditar, onDeletar, onMatriculas }) {
  return (
    <div className="disc-card">
      <div className="disc-card-header" style={{ borderTopColor: c.cor }}>
        <div className="disc-card-icon" style={{ background: c.cor + '22', color: c.cor }}>{c.icone}</div>
        <h3 className="disc-card-nome">{c.nome}</h3>
        <span className="disc-card-prof">{c.professor}</span>
      </div>
      <div className="disc-card-body">
        <div className="disc-card-meta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/></svg>
          Informações
        </div>
        <div className="disc-card-meta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/></svg>
          Informações
        </div>
        <button className="disc-alocar-btn" onClick={() => onMatriculas(c)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><line x1="23" y1="11" x2="23" y2="17" stroke="currentColor" strokeWidth="1.8"/><line x1="20" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.8"/></svg>
          Alunos ({c.alunos})
        </button>
      </div>
      <div className="disc-card-actions">
        <button className="disc-btn-outline" onClick={() => onEditar(c)}>Editar Conteúdo</button>
        <button className="disc-btn-dark" onClick={() => onDeletar(c)}>Deletar Conteúdo</button>
      </div>
    </div>
  );
}

export function Disciplinas() {
  const [busca, setBusca] = useState('');

  const [modal, setModal] = useState(null);
  const [modalTarget, setModalTarget] = useState(null);

  const open = (tipo, target = null) => { setModal(tipo); setModalTarget(target); };
  const close = () => { setModal(null); setModalTarget(null); };

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
          <input className="disc-search" placeholder="Buscar materiais..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <button className="disc-filter-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
          Filtrar por conteúdo
        </button>
        <button className="disc-filter-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
          Filtrar por disciplina
        </button>
      </div>

      <section className="disc-section">
        <div className="disc-section-header">
          <h2 className="disc-section-title">Disciplinas</h2>
          <button className="disc-btn-primary disc-btn-new" onClick={() => open('nova-disc')}>
            <span>+</span> Nova disciplina
          </button>
        </div>
        <div className="disc-grid">
          {MOCK_DISCIPLINAS.map(d => (
            <DisciplinaCard key={d.id} d={d}
              onEditar={d => open('editar-disc', d)}
              onDeletar={d => open('deletar-disc', d)} />
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
          {MOCK_CONTEUDOS.map(c => (
            <ConteudoCard key={c.id} c={c}
              onEditar={c => open('editar-cont', c)}
              onDeletar={c => open('deletar-cont', c)}
              onMatriculas={c => open('matriculas', c)} />
          ))}
        </div>
      </section>

      <section className="disc-section">
        <div className="disc-section-header">
          <h2 className="disc-section-title">Materiais</h2>
          <button className="disc-btn-primary disc-btn-new">
            <span>+</span> Novo material
          </button>
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
                    <span className="mat-sep">·</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/></svg>
                    <span className="mat-meta-txt">{m.data}</span>
                  </div>
                </div>
              </div>
              <div className="mat-actions">
                <button className="mat-btn-remove">Remover</button>
                <button className="mat-btn-edit">Editar</button>
                <button className="mat-btn-icon" title="Download">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2"/><polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/></svg>
                </button>
                <button className="disc-btn-primary mat-btn-abrir">Abrir</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {modal === 'nova-disc'    && <ModalDisciplinaCriar onClose={close} />}
      {modal === 'editar-disc'  && <ModalDisciplinaEditar disciplina={modalTarget} onClose={close} />}
      {modal === 'deletar-disc' && (
        <ModalConfirmDelete
          titulo={`Deletar "${modalTarget?.nome}"?`}
          subtitulo="Esta disciplina será permanentemente removida da plataforma."
          aviso="⚠️ Atenção: todos os conteúdos e materiais vinculados a esta disciplina também serão removidos."
          onClose={close} onConfirm={close} />
      )}
      {modal === 'novo-cont'    && <ModalConteudoCriar onClose={close} />}
      {modal === 'editar-cont'  && <ModalConteudoEditar conteudo={modalTarget} onClose={close} />}
      {modal === 'deletar-cont' && (
        <ModalConfirmDelete
          titulo={`Deletar "${modalTarget?.nome}"?`}
          subtitulo="Este conteúdo será permanentemente removido."
          aviso="⚠️ Atenção: todas as matrículas de alunos vinculadas a este conteúdo também serão removidas."
          onClose={close} onConfirm={close} />
      )}
      {modal === 'matriculas'   && <ModalMatriculas conteudo={modalTarget} onClose={close} />}
    </AdminLayout>
  );
}

export default Disciplinas;