import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useForum } from "../../../hooks/useForum";
import { ProfessorLayout } from "../../../components/professor/ProfessorLayout";
import { markdownParaHtml } from "../../../utils/markdown";
import "./ForumProfessor.css";

// --- Identificação visual de autor [Ce7/RF21] ---
function BadgePerfil({ tipo }) {
  if (!tipo) return null;
  const isProfessor = tipo === 'professor';
  const style = isProfessor
    ?{
        background:'var(--forum-prof-bg)',
        color:'var(--forum-prof-text)',
        border:'1px solid var(--forum-prof-text)'
    }
    :{
        background:'var(--forum-aluno-bg)',
        color:'var(--forum-aluno-text)',
        border:'1px solid var(--forum-aluno-text)'
    };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '10.5px',
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      letterSpacing: '0.02em',
      ...style,
    }}>
{isProfessor ? 'Professor' : 'Aluno'}
    </span>
  );
}

function ForumAvatar({ nome, tipo }) {
  const isProfessor = tipo === 'professor';
  const bg = isProfessor ? '#2F5D62' : '#C07A30';
  const ring = isProfessor ? '#B8D8DB' : '#FBBF6A';
  const skinColor = isProfessor ? '#C4E0E2' : '#FFD7A0';
  const bodyColor = isProfessor ? '#1E4F54' : '#92400E';

  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: bg, boxShadow: `0 0 0 2px ${ring}`,
      overflow: 'hidden', flexShrink: 0,
    }}>
      <svg viewBox="0 0 36 36" width="36" height="36">
        <ellipse cx="18" cy="30" rx="12" ry="9" fill={bodyColor} />
        <circle cx="18" cy="19" r="8" fill={skinColor} />
        {isProfessor && (
          <>
            <polygon points="18,8 6,13 18,17 30,13" fill="#E0EDEE" />
            <rect x="6" y="12" width="24" height="3" rx="0.5" fill="#E0EDEE" />
            <circle cx="18" cy="8" r="2" fill="#B8D8DB" />
            <path d="M28 12 Q32 17 30 23" fill="none" stroke="#B8D8DB" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="30" cy="24" r="1.5" fill="#B8D8DB" />
          </>
        )}
      </svg>
    </div>
  );
}

