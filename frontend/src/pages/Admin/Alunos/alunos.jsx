import { useState } from 'react';
import { useGerenciamentoUsuarios } from '../../../hooks/useGerenciamentoUsuarios';
import {
  listarAlunos,
  criarAluno,
  editarAluno,
  deletarAluno,
} from '../../../services/usuariosService';
import {
  Toast,
  ModalConfirmacao,
  ModalFormulario,
} from '../../../components/AdminComponents/AdminComponents';
import styles from './Alunos.module.css';

// card do aluno

function AlunoCard({ aluno, onEditar, onDeletar }) {
  const { perfil } = aluno;
  const iniciais = perfil.nome
    ? perfil.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '?';

  return (
    <div className={styles.card}>
      <div className={styles.card__avatar}>{iniciais}</div>
      <div className={styles.card__info}>
        <span className={styles.card__nome}>{perfil.nome}</span>
        <span className={styles.card__detalhe}>{perfil.email}</span>
        <span className={`${styles.card__status} ${styles['card__status--ativo']}`}>
          status - ativo
        </span>
      </div>
      <div className={styles.card__acoes}>
        <button
          className={styles.btn__editar}
          onClick={() => onEditar(aluno)}
          aria-label={`Editar aluno ${perfil.nome}`}
        >
          Editar
        </button>
        <button
          className={styles.btn__deletar}
          onClick={() => onDeletar(aluno)}
          aria-label={`Deletar aluno ${perfil.nome}`}
        >
          Deletar
        </button>
      </div>
    </div>
  );
}

// Página principal de gerenciamento de alunos

export default function Alunos() {
  const { usuarios, loading, erro, toast, handleCriar, handleEditar, handleDeletar } =
    useGerenciamentoUsuarios({
      listar: listarAlunos,
      criar: criarAluno,
      editar: editarAluno,
      deletar: deletarAluno,
    });

  const [busca, setBusca] = useState('');
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [alunoParaEditar, setAlunoParaEditar] = useState(null);
  const [confirmacao, setConfirmacao] = useState({ aberto: false, aluno: null });

  const alunosFiltrados = usuarios.filter((a) => {
    const termo = busca.toLowerCase();
    return (
      a.perfil.nome.toLowerCase().includes(termo) ||
      a.perfil.email.toLowerCase().includes(termo)
    );
  });

  // Funções para abrir/fechar modais e lidar com ações de criar, editar e deletar

  const abrirCriar = () => {
    setAlunoParaEditar(null);
    setModalFormAberto(true);
  };

  const abrirEditar = (aluno) => {
    setAlunoParaEditar(aluno);
    setModalFormAberto(true);
  };

  const abrirConfirmacaoDeletar = (aluno) => {
    setConfirmacao({ aberto: true, aluno });
  };

  const fecharModais = () => {
    setModalFormAberto(false);
    setConfirmacao({ aberto: false, aluno: null });
  };

  const salvarFormulario = async (payload) => {
    let ok;
    if (alunoParaEditar) {
      ok = await handleEditar(alunoParaEditar.id, payload);
    } else {
      ok = await handleCriar(payload);
    }
    if (ok) fecharModais();
  };

  const confirmarDeletar = async () => {
    const ok = await handleDeletar(confirmacao.aluno.id);
    if (ok) fecharModais();
  };

  // Renderização da página com cabeçalho, barra de busca, lista de alunos e modais

  return (
    <div className={styles.pagina}>

      <div className={styles.cabecalho}>
        <div>
          <h1 className={styles.cabecalho__titulo}>Alunos ativos</h1>
        </div>
      </div>

      <section className={styles.bloco} aria-label="Listar alunos">
        <h2 className={styles.bloco__titulo}>Listar alunos</h2>

        <div className={styles.barra}>
          <div className={styles.barra__busca}>
            <svg className={styles.barra__icone} viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar aluno..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.barra__input}
              aria-label="Buscar aluno"
            />
          </div>
          <button className={styles.btn__adicionar} onClick={abrirCriar}>
            + Adicionar aluno
          </button>
        </div>

        {/* Estados de carregamento, erro e vazio */}
        {loading && <p className={styles.estado}>Carregando...</p>}
        {!loading && erro && <p className={`${styles.estado} ${styles['estado--erro']}`}>{erro}</p>}
        {!loading && !erro && alunosFiltrados.length === 0 && (
          <p className={styles.estado}>Nenhum aluno encontrado.</p>
        )}

        <div className={styles.lista} role="list">
          {alunosFiltrados.map((aluno) => (
            <AlunoCard
              key={aluno.id}
              aluno={aluno}
              onEditar={abrirEditar}
              onDeletar={abrirConfirmacaoDeletar}
            />
          ))}
        </div>
      </section>

      <ModalFormulario
        aberto={modalFormAberto}
        usuarioParaEditar={alunoParaEditar}
        titulo={alunoParaEditar ? 'Editar aluno' : 'Adicionar aluno'}
        onSalvar={salvarFormulario}
        onCancelar={fecharModais}
      />

      <ModalConfirmacao
        aberto={confirmacao.aberto}
        nomeUsuario={confirmacao.aluno?.perfil?.nome}
        onConfirmar={confirmarDeletar}
        onCancelar={fecharModais}
      />

      <Toast toast={toast} />
    </div>
  );
}