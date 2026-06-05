import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "./ProfessorConteudo.css";

export default function ProfessorConteudo() {
  const { user } = useAuth();
    console.log(user);

  const [search, setSearch] = useState("");
  const [disciplinaFiltro, setDisciplinaFiltro] = useState("");

  const [conteudos] = useState([
    {
      id: 1,
      nome: "Equações do 1º Grau",
      descricao:
        "Introdução às equações e resolução de problemas matemáticos.",
      disciplina: "Matemática",
      materiais: 5,
      data_create: "10/06/2025",
      status: "ativo",
    },
    {
      id: 2,
      nome: "Geometria Plana",
      descricao:
        "Estudo de áreas, perímetros e figuras geométricas.",
      disciplina: "Matemática",
      materiais: 8,
      data_create: "12/06/2025",
      status: "ativo",
    },
    {
      id: 3,
      nome: "Brasil Colônia",
      descricao:
        "Principais acontecimentos do período colonial brasileiro.",
      disciplina: "História",
      materiais: 3,
      data_create: "15/06/2025",
      status: "ativo",
    },
  ]);

  if (!user) return null;

  if (user.tipo !== "professor") {
    return (
      <div className="forbidden-page">
        <h1>403</h1>
        <p>Você não possui permissão para acessar esta página.</p>
      </div>
    );
  }

  const disciplinas = [
    ...new Set(conteudos.map((c) => c.disciplina)),
  ];

  const filteredConteudos = conteudos.filter((conteudo) => {
    const matchesSearch =
      conteudo.nome
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      conteudo.descricao
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesDisciplina =
      disciplinaFiltro === "" ||
      conteudo.disciplina === disciplinaFiltro;

    return matchesSearch && matchesDisciplina;
  });

  return (
    <div className="professor-content-page">
      <div className="content-header">
        <h1>Meus Conteúdos</h1>

        <p>
          Visualize os conteúdos vinculados ao seu perfil.
        </p>
      </div>

      <section className="content-section">
        <div className="section-header">
          <h2>Conteúdos Vinculados</h2>

          <div className="section-actions">
            <input
              type="text"
              placeholder="Buscar conteúdo..."
              className="search-input"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              className="filter-select"
              value={disciplinaFiltro}
              onChange={(e) =>
                setDisciplinaFiltro(e.target.value)
              }
            >
              <option value="">
                Todas as disciplinas
              </option>

              {disciplinas.map((disciplina) => (
                <option
                  key={disciplina}
                  value={disciplina}
                >
                  {disciplina}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="section-divider"></div>

        {filteredConteudos.length === 0 ? (
          <div className="empty-state">
            Nenhum conteúdo encontrado.
          </div>
        ) : (
          <div className="content-grid">
            {filteredConteudos.map((conteudo) => (
              <article
                key={conteudo.id}
                className="content-card"
              >
                <div className="content-card-header">
                  <h3>{conteudo.nome}</h3>

                  <span className="status-badge">
                    {conteudo.status}
                  </span>
                </div>

                <p className="content-description">
                  {conteudo.descricao}
                </p>

                <div className="content-info">
                  <span>
                    <strong>Disciplina:</strong>{" "}
                    {conteudo.disciplina}
                  </span>

                  <span>
                    <strong>Materiais:</strong>{" "}
                    {conteudo.materiais}
                  </span>

                  <span>
                    <strong>Criado em:</strong>{" "}
                    {conteudo.data_create}
                  </span>
                </div>

                <button className="btn-primary-content">
                  Nova matrícula
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}