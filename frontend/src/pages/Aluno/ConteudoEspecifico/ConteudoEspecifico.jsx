import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConteudoEspecifico } from '../../../hooks/useConteudoEspecifico';
import { AlunoLayout } from '../../../components/aluno/AlunoLayout'; // ADICIONADO IMPORT
import './ConteudoEspecifico.css';

const TIPO_ICONE = {
  pdf: '📄',
  video: '🎬',
  imagem: '🖼️',
  link: '🔗',
  apresentacao: '📊',
  documento: '📃',
};

function formatarData(dataIso) {
  if (!dataIso) return '';
  return new Date(dataIso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function MaterialCardSkeleton() {
  return (
    <div className="ce-skeleton-card" aria-hidden="true">
      <div className="ce-skeleton-icon-box" />
      <div className="ce-skeleton-line" style={{ height: 14, width: '70%' }} />
      <div className="ce-skeleton-line" style={{ height: 12, width: '40%' }} />
      <div className="ce-skeleton-btn" />
    </div>
  );
}

function MaterialCard({ material, disciplinaNome, professores }) {
  const icone = TIPO_ICONE[material.tipo] || '📁';
  const url = material.arquivo || material.link;
  const isDownload = Boolean(material.arquivo);
  const nomeProfessor = professores[0]?.nome;

  return (
    <div className="ce-material-card">
      <div className="ce-material-top">
        <span className={`ce-material-icon ce-material-icon--${material.tipo}`} aria-hidden="true">
          {icone}
        </span>
        <div className="ce-material-info">
          <h3 className="ce-material-nome">{material.nome}</h3>
          {material.descricao && (
            <p className="ce-material-descricao">{material.descricao}</p>
          )}
          <p className="ce-material-meta">
            {[disciplinaNome, nomeProfessor, formatarData(material.data_create)]
              .filter(Boolean)
              .join(' • ')}
          </p>
        </div>
      </div>

      <div className="ce-material-actions">
        {url ? (
          <>
            {isDownload && (
              <a
                className="ce-btn-download"
                href={url}
                target="_blank"
                rel="noreferrer"
                download={material.nome}
                aria-label={`Baixar ${material.nome}`}
                title="Baixar"
              >
                ⬇
              </a>
            )}
            <a className="ce-btn-abrir" href={url} target="_blank" rel="noreferrer">
              Abrir
            </a>
          </>
        ) : (
          <button className="ce-btn-abrir" disabled>
            Indisponível
          </button>
        )}
      </div>
    </div>
  );
}

export function ConteudoEspecifico() {
  const { id } = useParams();
  const {
    conteudo,
    disciplina,
    professores,
    materiais,
    loading,
    erro,
    refetch,
    podeDesinscrever,
    desinscrevendo,
    erroDesinscricao,
    handleDesinscrever,
  } = useConteudoEspecifico(id);

  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('recentes');

  const materiaisFiltrados = useMemo(() => {
    let lista = [...materiais];

    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      lista = lista.filter((m) =>
        m.nome?.toLowerCase().includes(termo) ||
        m.descricao?.toLowerCase().includes(termo) ||
        m.tipo?.toLowerCase().includes(termo)
      );
    }

    switch (ordenacao) {
      case 'az':
        lista.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'za':
        lista.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'tipo':
        lista.sort((a, b) => a.tipo.localeCompare(b.tipo));
        break;
      case 'recentes':
      default:
        lista.sort((a, b) => new Date(b.data_create) - new Date(a.data_create));
        break;
    }

    return lista;
  }, [materiais, busca, ordenacao]);

  if (loading) {
    return (
      <AlunoLayout> {/* ADICIONADO ALUNOLAYOUT */}
        <div className="ce-page">
          <div className="ce-breadcrumb">
            <span>Disciplina</span>
            <span className="ce-breadcrumb-sep">{'>'}</span>
            <span className="ce-breadcrumb-current">Carregando...</span>
          </div>
          <div className="ce-skeleton-title" />
          <div className="ce-skeleton-desc" />
          <div className="ce-skeleton-desc ce-skeleton-desc--short" />

          <section className="ce-section" style={{ marginTop: 32 }}>
            <h2 className="ce-section-title">Materiais</h2>
            <div className="ce-materiais-grid">
              {[1, 2].map((i) => <MaterialCardSkeleton key={i} />)}
            </div>
          </section>
        </div>
      </AlunoLayout>
    );
  }

  if (erro) {
    return (
      <AlunoLayout> {/* ADICIONADO ALUNOLAYOUT */}
        <div className="ce-page">
          <div className="ce-breadcrumb">
            <Link to="/aluno/conteudos">Conteúdos</Link>
          </div>
          <div className="ce-error" role="alert">
            <span className="ce-error-icon">⚠</span>
            <span className="ce-error-msg">{erro}</span>
            <button className="ce-btn-retry" onClick={refetch}>
              Tentar novamente
            </button>
          </div>
        </div>
      </AlunoLayout>
    );
  }

  return (
    <AlunoLayout> {/* ADICIONADO ALUNOLAYOUT NO CASO DE SUCESSO */}
      <div className="ce-page">
        {/* Breadcrumb: Disciplina > Conteúdo */}
        <nav className="ce-breadcrumb" aria-label="Navegação">
            <Link to="/aluno/conteudos">{disciplina?.nome ?? 'Disciplina'}</Link>
            <span className="ce-breadcrumb-sep">{'>'}</span>
            <span className="ce-breadcrumb-current">{conteudo?.nome}</span>
          </nav>

          {/* Header */}
          <div className="ce-header">
            <div className="ce-header-main">
              <h1 className="ce-title">{conteudo?.nome}</h1>

              {conteudo?.descricao && (
                <p className="ce-descricao-curta">{conteudo.descricao}</p>
              )}

              <p className="ce-professores">
                <strong>Professor(es):</strong>{' '}
                {professores.length > 0
                  ? professores.map((p) => p.nome).join(', ')
                  : '—'}
              </p>
            </div>

            {podeDesinscrever && (
              <button
                className="ce-btn-desinscrever"
                onClick={handleDesinscrever}
                disabled={desinscrevendo}
              >
                {desinscrevendo ? 'Desinscrevendo...' : 'Desinscrever-se'}
              </button>
            )}
          </div>

          {erroDesinscricao && (
            <div className="ce-error" role="alert">
              <span className="ce-error-icon">⚠</span>
              <span className="ce-error-msg">{erroDesinscricao}</span>
            </div>
          )}

          {/* Ementa */}
          <section className="ce-section">
            <h2 className="ce-ementa-label">Ementa:</h2>
            <div className="ce-ementa">
              {conteudo?.descricao || 'Sem ementa cadastrada para este conteúdo.'}
            </div>
          </section>

          {/* Materiais */}
          <section className="ce-section">
            <h2 className="ce-section-title">Materiais</h2>

            {materiais.length > 0 && (
              <div className="ce-materiais-toolbar">
                <div className="ce-search">
                  <span className="ce-search-icon" aria-hidden="true">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar materiais..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    aria-label="Buscar materiais"
                  />
                </div>
                <div className="ce-ordenar">
                  <span className="ce-ordenar-icon" aria-hidden="true">▽</span>
                  <select
                    className="ce-select"
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                    aria-label="Ordenar materiais"
                  >
                    <option value="recentes">Ordenar por: Mais recentes</option>
                    <option value="az">Ordenar por: Nome (A-Z)</option>
                    <option value="za">Ordenar por: Nome (Z-A)</option>
                    <option value="tipo">Ordenar por: Tipo</option>
                  </select>
                </div>
              </div>
            )}

            {materiais.length === 0 ? (
              <div className="ce-materiais-empty">
                <span className="ce-materiais-empty-icon" aria-hidden="true">📭</span>
                <p className="ce-materiais-empty-text">
                  Nenhum material disponível para este conteúdo ainda.
                </p>
              </div>
            ) : materiaisFiltrados.length === 0 ? (
              <div className="ce-materiais-empty">
                <span className="ce-materiais-empty-icon" aria-hidden="true">🔍</span>
                <p className="ce-materiais-empty-text">
                  Nenhum material encontrado para "{busca}".
                </p>
              </div>
            ) : (
              <div className="ce-materiais-grid">
                {materiaisFiltrados.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    disciplinaNome={disciplina?.nome}
                    professores={professores}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Fórum */}
          <section className="ce-forum-section">
            <h2 className="ce-forum-titulo">Precisa de ajuda?</h2>
            <p className="ce-forum-desc">
              Caso tenha dúvidas sobre o conteúdo, poste suas perguntas no fórum do material
            </p>
            <Link className="ce-btn-forum" to={`/aluno/conteudos/${id}/forum`}>
              ir para o fórum
            </Link>
          </section>
      </div>
    </AlunoLayout>
  );
}