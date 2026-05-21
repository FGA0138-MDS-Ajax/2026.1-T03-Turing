import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmar_senha: "",
    data_nascimento: "",
    account_type: "aluno",
    curriculo: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileError, setFileError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCpfChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setCpfError("");
    setForm({ ...form, cpf: onlyDigits });
  };

  const formatCpfDisplay = (digits) => {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const validateCpf = (cpf) => {
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf[10]);
  };

  const handleCpfBlur = () => {
    if (form.cpf && !validateCpf(form.cpf)) {
      setCpfError("CPF inválido.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (file) {
      if (file.type !== "application/pdf") {
        setFileError("Por favor, envie um arquivo em formato PDF.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFileError("O arquivo não pode exceder 5MB.");
        return;
      }
      setForm({ ...form, curriculo: file });
    }
  };

  const getEndpoint = (accountType) => {
    const routes = {
      aluno: "/api/usuarios/alunos/",
      professor: "/api/usuarios/professores/",
    };
    return routes[accountType] || "/api/usuarios/alunos/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.senha !== form.confirmar_senha) {
      alert("As senhas não coincidem.");
      return;
    }

    if (!validateCpf(form.cpf)) {
      setCpfError("CPF inválido.");
      return;
    }

    if (form.account_type === "professor" && !form.curriculo) {
      alert("Professores devem enviar um currículo em PDF.");
      return;
    }

    const endpoint = getEndpoint(form.account_type);

    setLoading(true);

    try {
      const payload = {
        perfil: {
          nome: form.nome,
          email: form.email,
          cpf: form.cpf,
          password: form.senha,
          data_nascimento: form.data_nascimento,
        },
      };

      let response;

      if (form.account_type === "professor" && form.curriculo) {
        
        const formData = new FormData();
        formData.append("perfil", JSON.stringify(payload.perfil));
        formData.append("curriculo", form.curriculo);

        response = await api.post(endpoint, formData);
      } else {
        response = await api.post(endpoint, payload);
      }

      if (response.status === 201) {
        alert("Conta criada com sucesso!");
        navigate("/login");
      }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao criar conta. Tente novamente. Certifique-se que o campo de CPF e email sejam unicos e que o cpf seja valido e com 11 digitos");
        //todo alertar de forma melhor o formato desses dados
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Alternar tema"
        title={theme === "light" ? "Modo escuro" : "Modo claro"}
        disabled={loading}
      >
        {theme === "light" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </button>

      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-logo">
            <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>

          <h1 className="register-title">Criar Conta</h1>
          <p className="register-subtitle">Comece sua jornada de aprendizado</p>

          <form className="register-form" onSubmit={handleSubmit}>

            <div className="field-group">
              <label htmlFor="nome">Nome Completo</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
                  </svg>
                </span>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="João Silva"
                  value={form.nome}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="email">E-mail</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="cpf">CPF</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <line x1="7" y1="9" x2="17" y2="9" />
                    <line x1="7" y1="13" x2="13" y2="13" />
                  </svg>
                </span>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={formatCpfDisplay(form.cpf)}
                  onChange={handleCpfChange}
                  onBlur={handleCpfBlur}
                  disabled={loading}
                  maxLength={14}
                  required
                />
              </div>
              {cpfError && <span className="error-message">{cpfError}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="data_nascimento">Data de Nascimento</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <input
                  id="data_nascimento"
                  name="data_nascimento"
                  type="date"
                  value={form.data_nascimento}
                  onChange={handleChange}
                  disabled={loading}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="account_type">Tipo de Conta</label>
              <div className="select-wrapper">
                <select
                  id="account_type"
                  name="account_type"
                  value={form.account_type}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                </select>
                <span className="select-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>

            {form.account_type === "professor" && (
              <div className="field-group">
                <label htmlFor="curriculo">Currículo (PDF)</label>
                <div className="file-input-wrapper">
                  <span className="file-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="19" x2="12" y2="11" />
                      <line x1="9" y1="16" x2="15" y2="16" />
                    </svg>
                  </span>
                  <div className="file-input-label">
                    <input
                      id="curriculo"
                      name="curriculo"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={loading}
                      className="file-input"
                    />
                    <span className="file-input-text">
                      {form.curriculo
                        ? form.curriculo.name
                        : "Clique aqui para anexar seu currículo (PDF)"}
                    </span>
                  </div>
                </div>
                {fileError && <span className="error-message">{fileError}</span>}
                <p className="file-info">Máximo 5MB. Formato: PDF</p>
              </div>
            )}

            <div className="field-group">
              <label htmlFor="senha">Senha</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label="Mostrar/ocultar senha"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="confirmar_senha">Confirmar Senha</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="confirmar_senha"
                  name="confirmar_senha"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmar_senha}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={loading}
                  aria-label="Mostrar/ocultar confirmação"
                >
                  {showConfirm ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          <p className="auth-redirect">
            Já tem uma conta?{" "}
            <Link to="/login" className="auth-link">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}