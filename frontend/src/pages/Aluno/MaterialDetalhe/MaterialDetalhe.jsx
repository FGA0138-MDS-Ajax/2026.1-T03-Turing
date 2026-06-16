import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buscarMaterial } from "../../../services/materialService";
import "./MaterialDetalhe.css";

export default function MaterialDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarMaterial();
  }, [id]);

  const carregarMaterial = async () => {
    try {
      setLoading(true);
      const response = await buscarMaterial(id);
      setMaterial(response.data);
      setErro("");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      if (error.response?.status === 403) {
        setErro("Você não possui acesso a este material.");
        return;
      }
      if (error.response?.status === 404) {
        setErro("Material não encontrado.");
        return;
      }
      setErro("Erro ao carregar material.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="md-page">
        <div className="md-loading">
          <div className="md-loading__bar md-loading__bar--title" />
          <div className="md-loading__bar md-loading__bar--sub" />
          <div className="md-loading__bar md-loading__bar--body" />
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="md-page">
        <div className="md-erro">
          <span className="md-erro__icone" aria-hidden="true">⚠️</span>
          <p className="md-erro__msg">{erro}</p>
          <button className="md-btn-voltar" onClick={() => navigate(-1)}>
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md-page">

      <nav className="md-breadcrumb" aria-label="Navegação">
        <span className="md-breadcrumb__crumb">Disciplina</span>
        <span className="md-breadcrumb__sep" aria-hidden="true">›</span>
        <span className="md-breadcrumb__crumb">Conteúdo</span>
        <span className="md-breadcrumb__sep" aria-hidden="true">›</span>
        <span className="md-breadcrumb__crumb md-breadcrumb__crumb--atual">material</span>
      </nav>

      <div className="md-layout">

        <main className="md-main">
          <h1 className="md-titulo">{material.nome}</h1>
          <p className="md-subtitulo">Breve descrição do material</p>

          <div className="md-corpo">
            {material.conteudoHtml ? (
              <div
                className="md-corpo__html"
                dangerouslySetInnerHTML={{ __html: material.conteudoHtml }}
              />
            ) : (
              <div className="md-corpo__placeholder">
                <span className="md-corpo__placeholder-label">Conteúdo escrito</span>
              </div>
            )}
          </div>
        </main>

        <aside className="md-sidebar">

          <div className="md-sidebar__card">
            <h2 className="md-sidebar__titulo">Sobre o material</h2>
            <dl className="md-meta">
              <div className="md-meta__row">
                <dt className="md-meta__label">TIPO</dt>
                <dd className="md-meta__valor">{material.tipo ?? "—"}</dd>
              </div>
              <div className="md-meta__row">
                <dt className="md-meta__label">Publicado em</dt>
                <dd className="md-meta__valor">
                  {material.dataPublicacao
                    ? new Date(material.dataPublicacao).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>
            <button className="md-btn-marcar">Marcar como visto</button>
          </div>

          {(material.link || material.arquivo) && (
            <div className="md-sidebar__card md-sidebar__card--acoes">
              {material.link && (
                <a
                  className="md-btn-arquivo"
                  href={material.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir link ↗
                </a>
              )}
              {material.arquivo && (
                <a
                  className="md-btn-arquivo md-btn-arquivo--secundario"
                  href={material.arquivo}
                  target="_blank"
                  rel="noreferrer"
                >
                  ↓ Download do arquivo
                </a>
              )}
            </div>
          )}

          <div className="md-sidebar__card md-sidebar__card--duvida">
            <p className="md-sidebar__duvida-label">Precisa de ajuda?</p>
            <p className="md-sidebar__duvida-texto">
              Caso tenha dúvidas sobre este material, poste suas perguntas para o professor.
            </p>
            <button className="md-btn-ir" onClick={() => navigate("/aluno/conteudos")}>
              Ir para conteúdos
            </button>
          </div>

        </aside>
      </div>

      <button className="md-btn-voltar md-btn-voltar--footer" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

    </div>
  );
}