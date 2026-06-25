import { useState, useEffect } from "react";
import api from "../services/api";
import "./Modal.css";

export default function ModalPergunta({ isOpen, onClose, conteudoId, onSuccess }) {
  const [titulo, setTitulo] = useState("");
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
    setTitulo("");
    setMensagem("");
    setErrors({});
    setFeedback(null);
    onClose();
  };

  const validate = () => {
    const errs = {};
    if (!titulo.trim()) errs.titulo = "O título da pergunta é obrigatório.";
    if (!mensagem.trim()) errs.mensagem = "A mensagem é obrigatória.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const forunsRes = await api.get("/api/interacoes/foruns/");
      const foruns = Array.isArray(forunsRes.data) ? forunsRes.data : [];
      const forum = foruns.find((f) => String(f.conteudo) === String(conteudoId));

      if (!forum) {
        throw new Error("Fórum não encontrado para este conteúdo.");
      }

      const textoFinal = titulo.trim()
        ? `${titulo.trim()}\n\n${mensagem.trim()}`
        : mensagem.trim();

      const response = await api.post("/api/interacoes/mensagens/", {
        forum: forum.id,
        texto: textoFinal,
      });

      setFeedback({ type: "success", msg: "Pergunta enviada com sucesso!" });
      if (onSuccess) onSuccess(response.data);
      setTimeout(handleClose, 1800);
    } catch (err) {
      const msg = err.response?.data?.texto?.[0]
        || err.response?.data?.detail
        || err.message
        || "Falha ao enviar. Tente novamente.";
      setFeedback({ type: "error", msg });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !titulo.trim() || !mensagem.trim() || loading;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Pergunta</h2>

        <div className="modal-field">
          <label className="modal-label">Título da pergunta</label>
          <input
            type="text"
            className={`modal-input ${errors.titulo ? "modal-input-error" : ""}`}
            placeholder="Ex: duvida sobre derivadas"
            value={titulo}
            onChange={(e) => { setTitulo(e.target.value); setErrors((p) => ({ ...p, titulo: "" })); }}
          />
          {errors.titulo && <span className="modal-error-msg">{errors.titulo}</span>}
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
            : <span className="modal-hint">Se possível, inclua exemplos do que já fez ou tentou</span>
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
            {loading ? "Enviando..." : "Enviar pergunta"}
          </button>
        </div>
      </div>
    </div>
  );
}