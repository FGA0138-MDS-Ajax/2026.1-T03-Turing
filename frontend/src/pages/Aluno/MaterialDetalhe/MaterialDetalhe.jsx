import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buscarMaterial } from "../../../services/materialService";
import { buscarConteudo, buscarDisciplina } from "../../../services/conteudoService";
import "./MaterialDetalhe.css";

export default function MaterialDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [conteudo, setConteudo] = useState(null);
  const [disciplina, setDisciplina] = useState(null);
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
      const conteudoRes = await buscarConteudo(response.data.conteudo);
      setConteudo(conteudoRes.data);
      if (conteudoRes.data.disciplina) {
        const disciplinaRes = await buscarDisciplina(conteudoRes.data.disciplina);
        setDisciplina(disciplinaRes.data);
      }
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
        <span
         className="md-breadcrumb__crumb md-breadcrumb__crumb--link"
          onClick={() => navigate('/aluno/conteudos')}
          style={{ cursor: 'pointer' }}
        >
          {disciplina?.nome || 'Disciplina'}
        </span>
        <span className="md-breadcrumb__sep" aria-hidden="true">›</span>
        <span
          className="md-breadcrumb__crumb md-breadcrumb__crumb--link"
          onClick={() => navigate(`/aluno/conteudos/${material.conteudo}`)}
          style={{ cursor: 'pointer' }}
        >
       {conteudo?.nome || 'Conteúdo'}
        </span>
        <span className="md-breadcrumb__sep" aria-hidden="true">›</span>
        <span className="md-breadcrumb__crumb md-breadcrumb__crumb--atual">{material.nome}</span>
      </nav>

      <div className="md-layout">

        <main className="md-main">
          <h1 className="md-titulo">{material.nome}</h1>
          {material.descricao && <p className="md-subtitulo">{material.descricao}</p>}

          <div className="md-corpo">
            {material.tipo === 'pdf' && material.arquivo ? (
              <div className="md-corpo__pdf-aviso">
                <p style={{ fontSize: '0.9rem', margin: 150.2, textAlign: 'center' }}>Visualização embutida não disponível. <br></br>Use o botão "↓ Download do arquivo" ao lado.</p>
                
                
              </div>
            ) : (material.tipo === 'link' || material.tipo === 'video') && material.link ? (
              <div className="md-corpo__placeholder">
                <span className="md-corpo__placeholder-label">
                  {material.tipo === 'video'
                    ? 'Este material é um vídeo externo. Use o botão "Abrir link" ao lado.'
                    : 'Este material é um link externo. Use o botão "Abrir link" ao lado.'
                  }
                </span>
              </div>
            ) : (
              <div className="md-corpo__placeholder">
                <span className="md-corpo__placeholder-label">
                  {material.descricao || 'Sem conteúdo adicional para exibir.'}
                </span>
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
                  {material.data_create
                    ? new Date(material.data_create).toLocaleDateString("pt-BR", {
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
              {material.link && !material.arquivo && (
                <a className="md-btn-arquivo" href={material.link} target="_blank" rel="noreferrer">
                  Abrir link ↗
                </a>
              )}
              {material.arquivo && (
                <a
                  className="md-btn-arquivo"
                  href={material.arquivo}
                  target="_blank"
                  rel="noreferrer"
                  download
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
            <button className="md-btn-ir" onClick={() => navigate(`/aluno/conteudos/${material.conteudo}/forum`)}>
              Ir para o forúm
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