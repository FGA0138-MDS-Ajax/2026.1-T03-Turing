import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  listarConteudos,
  listarDisciplinas,
  listarMateriais,
  criarMaterial,
  listarProfessoresAprovados,
} from "../../../services/disciplinasService";
import "./ProfessorConteudo.css";
import { BookOpen, CalendarDays, FolderOpen, Filter } from "lucide-react";
import ModalCriarMaterial from "../../../components/professor/ModalCriarMaterial";

export default function ProfessorConteudo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conteudos, setConteudos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAcao, setLoadingAcao] = useState(false);
  const [error, setError] = useState("");
  const [materiais, setMateriais] = useState([]);
  const [filtroDisciplina, setFiltroDisciplina] = useState("");
  const [modalCriar, setModalCriar] = useState(false);
  const [conteudoSelecionado, setConteudoSelecionado] = useState(null);

  if (user?.tipo !== "professor") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column" }}>
        <h1 style={{ fontSize: "4rem", color: "#212121" }}>403</h1>
        <p>Você não possui permissão para acessar esta página.</p>
      </div>
    );
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('authToken');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
      const perfilId = Number(payload.user_id);

      const [conteudosResponse, disciplinasResponse, materiaisResponse, professoresResponse] = await Promise.all([
        listarConteudos(),
        listarDisciplinas(),
        listarMateriais(),
        listarProfessoresAprovados(),
      ]);

      const professorLogado = professoresResponse.data.find(p => p.perfil?.id === perfilId);
      const professorId = professorLogado?.id;

      const todosConteudos = Array.isArray(conteudosResponse.data) ? conteudosResponse.data : [];

      const conteudosDoProfessor = professorId
        ? todosConteudos.filter(c =>
          Array.isArray(c.professores) && c.professores.includes(professorId)
        )
        : [];

      setConteudos(conteudosDoProfessor);

      const todasDisciplinas = Array.isArray(disciplinasResponse.data) ? disciplinasResponse.data : [];
      const disciplinasDoProfessor = todasDisciplinas.filter(d =>
        conteudosDoProfessor.some(c => c.disciplina === d.id)
      );
      setDisciplinas(disciplinasDoProfessor);
      
      setMateriais(materiaisResponse.data);
    } catch (err) {
      console.log(err);
      setError("Não foi possível carregar os conteúdos.");
    } finally {
      setLoading(false);
    }
  };

  const [toast, setToast] = useState(null);

  const exibirToast = (tipo, mensagem) => {
    setToast({ tipo, mensagem });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCriar = async (formData) => {
    setLoadingAcao(true);
    try {
      await criarMaterial(formData);
      exibirToast('sucesso', 'Material adicionado com sucesso!');
      await carregarDados();
      return true;
    } catch (err) {
      console.error(err);
      exibirToast('erro', 'Erro ao adicionar material.');
      return false;
    } finally {
      setLoadingAcao(false);
    }
  };

  const abrirModalParaConteudo = (conteudo) => {
    setConteudoSelecionado(conteudo);
    setModalCriar(true);
  };

  const fecharModal = () => {
    setModalCriar(false);
    setConteudoSelecionado(null);
  };

  const conteudosFiltrados =
    filtroDisciplina === ""
      ? conteudos
      : conteudos.filter((conteudo) => conteudo.disciplina === Number(filtroDisciplina));

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
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#02373a', margin: 0, fontFamily: 'Serif' }}>Meus Conteúdos</h1>
        <p style={{ color: '#6A7282', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          Visualize os conteúdos vinculados a você.
        </p>
      </div>

      <div className="conteudo-filters">
        <div className="filter-wrapper">
          <Filter size={18} />
          <select
            value={filtroDisciplina}
            onChange={(e) => setFiltroDisciplina(e.target.value)}
          >
            <option value="">Todas as disciplinas</option>
            {disciplinas.map((disciplina) => (
              <option key={disciplina.id} value={disciplina.id}>
                {disciplina.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="conteudos-grid">
        {conteudosFiltrados.map((conteudo) => {
          const disciplina = disciplinas.find((d) => d.id === conteudo.disciplina);
          const quantidadeMateriais = materiais.filter(
            (material) => Number(material.conteudo) === Number(conteudo.id)
          ).length;

          return (
            <article className="conteudo-card" key={conteudo.id}>
              <div className="conteudo-body">
                <h2>{conteudo.nome}</h2>
                <p className="conteudo-descricao">{conteudo.descricao || "Sem descrição"}</p>
                <div className="conteudo-info">
                  <div className="info-row">
                    <div className="info-icon"><BookOpen size={16} /></div>
                    <p><strong>Disciplina:</strong> {disciplina?.nome || "Não encontrada"}</p>
                  </div>
                  <div className="info-row">
                    <div className="info-icon"><CalendarDays size={16} /></div>
                    <p><strong>Data de criação:</strong> {new Date(conteudo.data_create).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="info-row">
                    <div className="info-icon"><FolderOpen size={16} /></div>
                    <p><strong>Quantidade de materiais:</strong> {quantidadeMateriais}</p>
                  </div>
                </div>
              </div>
              <div className="conteudo-footer">
                <button className="btn-material" onClick={() => abrirModalParaConteudo(conteudo)}>
                  + Adicionar material
                </button>
                <button className="btn-forum" onClick={() => navigate(`/professor/conteudos/${conteudo.id}/forum`)}>
                  💬 Fórum
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {modalCriar && (
        <ModalCriarMaterial
          onClose={fecharModal}
          onSalvar={handleCriar}
          loading={loadingAcao}
          conteudos={conteudos}
        />
      )}
      {toast && (
        <div className={`pm-toast pm-toast--${toast.tipo}`}>
          {toast.mensagem}
        </div>
      )}
    </div>
  );
}