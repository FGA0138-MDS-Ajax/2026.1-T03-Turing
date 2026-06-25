import { useState, useEffect } from "react";
import "./Modal.css";
import { buscarForumPorConteudo, criarMensagem } from "../../services/forumService";

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
      const { data: foruns } = await buscarForumPorConteudo(conteudoId);
      const forumId = Array.isArray(foruns) ? foruns[0]?.id : foruns?.id;
      if (!forumId) throw new Error("Fórum não encontrado.");

      const { data } = await criarMensagem(forumId, `**${titulo}**\n\n${mensagem}`);

      setFeedback({ type: "success", msg: "Pergunta enviada com sucesso!" });
      if (onSuccess) onSuccess(data);
      setTimeout(handleClose, 1800);
    } catch (err) {
      const msg = err?.response?.data?.detail ?? "Falha ao enviar. Tente novamente.";
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
            placeholder="Ex: dúvida sobre derivadas"
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