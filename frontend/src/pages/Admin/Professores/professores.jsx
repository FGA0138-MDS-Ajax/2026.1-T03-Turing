import { useState, useEffect } from 'react';
import { useGerenciamentoUsuarios } from '../../../hooks/useGerenciamentoUsuarios';
import {
  listarProfessores,
  criarProfessor,
  editarProfessor,
  deletarProfessor,
} from '../../../services/usuariosService';
import {
  Toast,
  ModalConfirmacao,
  ModalFormulario,
} from '../../../components/AdminComponents/AdminComponents';
import styles from './Professores.module.css';

//Card do professor

function ProfessorCard({ professor, onEditar, onDeletar }) {
  const { id, perfil, curriculo } = professor;
  const iniciais = perfil.nome
    ? perfil.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '?';

  return (
    <div className={styles.card}>
      <div className={styles.card__avatar}>{iniciais}</div>
      <div className={styles.card__info}>
        <span className={styles.card__nome}>{perfil.nome}</span>
        <span className={styles.card__detalhe}>
          {curriculo ? 'Currículo enviado' : 'Currículo vazio'}
        </span>
        <span className={`${styles.card__status} ${styles['card__status--ativo']}`}>
          ativo
        </span>
      </div>
      <div className={styles.card__acoes}>
        <button
          className={styles.btn__editar}
          onClick={() => onEditar(professor)}
          aria-label={`Editar professor ${perfil.nome}`}
        >
          Editar
        </button>
        <button
          className={styles.btn__deletar}
          onClick={() => onDeletar(professor)}
          aria-label={`Deletar professor ${perfil.nome}`}
        >
          Deletar
        </button>
      </div>
    </div>
  );
}

// Página principal de gerenciamento de professores

export default function Professores() {
  const { usuarios, loading, erro, toast, handleCriar, handleEditar, handleDeletar, recarregar } =
    useGerenciamentoUsuarios({
      listar: listarProfessores,
      criar: criarProfessor,
      editar: editarProfessor,
      deletar: deletarProfessor,
    });

  useEffect(() => {
    recarregar();
  }, []);

  const [busca, setBusca] = useState('');
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [professorParaEditar, setProfessorParaEditar] = useState(null);
  const [confirmacao, setConfirmacao] = useState({ aberto: false, professor: null });

// Filtra localmente por nome ou e-mail
  const professoreFiltrados = usuarios.filter((p) => {
    const termo = busca.toLowerCase();
    return (
      p.perfil.nome.toLowerCase().includes(termo) ||
      p.perfil.email.toLowerCase().includes(termo)
    );
  });

  // Ações de abrir/fechar modais e confirmar ações

  const abrirCriar = () => {
    setProfessorParaEditar(null);
    setModalFormAberto(true);
  };

  const abrirEditar = (professor) => {
    setProfessorParaEditar(professor);
    setModalFormAberto(true);
  };

  const abrirConfirmacaoDeletar = (professor) => {
    setConfirmacao({ aberto: true, professor });
  };

  const fecharModais = () => {
    setModalFormAberto(false);
    setConfirmacao({ aberto: false, professor: null });
  };

  const salvarFormulario = async (payload) => {
    let ok;
    if (professorParaEditar) {
      ok = await handleEditar(professorParaEditar.id, payload);
    } else {
      ok = await handleCriar(payload);
    }
    if (ok) fecharModais();
  };

  const confirmarDeletar = async () => {
    const ok = await handleDeletar(confirmacao.professor.id);
    if (ok) fecharModais();
  };

  // Renderização 

  return (
    <div className={styles.pagina}>

      <div className={styles.cabecalho}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#02373a', margin: 0, fontFamily: 'Serif' }}>Gerenciamento de Professores</h1>
        </div>
      </div>

      <section className={styles.bloco} aria-label="Listar professores">
        <h2 className={styles.bloco__titulo}>Listar professores</h2>

        <div className={styles.barra}>
          <div className={styles.barra__busca}>
            <svg className={styles.barra__icone} viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar professor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.barra__input}
              aria-label="Buscar professor"
            />
          </div>

          <button className={styles.btn__adicionar} onClick={abrirCriar}>
            + Adicionar professor
          </button>
        </div>

{/* Estados de carregamento, erro e vazio */}
        {loading && <p className={styles.estado}>Carregando...</p>}
        {!loading && erro && <p className={`${styles.estado} ${styles['estado--erro']}`}>{erro}</p>}
        {!loading && !erro && professoreFiltrados.length === 0 && (
          <p className={styles.estado}>Nenhum professor encontrado.</p>
        )}

        <div className={styles.lista} role="list">
          {professoreFiltrados.map((prof) => (
            <ProfessorCard
              key={prof.id}
              professor={prof}
              onEditar={abrirEditar}
              onDeletar={abrirConfirmacaoDeletar}
            />
          ))}
        </div>
      </section>

{/* Modais de formulário e confirmação, e toast de feedback */}
      <ModalFormulario
        aberto={modalFormAberto}
        usuarioParaEditar={professorParaEditar}
        titulo={professorParaEditar ? 'Editar professor' : 'Adicionar professor'}
        onSalvar={salvarFormulario}
        onCancelar={fecharModais}
      />

      <ModalConfirmacao
        aberto={confirmacao.aberto}
        nomeUsuario={confirmacao.professor?.perfil?.nome}
        onConfirmar={confirmarDeletar}
        onCancelar={fecharModais}
      />

      <Toast toast={toast} />
    </div>
  );
}