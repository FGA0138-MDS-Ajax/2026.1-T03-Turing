import { useState } from 'react';
import { adminService } from '../../services/adminService';
import './admin.css';

export function CreateAdminButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await adminService.createAdmin(form);
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setForm({ name: '', email: '', password: '' });
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro ao criar administrador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="gs-create-admin-btn" onClick={() => setOpen(true)}>
        + Adicionar Admin
      </button>

      {open && (
        <div className="gs-modal-overlay" onClick={() => setOpen(false)}>
          <div className="gs-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="gs-modal-title">Novo Administrador</h3>

            {success ? (
              <p className="gs-modal-success">✓ Administrador criado com sucesso!</p>
            ) : (
              <>
                <input
                  className="gs-modal-input"
                  placeholder="Nome completo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="gs-modal-input"
                  placeholder="E-mail"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  className="gs-modal-input"
                  placeholder="Senha temporária"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {error && <p className="gs-modal-error">{error}</p>}
                <div className="gs-modal-actions">
                  <button
                    className="gs-modal-cancel"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    className="gs-modal-confirm"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Criando...' : 'Criar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}