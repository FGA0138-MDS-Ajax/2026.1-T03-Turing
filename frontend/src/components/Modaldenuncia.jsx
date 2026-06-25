import { useState, useEffect } from "react";
import api from "../services/api";
import "./Modal.css";

const MOTIVOS = [
  { value: "", label: "Selecione um motivo" },
  { value: "Spam ou propaganda", label: "Spam ou propaganda" },
  { value: "Conteúdo ofensivo ou inadequado", label: "Conteúdo ofensivo ou inadequado" },
  { value: "Pergunta irrelevante ao conteúdo", label: "Pergunta irrelevante ao conteúdo" },
  { value: "Pergunta duplicada", label: "Pergunta duplicada" },
  { value: "Outro", label: "Outro" },
];

export default function ModalDenuncia({ isOpen, onClose, mensagemId }) {
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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const payload = {
        mensagem: mensagemId,
        motivo,
      };

      if (mensagem.trim()) {
        payload.evidencias = mensagem.trim();
      }

      await api.post("/api/interacoes/denuncias/", payload);
      setFeedback({ type: "success", msg: "Denúncia enviada com sucesso!" });
      setTimeout(handleClose, 1800);
    } catch (err) {
      const msg =
        err.response?.data?.motivo?.[0] ||
        err.response?.data?.evidencias?.[0] ||
        err.response?.data?.mensagem?.[0] ||
        err.response?.data?.detail ||
        "Falha ao enviar. Tente novamente.";
      setFeedback({ type: "error", msg });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !motivo || loading;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Denúncia</h2>

        <div className="modal-field">
          <label className="modal-label">Motivo da denúncia</label>
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
          <label className="modal-label">Mensagem adicional (opcional)</label>
          <textarea
            className={`modal-textarea ${errors.mensagem ? "modal-input-error" : ""}`}
            value={mensagem}
            onChange={(e) => { setMensagem(e.target.value); setErrors((p) => ({ ...p, mensagem: "" })); }}
            rows={5}
            placeholder="Se quiser, adicione mais detalhes para ajudar na análise"
          />
          <span className="modal-hint">Esse campo é opcional.</span>
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
            {loading ? "Enviando..." : "Enviar denúncia"}
          </button>
        </div>
      </div>
    </div>
  );
}
