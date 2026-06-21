import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useForum } from "../../../hooks/useForum";
import { ProfessorLayout } from "../../../components/professor/ProfessorLayout";
import { markdownParaHtml } from "../../../utils/markdown";
import "./ForumProfessor.css";

export default function ForumProfessor() {
  const { user } = useAuth();
  const { id: conteudoId } = useParams();
  const navigate = useNavigate();
  const [resposta, setResposta] = useState("");
  const [prevVisualizando, setPrevVisualizando] = useState(false);
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
          <div className="forum-left-panel">
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
                  onClick={() => selecionarPergunta(pergunta.id)}
                >
                  <span className="forum-avatar">
                    {pergunta.autor_nome?.[0]?.toUpperCase() ?? "?"}
                  </span>
                  <div className="forum-card-body">
                    <div className="forum-card-top">
                      <span className="forum-card-title">{pergunta.texto}</span>
                      <span className={`forum-badge ${pergunta.status}`}>
                        {pergunta.status === "respondida" ? "Respondida" : "Aguardando resposta"}
                      </span>
                    </div>
                    <p className="forum-card-meta">
                      {pergunta.autor_nome} · {new Date(pergunta.data_create).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className="forum-card-arrow">›</span>
                </div>
              ))}
            </div>
          </div>

          {/* Painel direito */}
          <div className="forum-right-panel">
            {!perguntaSelecionada && (
              <div className="forum-empty">Selecione uma pergunta para visualizar o detalhe.</div>
            )}

            {perguntaSelecionada && (
              <>
              {sucessoEnvio && <div className="forum-success">Resposta enviada com sucesso!</div>}
                <div className="forum-detail-card">
                  <button className="forum-flag-icon" type="button" title="Marcar">⚑</button>
                  <div className="forum-detail-header">
                    <span className="forum-avatar">
                      {perguntaSelecionada.autor_nome?.[0]?.toUpperCase() ?? "?"}
                    </span>
                    <div>
                      <div className="forum-detail-name">{perguntaSelecionada.autor_nome}</div>
                      <div className="forum-detail-date">
                        {new Date(perguntaSelecionada.data_create).toLocaleString("pt-BR")}
                      </div>
                    </div>
                    <span className={`forum-badge ${perguntaSelecionada.status} forum-detail-badge`}>
                      {perguntaSelecionada.status === "respondida" ? "Respondida" : "Aguardando resposta"}
                    </span>
                  </div>
                  <div className="forum-detail-title">Pergunta</div>
                  <p className="forum-detail-desc">{perguntaSelecionada.texto}</p>

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
                      <span className="forum-avatar">
                        {perguntaSelecionada.resposta.autor_nome?.[0]?.toUpperCase() ?? "P"}
                      </span>
                      <div>
                        <div className="forum-detail-name">{perguntaSelecionada.resposta.autor_nome}</div>
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
                      <button type="button" className="forum-toolbar-btn" title="Bloco de código" onClick={() => inserirMarkdown('\n```\n', '\n```\n')}>{"</>"}</button>
                      <button type="button" className="forum-toolbar-btn" title="Código inline" onClick={() => inserirMarkdown('`')}>`code`</button>
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
                        rows={4}
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