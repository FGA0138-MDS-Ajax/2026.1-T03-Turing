import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import {
  listarConteudos,
  listarDisciplinas,
  listarMateriais,
} from "../../../services/disciplinasService";
import "./ProfessorConteudo.css";
import {
  BookOpen,
  CalendarDays,
  FolderOpen,
  Filter
} from "lucide-react";

export default function ProfessorConteudo() {
  const { user } = useAuth();
  const [conteudos, setConteudos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [materiais, setMateriais] = useState([]);

  const [filtroDisciplina, setFiltroDisciplina] =
    useState("");

  if (user?.tipo !== "professor") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            color: "#212121",
          }}
        >
          403
        </h1>

        <p>
          Você não possui permissão para acessar esta
          página.
        </p>
      </div>
    );
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const [conteudosResponse, disciplinasResponse, materiaisResponse] 
      = await Promise.all([
      listarConteudos(),
      listarDisciplinas(),
      listarMateriais()
    ]);

      setConteudos(conteudosResponse.data);
      setDisciplinas(disciplinasResponse.data);
      setMateriais(materiaisResponse.data);

    } catch (err) {
      console.log(err);

      setError(
        "Não foi possível carregar os conteúdos."
      );
    } finally {
      setLoading(false);
    }
  };

  const criarMatricula = async (conteudoId) => {
    try {
      const alunoId = 1; // temporário até existir modal

      await api.post("/api/matriculas/", {
        aluno: alunoId,
        conteudo: conteudoId,
      });

      alert("Matrícula criada com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar matrícula.");
    }
  };


  const conteudosFiltrados =
    filtroDisciplina === ""
      ? conteudos
      : conteudos.filter(
          (conteudo) =>
            conteudo.disciplina ===
            Number(filtroDisciplina)
        );

  if (loading) {
    return (
      <div className="professor-conteudo-container">
        <h2>Carregando conteúdos...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="professor-conteudo-container">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="professor-conteudo-container">
      <div className="conteudo-page-header">
        <h1>Meus Conteúdos</h1>

        <p>
          Visualize os conteúdos vinculados a você.
        </p>
      </div>

      <div className="conteudo-filters">

        <div className="filter-wrapper">
          <Filter size={18} />

          <select
            value={filtroDisciplina}
            onChange={(e) =>
              setFiltroDisciplina(e.target.value)
            }
          >
            <option value="">
              Todas as disciplinas
            </option>

            {disciplinas.map((disciplina) => (
              <option
                key={disciplina.id}
                value={disciplina.id}
              >
                {disciplina.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="matricula-section">
        <button
          className="btn-matricula"
          onClick={() => criarMatricula()}
        >
          + Criar matrícula
        </button>
      </div>
      
      <div className="conteudos-grid">
          {conteudosFiltrados.map((conteudo) => {
            const disciplina = disciplinas.find(
              (d) => d.id === conteudo.disciplina
            );

            const quantidadeMateriais = materiais.filter(
              (material) =>
                Number(material.conteudo) === Number(conteudo.id)
            ).length;

            return (
              <article
                className="conteudo-card"
                key={conteudo.id}
              >
                <div className="conteudo-body">
                  <h2>{conteudo.nome}</h2>

                  <p className="conteudo-descricao">
                    {conteudo.descricao || "Sem descrição"}
                  </p>

                  <div className="conteudo-info">

                    <div className="info-row">
                      <div className="info-icon">
                        <BookOpen size={16} />
                      </div>

                      <p>
                        <strong>Disciplina:</strong>{" "}
                        {disciplina?.nome || "Não encontrada"}
                      </p>
                    </div>

                    <div className="info-row">
                      <div className="info-icon">
                        <CalendarDays size={16} />
                      </div>

                      <p>
                        <strong>Data de criação:</strong>{" "}
                        {new Date(
                          conteudo.data_create
                        ).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div className="info-row">
                      <div className="info-icon">
                        <FolderOpen size={16} />
                      </div>

                      <p>
                        <strong>Quantidade de materiais:</strong>{" "}
                        {quantidadeMateriais}
                      </p>
                    </div>
                    </div>
                  </div>

                <div className="conteudo-footer">
                  <button className="btn-material">
                    + Adicionar material
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
  );
}