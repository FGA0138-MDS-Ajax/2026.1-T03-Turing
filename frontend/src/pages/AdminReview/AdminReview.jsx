import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./AdminReview.css";

export default function AdminReview() {
  const { user, logout } = useAuth();
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/usuarios/professores/");
      const professors = Array.isArray(response.data) ? response.data : [];
      const pending = professors.filter((professor) => Boolean(professor.curriculo));
      setProfessores(pending);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Não foi possível carregar a lista de currículos."
      );
    } finally {
      setLoading(false);
    }
  };

  const showResume = (curriculoUrl) => {
    if (!curriculoUrl) {
      return;
    }

    const url = curriculoUrl.startsWith("http")
      ? curriculoUrl
      : `http://localhost:8000${curriculoUrl}`;

    window.open(url, "_blank", "noopener,noreferrer");
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
      const { professor, type } = confirmAction;

      if (type === "rejeitar") {
        await api.patch(`/api/usuarios/professores/${professor.id}/`, {
          curriculo: null,
        });
      } else {
        await api.patch(`/api/usuarios/professores/${professor.id}/`, {});
      }

      setProfessores((previous) =>
        previous.filter((item) => item.id !== professor.id)
      );
      setToast(
        type === "aprovar"
          ? "Currículo aprovado com sucesso."
          : "Currículo rejeitado com sucesso."
      );

      window.setTimeout(() => setToast(""), 3500);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Erro ao processar a decisão. Tente novamente."
      );
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  return (
    <div className="admin-review-page">
      <div className="admin-review-header">
        <div>
          <p className="admin-label">Painel de aprovação de currículos</p>
          <h1>Bem-vindo, {user?.nome || user?.email}</h1>
          <p className="admin-description">
            Aqui você revisa e decide sobre currículos enviados por professores.
          </p>
        </div>

        <button className="logout-button" onClick={logout}>
          Sair
        </button>
      </div>

      <div className="admin-review-content">
        {toast && <div className="admin-toast">{toast}</div>}
        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loading">Carregando currículos pendentes...</div>
        ) : (
          <>
            {professores.length === 0 ? (
              <div className="admin-empty">
                Nenhum currículo pendente no momento.
              </div>
            ) : (
              <div className="admin-list">
                {professores.map((professor) => (
                  <article className="admin-card" key={professor.id}>
                    <div className="admin-card-header">
                      <div>
                        <strong>{professor.perfil?.nome || "Professor sem nome"}</strong>
                        <p>{professor.perfil?.email}</p>
                      </div>
                      <span className="admin-badge">Pendente</span>
                    </div>

                    <div className="admin-card-body">
                      <p>
                        Visualize o currículo antes de aprovar ou rejeitar.
                      </p>
                      <div className="admin-actions-row">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => showResume(professor.curriculo)}
                        >
                          Ver currículo
                        </button>
                        <div className="admin-actions">
                          <button
                            type="button"
                            onClick={() => requestAction(professor, "rejeitar")}
                            className="btn-danger"
                          >
                            Rejeitar
                          </button>
                          <button
                            type="button"
                            onClick={() => requestAction(professor, "aprovar")}
                            className="btn-primary"
                          >
                            Aprovar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {confirmAction && (
        <div className="admin-confirm-backdrop">
          <div className="admin-confirm-modal">
            <h2>Confirmação necessária</h2>
            <p>
              Tem certeza que deseja {confirmAction.type === "aprovar" ? "aprovar" : "rejeitar"} o currículo de <strong>{confirmAction.professor.perfil?.nome}</strong>?
            </p>
            <div className="admin-confirm-buttons">
              <button type="button" className="btn-secondary" onClick={closeConfirm} disabled={actionLoading}>
                Cancelar
              </button>
              <button type="button" className="btn-primary" onClick={executeAction} disabled={actionLoading}>
                {actionLoading ? "Processando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
