import { useState } from "react";
import { BookOpen, User, Clock3, X, GraduationCap, Sigma,
  Atom,
  FlaskConical,
  Languages,
  Leaf,
  Globe,
  Landmark,
  Monitor,
  Dumbbell,
  Music,
  Palette, } from "lucide-react";
import "./InscreverConteudos.css";

export default function InscreverConteudos() {
  const [loading] = useState(false);
  const [erro] = useState("");
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("Todas");

  const [modalAberta, setModalAberta] = useState(false);
  const [conteudoSelecionado, setConteudoSelecionado] = useState(null);

  const conteudosMock = [
    {
      id: 1,
      nome: "Probabilidade e Estatística",
      professor: "Carlos Silva",
      disciplina: "Matemática",
      descricao:
        "Introdução aos conceitos fundamentais de estatística e probabilidade.",
      ementa:
        "Conjuntos, análise combinatória, distribuição de probabilidades, média, mediana, moda e desvio padrão.",
    },
    {
      id: 2,
      nome: "Eletromagnetismo",
      professor: "Roberto Lima",
      disciplina: "Física",
      descricao: "Fundamentos do eletromagnetismo.",
      ementa:
        "Campo elétrico, potencial elétrico, corrente, resistência e indução eletromagnética.",
    },
    {
      id: 3,
      nome: "Botânica",
      professor: "Luiz Fernando",
      disciplina: "Biologia",
      descricao: "Estudo das plantas.",
      ementa:
        "Estrutura vegetal, reprodução, classificação e fisiologia das plantas.",
    },
    {
      id: 5,
      nome: "Genética",
      professor: "Luiz Fernando",
      disciplina: "Geografia",
      descricao: "Estudos sobre a população mundial.",
      ementa:
        "Estudos sobre relevo e paíseses, clima, vegetação e população.",
    },
  ];

  const disciplinas = [
    "Todas",
    ...new Set(conteudosMock.map((c) => c.disciplina)),
  ];

  const conteudosFiltrados =
    disciplinaSelecionada === "Todas"
      ? conteudosMock
      : conteudosMock.filter(
          (c) => c.disciplina === disciplinaSelecionada
        );

  const abrirModal = (conteudo) => {
    setConteudoSelecionado(conteudo);
    setModalAberta(true);
  };

  const fecharModal = () => {
    setModalAberta(false);
    setConteudoSelecionado(null);
  };

  if (loading) {
    return (
      <div className="estado-container">
        <h2>Carregando conteúdos...</h2>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="estado-container">
        <h2>{erro}</h2>
      </div>
    );
  }

  const getIconeDisciplina = (disciplina) => {
  switch (disciplina?.toLowerCase()) {

    case "matemática":
    case "matematica":
      return <Sigma size={28} />;

    case "física":
    case "fisica":
      return <Atom size={28} />;

    case "química":
    case "quimica":
      return <FlaskConical size={28} />;

    case "biologia":
      return <Leaf size={28} />;

    case "geografia":
      return <Globe size={28} />;

    case "história":
    case "historia":
      return <Landmark size={28} />;

    case "português":
    case "portugues":
      return <Languages size={28} />;

    case "informática":
    case "informatica":
      return <Monitor size={28} />;

    case "educação física":
    case "educacao fisica":
      return <Dumbbell size={28} />;

    case "arte":
    case "artes":
      return <Palette size={28} />;

    case "música":
    case "musica":
      return <Music size={28} />;

    default:
      return <BookOpen size={28} />;
  }
};

  return (
    <div className="inscrever-page">
      <div className="header">
        <h1>Conteúdos disponíveis</h1>
        <p>
          Se inscreva em mais conteúdos para continuar estudando.
        </p>
      </div>

      <div className="disciplinas-tabs">
        {disciplinas.map((disciplina) => (
          <button
            key={disciplina}
            className={`tab ${
              disciplinaSelecionada === disciplina
                ? "active"
                : ""
            }`}
            onClick={() =>
              setDisciplinaSelecionada(disciplina)
            }
          >
            {disciplina}
          </button>
        ))}
      </div>

      {conteudosFiltrados.length === 0 ? (
        <div className="estado-container">
          <GraduationCap size={70} />
          <h2>Nenhum conteúdo disponível</h2>
          <p>
            Não existem conteúdos disponíveis para matrícula.
          </p>
        </div>
      ) : (
        <div className="conteudos-grid">
          {conteudosFiltrados.map((conteudo) => (
            <div
              className="conteudo-card"
              key={conteudo.id} >

                <div className="card-header">
                  <h3>{conteudo.nome}</h3>
                  <div className="card-top">
                    <div className="card-icon">
                      {getIconeDisciplina(conteudo.disciplina)}
                    </div>
                  </div>
                </div>


              <p>
                <User size={20} />
                {conteudo.professor}
              </p>

              <p>
                <Clock3 size={20} />
                Conteúdo disponível
              </p>

              <div className="acoes">
                <button
                  className="btn-preview"
                  onClick={() => abrirModal(conteudo)}
                >
                  Prévia do Conteúdo
                </button>

                <button className="btn-inscrever">
                  Inscrever-se
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAberta && conteudoSelecionado && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="btn-close"
              onClick={fecharModal}
            >
              <X size={24} />
            </button>
                  
            <div className="modal-header">
                  <div className="modal-icon">
                    {getIconeDisciplina(conteudoSelecionado.disciplina)}
                  </div>
                <h2>{conteudoSelecionado.nome}</h2>

                <p>
                  {conteudoSelecionado.descricao}
                </p>

                <span>
                  <User />
                  {conteudoSelecionado.professor}
                </span>
              </div>

            <div className="ementa-box">
              <h4>Ementa</h4>

              <p>{conteudoSelecionado.ementa}</p>
            </div>

            <button className="btn-inscrever-modal">
              Inscrever-se
            </button>
          </div>  
        </div>
      )}
    </div>
  );
}