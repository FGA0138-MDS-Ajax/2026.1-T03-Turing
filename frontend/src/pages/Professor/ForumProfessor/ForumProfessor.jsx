import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useForum } from "../../../hooks/useForum";
import "./ForumProfessor.css";

export default function ForumProfessor() {
  const { user } = useAuth();
  const { id: conteudoId } = useParams();
  const navigate = useNavigate();
  const [resposta, setResposta] = useState("");

  const {
    loading,
    erro,
    perguntas,
    perguntaSelecionada,
    selecionarPergunta,
    filtroStatus,
    setFiltroStatus,
    busca,
    setBusca,
    enviando,
    erroEnvio,
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
  };

  const cancelar = () => setResposta("");

  return (
    <div className="forum-professor-container">
      <button className="forum-voltar" onClick={() => navigate(-1)}>
        ← Voltar ao conteúdo
      </button>

      <h1 className="forum-titulo">Fórum</h1>
      <p className="forum-subtitulo">Dúvidas dos alunos sobre este conteúdo</p>

      {erro && <p className="forum-erro">{erro}</p>}

      <div className="forum-painel-wrapper">
        {/* Painel esquerdo */}
        <div className="forum-lista-painel">
          <input
            className="forum-busca"
            type="text"
            placeholder="Buscar perguntas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <select
            className="forum-filtro-status"
            value={filtroStatus ?? ""}
            onChange={(e) => setFiltroStatus(e.target.value || null)}
          >
            <option value="">Todos os status</option>
            <option value="respondida">Respondida</option>
            <option value="aguardando">Aguardando resposta</option>
          </select>

          {loading && <p>Carregando perguntas...</p>}

          {!loading && perguntas.length === 0 && (
            <p className="forum-vazio">Nenhuma pergunta encontrada.</p>
          )}

          <div className="forum-lista-perguntas">
            {perguntas.map((pergunta) => (
              <div
                key={pergunta.id}
                className={`forum-card-pergunta ${perguntaSelecionada?.id === pergunta.id ? "selecionado" : ""}`}
                onClick={() => selecionarPergunta(pergunta.id)}
              >
                <div className="forum-card-header">
                  <span className="forum-avatar">{pergunta.autor_nome?.[0]?.toUpperCase() ?? "?"}</span>
                  <div className="forum-card-info">
                    <p className="forum-card-texto">{pergunta.texto}</p>
                    <span className="forum-card-meta">
                      {pergunta.autor_nome} · {new Date(pergunta.data_create).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <span className={`forum-badge forum-badge--${pergunta.status}`}>
                    {pergunta.status === "respondida" ? "Respondida" : "Aguardando resposta"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel direito */}
        <div className="forum-detalhe-painel">
          {!perguntaSelecionada && (
            <p className="forum-vazio">Selecione uma pergunta para visualizar o detalhe.</p>
          )}

          {perguntaSelecionada && (
            <>
              <div className="forum-detalhe-pergunta">
                <div className="forum-detalhe-header">
                  <span className="forum-avatar">{perguntaSelecionada.autor_nome?.[0]?.toUpperCase() ?? "?"}</span>
                  <div>
                    <strong>{perguntaSelecionada.autor_nome}</strong>
                    <p className="forum-card-meta">
                      {new Date(perguntaSelecionada.data_create).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <span className={`forum-badge forum-badge--${perguntaSelecionada.status}`}>
                    {perguntaSelecionada.status === "respondida" ? "Respondida" : "Aguardando resposta"}
                  </span>
                </div>
                <h3>Pergunta</h3>
                <p>{perguntaSelecionada.texto}</p>

                {perguntaSelecionada.resposta && (
                  <div className="forum-resposta-existente">
                    <strong>Sua resposta:</strong>
                    <p>{perguntaSelecionada.resposta.texto}</p>
                  </div>
                )}
              </div>

              <div className="forum-resposta-area">
                <label>Sua resposta</label>
                <textarea
                  placeholder="Escreva sua resposta para o estudante..."
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  rows={6}
                />

                {erroEnvio && <p className="forum-erro">{erroEnvio}</p>}

                <div className="forum-resposta-botoes">
                  <button className="btn-secundario" onClick={cancelar} disabled={enviando}>
                    Cancelar
                  </button>
                  <button
                    className="btn-primario"
                    onClick={enviar}
                    disabled={!resposta.trim() || enviando}
                  >
                    {enviando ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}