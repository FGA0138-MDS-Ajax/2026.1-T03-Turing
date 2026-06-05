import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";
import "./TeacherReview.css";

export default function TeacherReview() {
  const { user } = useAuth();


  const [inscricoesPendentes, setInscricoesPendentes] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
    
    // 403 simples
    if (user?.tipo !== "admin") {
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
          <h1 style={{ fontSize: "4rem", color: "#212121" }}>403</h1>
          <p>Você não possui permissão para acessar esta página.</p>
        </div>
      );
    }


  // ESPERAR BACK INTEGRAR O RECEBIMENTO DO HORARIO FEITO O ENVIO DO CURRICULO

  // const formatTimeAgo = (dateString) => {
  //   if (!dateString) return "5 min atrás";

  //   const now = new Date();
  //   const createdAt = new Date(dateString);

  //   const diffMs = now - createdAt;

  //   const minutes = Math.floor(diffMs / 1000 / 60);

  //   if (minutes < 1) return "Agora";
  //   if (minutes < 60) return `${minutes} min atrás`;

  //   const hours = Math.floor(minutes / 60);

  //   if (hours < 24) return `${hours}h atrás`;

  //   const days = Math.floor(hours / 24);

  //   return `${days} dias atrás`;
  // };

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "/api/interacoes/inscricoes/?status=pendente"
      );
      const inscricoes = Array.isArray(response.data)
        ? response.data
        : [];

      setInscricoesPendentes(inscricoes);

    } catch (err) {
      console.log( err);
      setError(
        err.response?.data?.detail ||
          "Não foi possível carregar os professores."
      );
    } finally {
      setLoading(false);
    }
  };

  const showResume = (curriculoUrl) => {
    if (!curriculoUrl) return;

    const url = curriculoUrl.startsWith("http")
      ? curriculoUrl
      : `http://localhost:8000${curriculoUrl}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const requestAction = (professor, type) => {
    setConfirmAction({ professor, type });
  };

  const closeConfirm = () => {
    setConfirmAction(null);
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    setActionLoading(true);
    setError("");

    try {
      const { professor , type } = confirmAction;

      if (type === "rejeitar") {
        await api.patch(
          `/api/interacoes/inscricoes/${professor.id}/rejeitar/`
        );
      } else {
        await api.patch(
          `/api/interacoes/inscricoes/${professor.id}/aprovar/`
        );
      }

      setInscricoesPendentes((previous) =>
        previous.filter(
          (item) => item.id !== professor.id
        )
      );

      setSelectedProfessor(null);

      setToast(
        type === "aprovar"
          ? "Currículo aprovado com sucesso."
          : "Currículo rejeitado com sucesso."
      );

      setTimeout(() => {
        setToast("");
      }, 3500);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
          console.log(err) &&
          "Erro ao processar a ação."
      );
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };
  const filteredProfessores = inscricoesPendentes.filter(
    (inscricao) =>
      inscricao.professor_nome
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      inscricao.professor_email
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="admin-review-page">

      {toast && (
        <div className="admin-toast">
          {toast}
        </div>
      )}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">
          Carregando professores...
        </div>
      ) : (
        <>

          {/* PROFESSORES PENDENTES */}
            <div className="admin-review-header">
              <div>
                <h1>Professores pendentes</h1>

                <p className="admin-description">
                  Professores em espera de aprovação
                  de currículo.
                </p>
              </div>
            </div>
          <section className="teachers-section">

            <div className="section-header">

              <h2>Listar professores</h2>

              <div className="section-actions">

                <div className="search-wrapper">

                    <svg
                      className="input-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      color="#9b9a97"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>

                    <input
                      type="text"
                      placeholder="Buscar professor..."
                      className="search-input"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    color="#9b9a97"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="22 3 2 3 10 12 10 19 14 21 14 12 22 3" />
                  </svg>

                <button className="filter-button">
                  Filtrar por status
                </button>

              </div>
            </div>

          <div className="section-divider"></div>

            <div className="admin-list">
                {filteredProfessores.map((inscricao) => (
                  <article
                    className="admin-card"
                    key={inscricao.id}
                  > 
                  <div className="admin-card-left">

                    <div className="teacher-avatar">
                      <User size={20} color="#1f4f46" />
                    </div>

                    <div className="teacher-info">

                      <strong>
                        {inscricao.professor_nome || "Professor sem nome"}
                      </strong>

                      <p>
                        {inscricao.professor_email}
                      </p>

                      <span className="admin-badge">
                        Pendente
                      </span>

                    </div>
                  </div>

                  <div className="admin-card-right">

                    {/* <span className="teacher-time">
                      {formatTimeAgo(professor.data_criacao)}
                    </span> */}

                    <button
                    type="button"
                    className="btn-secondary-admin"
                    onClick={() =>

                      setSelectedProfessor(inscricao)}
                    >
                      Ver currículo
                    </button>

                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Modal DE VISUALIZAÇÃO DE CURRÍCULO */}
      {selectedProfessor &&(

        <div className="resume-modal-backdrop">

          <div className="resume-modal">


            <div className="resume-modal-header">

              <div className="resume-user-info">

                <h2>
                  {selectedProfessor.professor_nome}
                </h2>

                <p>
                  {selectedProfessor.professor_email}
                </p>

              </div>

              <div className="resume-header-actions">

                <a
                  href={
                    // aqui ta deboa
                    selectedProfessor.curriculo
                      ? selectedProfessor.curriculo
                      : `http://localhost:8000${selectedProfessor.curriculo}`
                  }
                  download
                  className="download-button"
                >
                  ⬇
                </a>

                <button
                  className="close-button"
                  onClick={() => setSelectedProfessor(null)}
                >
                  ✕
                </button>

              </div>
            </div>


            <div className="resume-modal-content">

               <embed
                src={
                 // aqui ta deboa
                  selectedProfessor.curriculo
                    ? selectedProfessor.curriculo
                    : `http://localhost:8000${selectedProfessor.curriculo}`
                }
                type="application/pdf"
                className="resume-pdf"
              />
            </div>

            <div className="resume-modal-actions">

              <button
                className="btn-danger-admin"
                onClick={() =>
                  requestAction(
                    selectedProfessor,
                    "rejeitar"
                  )
                }
              >
                Rejeitar
              </button>

              <button
                className="btn-primary-admin"
                onClick={() =>
                    // ja ta mudado
                  requestAction(
                    selectedProfessor,
                    "aprovar"
                  )
                }
              >
                Aprovar
              </button>

            </div>

          </div>

        </div>

      )}



      {/* MODAL DE CONFIRMAÇÃO */}
      {confirmAction && (
        <div className="admin-confirm-backdrop">

          <div className="admin-confirm-modal">

            <h2>
              Confirmação necessária
            </h2>

            <p>
              Tem certeza que deseja{" "}
              {confirmAction.type === "aprovar"
                ? "aprovar"
                : "rejeitar"}{" "}
              {" "}
              <strong>
                {
                  confirmAction.professor
                      .professor_nome
                }
              </strong>
              ?
            </p>
            <p>Esta ação não pode ser desfeita.</p>

            <div className="admin-confirm-buttons">

              <button
                type="button"
                className="btn-secondary-confirm"
                onClick={closeConfirm}
                disabled={actionLoading}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-primary-confirm"
                onClick={executeAction}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processando..."
                  : "Confirmar"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}