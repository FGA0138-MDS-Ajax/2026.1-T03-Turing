import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarMateriais } from "../../../services/materialService";
import "./MeusMateriais.css";

const TIPO_ICONE = {
  pdf: { label: "PDF", cor: "tipo-pdf" },
  video: { label: "Vídeo", cor: "tipo-video" },
  documento: { label: "Doc", cor: "tipo-doc" },
  link: { label: "Link", cor: "tipo-link" },
};

function CardMaterial({ material, onAbrir }) {
  const tipo = TIPO_ICONE[material.tipo?.toLowerCase()] || {
    label: material.tipo || "Arquivo",
    cor: "tipo-doc",
  };

  return (
    <div className="card-material">
      <div className="card-material__icone-wrapper">
        <span className={`card-material__tipo ${tipo.cor}`}>
          {tipo.label}
        </span>
      </div>
      <div className="card-material__corpo">
        <h3 className="card-material__nome">{material.nome}</h3>
        {material.descricao && (
          <p className="card-material__descricao">{material.descricao}</p>
        )}
        <div className="card-material__meta">
          {material.disciplina && (
            <span className="card-material__tag">{material.disciplina}</span>
          )}
          {material.professor && (
            <span className="card-material__professor">
              Prof. {material.professor}
            </span>
          )}
          {material.dataPublicacao && (
            <span className="card-material__data">
              {new Date(material.dataPublicacao).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
      <div className="card-material__acoes">
        <button
          className="btn-download"
          title="Baixar material"
          onClick={(e) => {
            e.stopPropagation();
            if (material.arquivo) window.open(material.arquivo, "_blank");
          }}
          disabled={!material.arquivo}
          aria-label={`Baixar ${material.nome}`}
        >
          ↓
        </button>
        <button
          className="btn-abrir"
          onClick={() => onAbrir(material.id)}
          aria-label={`Abrir ${material.nome}`}
        >
          Abrir
        </button>
      </div>
    </div>
  );
}

export default function MeusMateriais() {
  const navigate = useNavigate();
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("");

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = async () => {
    try {
      setLoading(true);
      setErro("");
      const response = await listarMateriais();
      setMateriais(response.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      if (error.response?.status === 403) {
        setErro("Você não tem acesso aos materiais. Verifique sua matrícula.");
        return;
      }
      setErro("Não foi possível carregar os materiais. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const abrirMaterial = (materialId) => {
    navigate(`/aluno/materiais/${materialId}`);
  };

  const disciplinas = [...new Set(materiais.map((m) => m.disciplina).filter(Boolean))];

  const materiaisFiltrados = materiais.filter((m) => {
    const termoBusca = busca.toLowerCase();
    const coincideBusca =
      !busca ||
      m.nome?.toLowerCase().includes(termoBusca) ||
      m.descricao?.toLowerCase().includes(termoBusca) ||
      m.disciplina?.toLowerCase().includes(termoBusca);
    const coincideDisciplina =
      !filtroDisciplina || m.disciplina === filtroDisciplina;
    return coincideBusca && coincideDisciplina;
  });

  return (
    <div className="meus-materiais">
      <div className="meus-materiais__cabecalho">
        <h1 className="meus-materiais__titulo">Meus materiais</h1>
        <p className="meus-materiais__subtitulo">
          Acesse materiais de estudo, vídeo-aulas e documentos compartilhados.
        </p>
      </div>

      <div className="meus-materiais__filtros">
        <div className="filtro-busca">
          <span className="filtro-busca__icone" aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="Buscar materiais..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="filtro-busca__input"
            aria-label="Buscar materiais"
          />
        </div>

        <select
          className="filtro-select"
          value={filtroDisciplina}
          onChange={(e) => setFiltroDisciplina(e.target.value)}
          aria-label="Filtrar por disciplina"
        >
          <option value="">Filtrar por disciplina</option>
          {disciplinas.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="meus-materiais__estado">
          <div className="loading-skeleton">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="loading-skeleton__card" />
            ))}
          </div>
        </div>
      )}

      {!loading && erro && (
        <div className="meus-materiais__estado">
          <div className="estado-erro">
            <span className="estado-erro__icone" aria-hidden="true">⚠️</span>
            <p className="estado-erro__mensagem">{erro}</p>
            <button className="btn-tentar-novamente" onClick={carregarMateriais}>
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {!loading && !erro && materiais.length === 0 && (
        <div className="meus-materiais__estado">
          <div className="estado-vazio">
            <span className="estado-vazio__icone" aria-hidden="true">📂</span>
            <p className="estado-vazio__titulo">Nenhum material disponível</p>
            <p className="estado-vazio__descricao">
              Os materiais aparecerão aqui assim que você for matriculado em um conteúdo.
            </p>
          </div>
        </div>
      )}

      {!loading && !erro && materiais.length > 0 && materiaisFiltrados.length === 0 && (
        <div className="meus-materiais__estado">
          <div className="estado-vazio">
            <span className="estado-vazio__icone" aria-hidden="true">🔍</span>
            <p className="estado-vazio__titulo">Nenhum resultado encontrado</p>
            <p className="estado-vazio__descricao">
              Tente buscar com outros termos ou remova os filtros.
            </p>
          </div>
        </div>
      )}

      {!loading && !erro && materiaisFiltrados.length > 0 && (
        <div className="meus-materiais__grid">
          {materiaisFiltrados.map((material) => (
            <CardMaterial
              key={material.id}
              material={material}
              onAbrir={abrirMaterial}
            />
          ))}
        </div>
      )}
    </div>
  );
}