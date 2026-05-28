import {useState, useEffect} from 'react';
//import styles from './AdminComponents.module.css';

//Componentes reutilizáveis para as páginas de administração de usuários (professores e alunos)

//toast de feedback para ações de CRUD
export function Toast({ toast}) {
    if (!toast) return null;
    return(
        <div className={`${styles.toast} ${styles[`toast--${toast.tipo}`]}`}>
            <span>{toast.mensagem}</span>
        </div>
    );
}

//modal de confirmação de delete

export function ModalConfirmacao({ aberto, nomeUsuario, onConfirmar, onCancelar }) {
  if (!aberto) return null;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div className={styles.modal}>
        <h2 id="modal-titulo" className={styles.modal__titulo}>Confirmar exclusão</h2>
        <p className={styles.modal__texto}>
          Tem certeza que deseja excluir <strong>{nomeUsuario}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className={styles.modal__acoes}>
          <button className={styles.btn__cancelar} onClick={onCancelar}>
            Cancelar
          </button>
          <button className={styles.btn__deletar} onClick={onConfirmar}>
            Confirmar exclusão
          </button>
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
    if (!campos.email.trim()) erros.email = 'E-mail é obrigatório';
    if (!campos.cpf.trim()) erros.cpf = 'CPF é obrigatório';
    if (!campos.data_nascimento) erros.data_nascimento = 'Data de nascimento é obrigatória';
    if (!usuarioParaEditar && !campos.password.trim()) erros.password = 'Senha é obrigatória';
    setErrosCampos(erros);
    return Object.keys(erros).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
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
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="form-titulo">
      <div className={styles.modal}>
        <h2 id="form-titulo" className={styles.modal__titulo}>{titulo}</h2>

        <div className={styles.form__campo}>
          <label htmlFor="nome" className={styles.form__label}>Nome completo *</label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={campos.nome}
            onChange={handleChange}
            className={`${styles.form__input} ${errosCampos.nome ? styles['form__input--erro'] : ''}`}
            placeholder="Nome completo"
            aria-describedby={errosCampos.nome ? 'erro-nome' : undefined}
          />
          {errosCampos.nome && <span id="erro-nome" className={styles.form__erro}>{errosCampos.nome}</span>}
        </div>

        <div className={styles.form__campo}>
          <label htmlFor="email" className={styles.form__label}>E-mail *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={campos.email}
            onChange={handleChange}
            className={`${styles.form__input} ${errosCampos.email ? styles['form__input--erro'] : ''}`}
            placeholder="email@exemplo.com"
            aria-describedby={errosCampos.email ? 'erro-email' : undefined}
          />
          {errosCampos.email && <span id="erro-email" className={styles.form__erro}>{errosCampos.email}</span>}
        </div>

        <div className={styles.form__campo}>
          <label htmlFor="cpf" className={styles.form__label}>CPF *</label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            value={campos.cpf}
            onChange={handleChange}
            maxLength={11}
            className={`${styles.form__input} ${errosCampos.cpf ? styles['form__input--erro'] : ''}`}
            placeholder="Somente números (11 dígitos)"
            aria-describedby={errosCampos.cpf ? 'erro-cpf' : undefined}
          />
          {errosCampos.cpf && <span id="erro-cpf" className={styles.form__erro}>{errosCampos.cpf}</span>}
        </div>

        <div className={styles.form__campo}>
          <label htmlFor="data_nascimento" className={styles.form__label}>Data de nascimento *</label>
          <input
            id="data_nascimento"
            name="data_nascimento"
            type="date"
            value={campos.data_nascimento}
            onChange={handleChange}
            className={`${styles.form__input} ${errosCampos.data_nascimento ? styles['form__input--erro'] : ''}`}
            aria-describedby={errosCampos.data_nascimento ? 'erro-nasc' : undefined}
          />
          {errosCampos.data_nascimento && <span id="erro-nasc" className={styles.form__erro}>{errosCampos.data_nascimento}</span>}
        </div>

        <div className={styles.form__campo}>
          <label htmlFor="password" className={styles.form__label}>
            Senha {usuarioParaEditar ? '(deixe em branco para manter)' : '*'}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={campos.password}
            onChange={handleChange}
            className={`${styles.form__input} ${errosCampos.password ? styles['form__input--erro'] : ''}`}
            placeholder={usuarioParaEditar ? 'Nova senha (opcional)' : 'Senha'}
            aria-describedby={errosCampos.password ? 'erro-pass' : undefined}
          />
          {errosCampos.password && <span id="erro-pass" className={styles.form__erro}>{errosCampos.password}</span>}
        </div>

        <div className={styles.modal__acoes}>
          <button className={styles.btn__cancelar} onClick={onCancelar}>
            Cancelar
          </button>
          <button className={styles.btn__salvar} onClick={handleSubmit}>
            {usuarioParaEditar ? 'Salvar alterações' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  );
}