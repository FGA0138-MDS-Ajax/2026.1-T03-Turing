import { useState, useEffect } from "react";
import { 
  BookOpen, Clock3, X, GraduationCap, Sigma, 
  Atom, FlaskConical, Languages, Leaf, Globe, 
  Landmark, Monitor, Dumbbell, Music, Palette, Calendar
} from "lucide-react";
import "./InscreverConteudos.css";
import { criarMatricula, listarDisciplinas, listarProfessoresAprovados } from "../../../services/disciplinasService";
import { listarConteudosDisponiveis } from "../../../services/alunoService";

export default function InscreverConteudos() {
  const [conteudos, setConteudos] = useState([]);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [listaProfessores, setListaProfessores] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("Todas");
  const [modalAberta, setModalAberta] = useState(false);
  const [conteudoSelecionado, setConteudoSelecionado] = useState(null);

  // 2. Busca todos os dados simultaneamente (Cruza os IDs com os nomes reais)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [resConteudos, resDisciplinas, resProfessores] = await Promise.all([
          listarConteudosDisponiveis(),
          listarDisciplinas(),
          listarProfessoresAprovados()
        ]);

        setConteudos(Array.isArray(resConteudos.data) ? resConteudos.data : []);
        setListaDisciplinas(resDisciplinas.data.results || resDisciplinas.data);
        setListaProfessores(resProfessores.data.results || resProfessores.data);

      } catch (err) {
        console.error("Erro ao buscar dados da API:", err);
        setErro("Não foi possível carregar os conteúdos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 3. Tradutores Inteligentes (Transformam o ID que o back mandou no Nome real)
  const getNomeDisciplina = (dRaw) => {
    if (!dRaw) return "Geral";
    if (typeof dRaw === "string") return dRaw;
    if (typeof dRaw === "object") return dRaw.nome || dRaw.name;
    
    // Se for um número (ID), procura na lista de disciplinas que baixamos
    const disciplinaEncontrada = listaDisciplinas.find(d => d.id === Number(dRaw));
    return disciplinaEncontrada ? disciplinaEncontrada.nome : `Disciplina ${dRaw}`;
  };

  const getNomeProfessor = (profRaw) => {
    // 1. Se não vier nada ou vier um array vazio
    if (!profRaw || (Array.isArray(profRaw) && profRaw.length === 0)) return "Não informado";

    // 2. Se o back mandar um array de IDs (ex: professores: [1, 2]), pegamos o primeiro
    const idProf = Array.isArray(profRaw) ? profRaw[0] : profRaw;

    // 3. Procuramos o ID na lista de professores que baixamos da API
    const profEncontrado = listaProfessores.find(p => p.id === Number(idProf));

    if (profEncontrado) {
      // O pulo do gato: o nome está dentro de "perfil"!
      // Como não sei se o back usa "nome", "name", ou "username" no perfil, cobrimos todas as opções:
      const perfil = profEncontrado.perfil;
      if (perfil) {
        return perfil.nome || perfil.first_name || perfil.username || perfil.name || "Professor";
      }
      return profEncontrado.nome || "Professor";
    }

    return "Não informado";
  };

  // 4. Lógica de Filtros e Abas (usando o tradutor)
  const disciplinasUnicas = conteudos
    .map((c) => getNomeDisciplina(c.disciplina))
    .filter(Boolean);

  const disciplinasTabs = ["Todas", ...new Set(disciplinasUnicas)];

  const conteudosFiltrados =
    disciplinaSelecionada === "Todas"
      ? conteudos
      : conteudos.filter((c) => getNomeDisciplina(c.disciplina) === disciplinaSelecionada);

  const abrirModal = (conteudo) => {
    setConteudoSelecionado(conteudo);
    setModalAberta(true);
  };

  const fecharModal = () => {
    setModalAberta(false);
    setConteudoSelecionado(null);
  };

  const handleInscrever = async (conteudoId) => {
    try {
      await criarMatricula({ conteudo: conteudoId }); 
      alert("Inscrição realizada com sucesso!");
      setConteudos((prev) => prev.filter((c) => c.id !== conteudoId));
      fecharModal();
    } catch (err) {
      console.error("Erro ao realizar inscrição:", err);
      alert("Erro ao tentar se inscrever. Tente novamente.");
    }
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

  const getIconeDisciplina = (nomeDisciplina) => {
    switch (nomeDisciplina?.toLowerCase()) {
      case "matemática":
      case "matematica": return <Sigma size={24} />;
      case "física":
      case "fisica": return <Atom size={24} />;
      case "química":
      case "quimica": return <FlaskConical size={24} />;
      case "biologia": return <Leaf size={24} />;
      case "geografia": return <Globe size={24} />;
      case "história":
      case "historia": return <Landmark size={24} />;
      case "português":
      case "portugues": return <Languages size={24} />;
      case "informática":
      case "informatica": return <Monitor size={24} />;
      case "educação física":
      case "educacao fisica": return <Dumbbell size={24} />;
      case "arte":
      case "artes": return <Palette size={24} />;
      case "música":
      case "musica": return <Music size={24} />;
      default: return <BookOpen size={24} />;
    }
  };

  return (
    <div className="inscrever-page">
      <div className="header">
        <h1>Conteúdos disponíveis</h1>
        <p>Se inscreva em mais conteúdos para continuar estudando.</p>
      </div>

      <div className="disciplinas-tabs">
          {disciplinasTabs.map((disciplina) => (
            <button
              key={disciplina}
              className={`tab ${disciplinaSelecionada === disciplina ? "active" : ""}`}
              onClick={() => setDisciplinaSelecionada(disciplina)}
            >
              {disciplina}
            </button>
          ))}
        </div>

      <div className="conteudos-wrapper">
        {conteudosFiltrados.length === 0 ? (
          <div className="estado-container">
            <GraduationCap size={70} color="white" />
            <h2 style={{ color: "white", marginTop: "16px" }}>Nenhum conteúdo disponível</h2>
            <p style={{ color: "#d1dbda" }}>Você já está matriculado em todos os conteúdos ou não há novidades.</p>
          </div>
        ) : (
          <div className="conteudos-grid">
            {conteudosFiltrados.map((conteudo) => {
              const nomeDaDisciplina = getNomeDisciplina(conteudo.disciplina);
              
              return (
                <div className="conteudo-card" key={conteudo.id}>
                  
                  <div className="card-header">
                    <h3>{conteudo.nome}</h3>
                    <div className="card-icon">
                      {getIconeDisciplina(nomeDaDisciplina)}
                    </div>
                  </div>

                  <p className="professor">
                    Prof. {getNomeProfessor(conteudo.professor || conteudo.professores)}
                  </p>

                  <div className="infos">
                    <p><Calendar size={16} /> Informações</p>
                    <p><Clock3 size={16} /> Informações</p>
                  </div>

                  <div className="acoes">
                    <button className="btn-preview" onClick={() => abrirModal(conteudo)}>
                      Prévia do Conteúdo
                    </button>
                    <button className="btn-inscrever" onClick={() => handleInscrever(conteudo.id)}>
                      Inscrever-se
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalAberta && conteudoSelecionado && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="btn-close" onClick={fecharModal}>
              <X size={24} />
            </button>

            <div className="modal-header">
              <div className="modal-title-wrapper">
                <h2>{conteudoSelecionado.nome}</h2>
                <div className="modal-icon-badge">
                  {getIconeDisciplina(getNomeDisciplina(conteudoSelecionado.disciplina))}
                </div>
              </div>
              
              <p className="modal-desc">{conteudoSelecionado.descricao}</p>
              
              <div className="modal-meta">
                <span className="prof-name">
                  Prof. {getNomeProfessor(conteudoSelecionado.professor || conteudoSelecionado.professores)}
                </span>
                <span className="info-item"><Calendar size={16} /> Informações</span>
                <span className="info-item"><Clock3 size={16} /> Informações</span>
              </div>
            </div>

            <div className="ementa-box">
              <h4>Ementa</h4>
              <p>{conteudoSelecionado.ementa}</p>
            </div>

            <div className="modal-footer">
              <button className="btn-inscrever-modal" onClick={() => handleInscrever(conteudoSelecionado.id)}>
                Inscrever-se
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}