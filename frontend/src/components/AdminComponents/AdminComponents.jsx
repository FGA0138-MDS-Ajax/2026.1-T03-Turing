  import {useState, useEffect} from 'react';
  import './AdminComponents.css';

  //Componentes reutilizáveis para as páginas de administração de usuários (professores e alunos)

  //toast de feedback para ações de CRUD
  export function Toast({ toast}) {
      if (!toast) return null;
      return(
          <div className={`gs-toast gs-toast--${toast.tipo}`}>
              <span>{toast.mensagem}</span>
          </div>
      );
  }

  //modal de confirmação de delete

  export function ModalConfirmacao({ aberto, nomeUsuario, onConfirmar, onCancelar }) {
    if (!aberto) return null;
    return (
      <div className="gs-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div className="gs-modal" onClick={(e) => e.stopPropagation()}>
          <h2 id="modal-titulo" className="gs-modal-title">Confirmar exclusão</h2>
          <p className="gs-modal-text">
            Tem certeza que deseja excluir <strong>{nomeUsuario}</strong>? Esta ação não pode ser desfeita.
          </p>
          <div className="gs-modal-actions">
            <button className="gs-modal-cancel" onClick={onCancelar}>Cancelar</button>
            <button className="gs-modal-danger" onClick={onConfirmar}>Confirmar exclusão</button>
          </div>
        </div>
      </div>
    );
  }

  //modal de formulário para criar/editar usuário
  const CAMPOS_INICIAIS = {
    nome: '',
    email: '',
    cpf: '',
    data_nascimento: '',
    password: '',
  };

function formatarCpf(cpf) {
  if (!cpf) return '';
  const d = cpf.replace(/\D/g, '');
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

  export function ModalFormulario({ aberto, usuarioParaEditar, onSalvar, onCancelar, titulo }) {
    const [campos, setCampos] = useState(CAMPOS_INICIAIS);
    const [errosCampos, setErrosCampos] = useState({});

  // Pré-preenche ao editar
    useEffect(() => {
      if (usuarioParaEditar) {
        const p = usuarioParaEditar.perfil;
        setCampos({
          nome: p.nome || '',
          email: p.email || '',
          cpf: p.cpf || '',
          data_nascimento: p.data_nascimento || '',
          password: '',
        });
      } else {
        setCampos(CAMPOS_INICIAIS);
      }
      setErrosCampos({});
    }, [aberto, usuarioParaEditar]);

    if (!aberto) return null;

    const validar = () => {
      const erros = {};
      if (!campos.nome.trim()) erros.nome = 'Nome é obrigatório';
      if (!usuarioParaEditar && !campos.email.trim()) erros.email = 'Email é obrigatório';
      if (!usuarioParaEditar && !campos.cpf.trim()) erros.cpf = 'CPF é obrigatório';
      if (!campos.data_nascimento) erros.data_nascimento = 'Data de nascimento é obrigatória';
      if (!usuarioParaEditar && !campos.password.trim()) erros.password = 'Senha é obrigatória';
      setErrosCampos(erros);
      return Object.keys(erros).length === 0;
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      const valorLimpo = name === 'cpf' ? value.replace(/\D/g, '').slice(0, 11) : value;
      setCampos((prev) => ({ ...prev, [name]: valorLimpo }));
      if (errosCampos[name]) setErrosCampos((prev) => ({ ...prev, [name]: undefined }));
  };

    const handleSubmit = () => {
      if (!validar()) return;

      if (usuarioParaEditar) {
          // PATCH: envia só o que mudou em relação ao valor original
          const original = usuarioParaEditar.perfil;
          const alterados = {};

          if (campos.nome !== original.nome) alterados.nome = campos.nome;
          if (campos.email !== original.email) alterados.email = campos.email;
          if (campos.cpf !== original.cpf) alterados.cpf = campos.cpf;
          if (campos.data_nascimento !== original.data_nascimento)
          alterados.data_nascimento = campos.data_nascimento;
          if (campos.password) alterados.password = campos.password;

          onSalvar({ perfil: alterados });
      } else {
          // POST: envia tudo
          onSalvar({ perfil: { ...campos } });
      }
    };

    return (
      <div className="gs-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="form-titulo">
        <div className="gs-modal" onClick={(e) => e.stopPropagation()}>
          <h2 id="form-titulo" className="gs-modal-title">{titulo}</h2>

          <div className="gs-form-field">
            <label htmlFor="nome" className="gs-form-label">Nome completo *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={campos.nome}
              onChange={handleChange}
              className={`gs-modal-input ${errosCampos.nome ? 'gs-modal-input--erro' : ''}`}
              placeholder="Nome completo"
              aria-describedby={errosCampos.nome ? 'erro-nome' : undefined}
            />
            {errosCampos.nome && <span id="erro-nome" className="gs-form-erro">{errosCampos.nome}</span>}
          </div>

          <div className="gs-form-field">
            <label htmlFor="email" className="gs-form-label">E-mail *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={campos.email}
              onChange={handleChange}
              className={`gs-modal-input ${errosCampos.email ? 'gs-modal-input--erro' : ''}`}
              placeholder="email@exemplo.com"
              aria-describedby={errosCampos.email ? 'erro-email' : undefined}
            />
            {errosCampos.email && <span id="erro-email" className="gs-form-erro">{errosCampos.email}</span>}
          </div>

          <div className="gs-form-field">
            <label htmlFor="cpf" className="gs-form-label">CPF *</label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              value={formatarCpf(campos.cpf)}
              onChange={handleChange}
              className={`gs-modal-input ${errosCampos.cpf ? 'gs-modal-input--erro' : ''}`}
              placeholder="000.000.000-00"
              aria-describedby={errosCampos.cpf ? 'erro-cpf' : undefined}
            />
            {errosCampos.cpf && <span id="erro-cpf" className="gs-form-erro">{errosCampos.cpf}</span>}
          </div>

          <div className="gs-form-field">
            <label htmlFor="data_nascimento" className="gs-form-label">Data de nascimento *</label>
            <input
              id="data_nascimento"
              name="data_nascimento"
              type="date"
              value={campos.data_nascimento}
              onChange={handleChange}
              className={`gs-modal-input ${errosCampos.data_nascimento ? 'gs-modal-input--erro' : ''}`}
              aria-describedby={errosCampos.data_nascimento ? 'erro-data_nascimento' : undefined}
            />
            {errosCampos.data_nascimento && (
              <span id="erro-data_nascimento" className="gs-form-erro">{errosCampos.data_nascimento}</span>
            )}
          </div>

          <div className="gs-form-field">
            <label htmlFor="password" className="gs-form-label">
              Senha {usuarioParaEditar ? '(deixe em branco para manter)' : '*'}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={campos.password}
              onChange={handleChange}
              className={`gs-modal-input ${errosCampos.password ? 'gs-modal-input--erro' : ''}`}
              placeholder={usuarioParaEditar ? 'Nova senha (opcional)' : 'Senha'}
              aria-describedby={errosCampos.password ? 'erro-password' : undefined}
            />
            {errosCampos.password && <span id="erro-password" className="gs-form-erro">{errosCampos.password}</span>}
          </div>

          <div className="gs-modal-actions">
            <button className="gs-modal-cancel" onClick={onCancelar}>
              Cancelar
            </button>
            <button className="gs-modal-confirm" onClick={handleSubmit}>
              {usuarioParaEditar ? 'Salvar alterações' : 'Criar'}
            </button>
          </div>
        </div>
      </div>
    );
  }