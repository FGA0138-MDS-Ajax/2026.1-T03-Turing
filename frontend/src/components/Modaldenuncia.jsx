import { useState, useEffect } from "react";
import "./Modal.css";

const MOTIVOS = [
  { value: "", label: "Selecione um motivo" },
  { value: "spam", label: "Spam ou propaganda" },
  { value: "ofensivo", label: "Conteúdo ofensivo ou inadequado" },
  { value: "irrelevante", label: "Pergunta irrelevante ao conteúdo" },
  { value: "duplicado", label: "Pergunta duplicada" },
  { value: "outro", label: "Outro" },
];

export default function ModalDenuncia({ isOpen, onClose, forumId }) {
  const [motivo, setMotivo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleClose = () => {
    setMotivo("");
    setMensagem("");
    setErrors({});
    setFeedback(null);
    onClose();
  };

  const validate = () => {
    const errs = {};
    if (!motivo) errs.motivo = "Selecione um motivo para a denúncia.";
    if (!mensagem.trim()) errs.mensagem = "A mensagem é obrigatória.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/forum/denuncia/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ forum_id: forumId, motivo, mensagem }),
      });
      if (!response.ok) throw new Error("Erro ao enviar denúncia.");
      setFeedback({ type: "success", msg: "Denúncia enviada com sucesso!" });
      setTimeout(handleClose, 1800);
    } catch {
      setFeedback({ type: "error", msg: "Falha ao enviar. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !motivo || !mensagem.trim() || loading;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Denuncia</h2>

        <div className="modal-field">
          <label className="modal-label">motivo da denuncia</label>
          <select
            className={`modal-select ${errors.motivo ? "modal-input-error" : ""}`}
            value={motivo}
            onChange={(e) => { setMotivo(e.target.value); setErrors((p) => ({ ...p, motivo: "" })); }}
          >
            {MOTIVOS.map((m) => (
              <option key={m.value} value={m.value} disabled={m.value === ""}>
                {m.label}
              </option>
            ))}
          </select>
          {errors.motivo && <span className="modal-error-msg">{errors.motivo}</span>}
        </div>

        <div className="modal-field">
          <label className="modal-label">Mensagem</label>
          <textarea
            className={`modal-textarea ${errors.mensagem ? "modal-input-error" : ""}`}
            value={mensagem}
            onChange={(e) => { setMensagem(e.target.value); setErrors((p) => ({ ...p, mensagem: "" })); }}
            rows={5}
          />
          {errors.mensagem
            ? <span className="modal-error-msg">{errors.mensagem}</span>
            : <span className="modal-hint">explique o motivo da denuncia, o que aconteceu para que os moderadores possam verificar</span>
          }
        </div>

        {feedback && (
          <div className={`modal-feedback modal-feedback-${feedback.type}`}>
            {feedback.msg}
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={handleClose} disabled={loading}>
            Cancelar
          </button>
          <button className="modal-btn-primary" onClick={handleSubmit} disabled={isDisabled}>
            {loading ? "Enviando..." : "Enviar denuncia"}
          </button>
        </div>
      </div>
    </div>
  );
}