export default function ForumProfessor() {
  const { user } = useAuth();
  const { id: conteudoId } = useParams();
  const navigate = useNavigate();
  const [resposta, setResposta] = useState("");
  const [prevVisualizando, setPrevVisualizando] = useState(false);
  const [mostrandoDetalhe, setMostrandoDetalhe] = useState(false);
  const textareaRef = useRef(null);

  const inserirMarkdown = (antes, depois = antes) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;
    const selecionado = resposta.slice(inicio, fim);

    const novoTexto =
      resposta.slice(0, inicio) + antes + selecionado + depois + resposta.slice(fim);

    setResposta(novoTexto);

    // Devolve o foco e posiciona o cursor após o texto inserido
    requestAnimationFrame(() => {
      textarea.focus();
      const novaPosicao = inicio + antes.length + selecionado.length + depois.length;
      textarea.setSelectionRange(novaPosicao, novaPosicao);
    });
  };

  const inserirListaMarcadores = () => inserirMarkdown('\n- ', '');
  const inserirListaNumerada = () => inserirMarkdown('\n1. ', '');
  const inserirLink = () => inserirMarkdown('[', '](url)');

  const {
    loading,
    erro,
    conteudo,
    disciplina,
    perguntas,
    perguntaSelecionada,
    selecionarPergunta,
    filtroStatus,
    setFiltroStatus,
    busca,
    setBusca,
    enviando,
    erroEnvio,
    sucessoEnvio,
    handleResponder,
  } = useForum(conteudoId);

  if (user?.tipo !== "professor") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column" }}>
        <h1 style={{ fontSize: "4rem", color: "#212121" }}>403</h1>
        <p>Você não possui permissão para acessar esta página.</p>
      </div>
    );
  }

  const enviar = async () => {
    await handleResponder(resposta);
    setResposta("");
    setPrevVisualizando(false);
  };

  const cancelar = () => {
    setResposta("");
    setPrevVisualizando(false);
  };

  return (
    <ProfessorLayout>
      <div className="forum-page">
      <p className="forum-breadcrumb">
        {disciplina?.nome ?? 'Disciplina'} <span>&gt;</span> {conteudo?.nome ?? 'Conteúdo'} <span>&gt;</span> forum
      </p>

      <a className="forum-back-link" onClick={() => navigate(-1)}>
        ← Voltar ao conteúdo
      </a>

      <div className="forum-header">
        <h1>{conteudo?.nome ?? 'Carregando...'}</h1>
        <p>Fórum de dúvidas sobre esse conteúdo com professor e colegas</p>
      </div>

      {erro && <div className="forum-error">{erro}</div>}

      <div className="forum-container">
        {/* Painel esquerdo */}
        <div className={`forum-left-panel ${mostrandoDetalhe ? "forum-painel-oculto-mobile" : ""}`}>
          <div className="forum-search-bar">
            <input
              className="forum-search-input"
              type="text"
              placeholder="Buscar perguntas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <select
              className="forum-filter-btn"
              value={filtroStatus ?? ""}
              onChange={(e) => setFiltroStatus(e.target.value || null)}
            >
              <option value="">Todos os status</option>
              <option value="respondida">Respondida</option>
              <option value="aguardando">Aguardando resposta</option>
            </select>
          </div>

          {loading && <div className="forum-loading">Carregando perguntas...</div>}

          {!loading && perguntas.length === 0 && (
            <div className="forum-empty">Nenhuma pergunta encontrada.</div>
          )}

          <div className="forum-questions-list">
            {perguntas.map((pergunta) => (
              <div
                key={pergunta.id}
                className={`forum-question-card ${perguntaSelecionada?.id === pergunta.id ? "selected" : ""}`}
                onClick={() => { selecionarPergunta(pergunta.id); setMostrandoDetalhe(true); }}
              >
                <ForumAvatar nome={pergunta.autor_nome} tipo={pergunta.autor_tipo} />

                <div className="forum-card-body" style={{ minWidth: 0 }}>
                  <div className="forum-card-top" style={{ overflow: 'hidden' }}>
                    <span className="forum-card-title">{pergunta.texto}</span>
                    <span className={`forum-badge ${pergunta.status}`}>
                      {pergunta.status === "respondida" ? "Respondida" : "Aguardando resposta"}
                    </span>
                  </div>
                  <p className="forum-card-meta" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {pergunta.autor_nome}
                    <BadgePerfil tipo={pergunta.autor_tipo} />
                    · {new Date(pergunta.data_create).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className="forum-card-arrow">›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Painel direito */}
        <div className={`forum-right-panel ${mostrandoDetalhe ? "forum-painel-visivel-mobile" : ""}`}>
          <button
            className="forum-voltar-mobile"
            onClick={() => setMostrandoDetalhe(false)}
          >
            ← Voltar às perguntas
          </button>

          {!perguntaSelecionada && (
            <div className="forum-empty">Selecione uma pergunta para visualizar o detalhe.</div>
          )}

          {perguntaSelecionada && (
            <>
              {sucessoEnvio && <div className="forum-success">Resposta enviada com sucesso!</div>}

              <div className="forum-detail-card">
                <div className="forum-detail-header">
                  <ForumAvatar nome={perguntaSelecionada.autor_nome} tipo={perguntaSelecionada.autor_tipo} />

                  <div>
                    <div className="forum-detail-name" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {perguntaSelecionada.autor_nome}
                      <BadgePerfil tipo={perguntaSelecionada.autor_tipo} />
                    </div>
                    <div className="forum-detail-date">
                      {new Date(perguntaSelecionada.data_create).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <span className={`forum-badge ${perguntaSelecionada.status} forum-detail-badge`}>
                    {perguntaSelecionada.status === "respondida" ? "Respondida" : "Aguardando resposta"}
                  </span>
                  <button className="forum-flag-icon" type="button" title="Marcar">⚑</button>
                </div>
                <p className="forum-detail-desc" style={{ fontWeight: 600, marginTop: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {perguntaSelecionada.texto}
                </p>

                <div className="forum-participants">
                  <span className="forum-participant-bubble" title={perguntaSelecionada.autor_nome}>
                    {perguntaSelecionada.autor_nome?.[0]?.toUpperCase() ?? "?"}
                  </span>
                  {perguntaSelecionada.resposta && (
                    <span className="forum-participant-bubble" title={perguntaSelecionada.resposta.autor_nome}>
                      {perguntaSelecionada.resposta.autor_nome?.[0]?.toUpperCase() ?? "P"}
                    </span>
                  )}
                </div>
              </div>

              {/* Pergunta já respondida: mostra a conversa, igual a visão do aluno. Sem formulário. */}
              {perguntaSelecionada.resposta && (
                <div className="forum-detail-card">
                  <div className="forum-detail-header">
                    <ForumAvatar nome={perguntaSelecionada.resposta.autor_nome} tipo={perguntaSelecionada.resposta.autor_tipo ?? 'professor'} />

                    <div>
                      <div className="forum-detail-name" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {perguntaSelecionada.resposta.autor_nome}
                        <BadgePerfil tipo={perguntaSelecionada.resposta.autor_tipo ?? 'professor'} />
                      </div>
                      <div className="forum-detail-date">
                        {new Date(perguntaSelecionada.resposta.data_create).toLocaleString("pt-BR")}
                      </div>
                    </div>
                  </div>
                  <div className="forum-detail-title">Resposta</div>
                  <p
                    className="forum-detail-desc"
                    dangerouslySetInnerHTML={{ __html: markdownParaHtml(perguntaSelecionada.resposta.texto) }}
                  />
                </div>
              )}

              {/* Pergunta aguardando: mostra o formulário de resposta */}
              {!perguntaSelecionada.resposta && (
                <div className="forum-response-box">
                  <div className="forum-response-label">Sua resposta</div>

                  <div className="forum-toolbar">
                    <button type="button" className="forum-toolbar-btn" title="Negrito" onClick={() => inserirMarkdown('**')}><b>B</b></button>
                    <button type="button" className="forum-toolbar-btn" title="Itálico" onClick={() => inserirMarkdown('*')}><i>I</i></button>
                    <button type="button" className="forum-toolbar-btn" title="Sublinhado" onClick={() => inserirMarkdown('__')}><u>U</u></button>
                    <button type="button" className="forum-toolbar-btn" title="Lista" onClick={inserirListaMarcadores}>• Lista</button>
                    <button type="button" className="forum-toolbar-btn" title="Lista numerada" onClick={inserirListaNumerada}>1. Lista</button>
                    <button type="button" className="forum-toolbar-btn" title="Link" onClick={inserirLink}>🔗</button>
                    <button
                      type="button"
                      className="forum-preview-btn"
                      onClick={() => setPrevVisualizando((v) => !v)}
                    >
                      {prevVisualizando ? "Editar" : "Pré-visualizar"}
                    </button>
                  </div>

                  {prevVisualizando ? (
                    <div
                      className="forum-response-textarea forum-response-preview"
                      dangerouslySetInnerHTML={{
                        __html: resposta.trim()
                          ? markdownParaHtml(resposta)
                          : '<span style="color:#bbb">Nada para pré-visualizar ainda...</span>',
                      }}
                    />
                  ) : (
                    <textarea
                      ref={textareaRef}
                      className="forum-response-textarea"
                      placeholder="Escreva sua resposta para o estudante..."
                      value={resposta}
                      onChange={(e) => setResposta(e.target.value)}
                      rows={7}
                    />
                  )}

                  {erroEnvio && <div className="forum-error">{erroEnvio}</div>}

                  <div className="forum-response-actions">
                    <button className="forum-btn-cancel" onClick={cancelar} disabled={enviando}>
                      Cancelar
                    </button>
                    <button
                      className="forum-btn-enviar"
                      onClick={enviar}
                      disabled={!resposta.trim() || enviando}
                    >
                      {enviando ? "Enviando..." : "Enviar"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </ProfessorLayout>
  );
}