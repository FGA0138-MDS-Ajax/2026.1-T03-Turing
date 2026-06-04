import { useState, useEffect, useCallback } from 'react';
import {
  listarDisciplinas,
  criarDisciplina,
  editarDisciplina,
  deletarDisciplina,
  listarConteudos,
  criarConteudo,
  editarConteudo,
  deletarConteudo,
  alocarProfessorConteudo,
  listarProfessoresAprovados,
  listarAlunos,
  listarMatriculas,
  criarMatricula,
  deletarMatricula,
  listarMateriais,
  criarMaterial,
  editarMaterial,
  deletarMaterial,
} from '../services/disciplinasService';

export function useGerenciamentoDisciplinas() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [conteudos, setConteudos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [toast, setToast] = useState(null);
  const [materiais, setMateriais] = useState([]);

  const carregarMateriais = useCallback(async () => {
    try {
        const { data } = await listarMateriais();
        setMateriais(data);
    } catch { /* silencioso */ }
  }, []);

  const exibirToast = (tipo, mensagem) => {
    setToast({ tipo, mensagem });
    setTimeout(() => setToast(null), 3500);
  };

  const carregarDisciplinas = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const { data } = await listarDisciplinas();
      setDisciplinas(data);
    } catch {
      setErro('Não foi possível carregar as disciplinas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarConteudos = useCallback(async () => {
    try {
      const { data } = await listarConteudos();
      setConteudos(data);
    } catch { /* Silencioso */ }
  }, []);

  const carregarProfessores = useCallback(async () => {
    try {
      const { data } = await listarProfessoresAprovados();
      setProfessores(data);
    } catch { /* Silencioso */ }
  }, []);

  // Carrega os alunos cadastrados e as matrículas ativas do sistema
  const carregarAlunosEMatriculas = useCallback(async () => {
    try {
      const resAlunos = await listarAlunos();
      const resMatriculas = await listarMatriculas();
      setAlunos(resAlunos.data);
      setMatriculas(resMatriculas.data);
    } catch { /* Silencioso */ }
  }, []);

  useEffect(() => {
  carregarDisciplinas();
  carregarConteudos();
  carregarProfessores();
  carregarAlunosEMatriculas();
  carregarMateriais();
  }, [carregarDisciplinas, carregarConteudos, carregarProfessores, carregarAlunosEMatriculas, carregarMateriais]);

  const handleCriarDisciplina = async (dados) => {
    setLoading(true);
    try {
      await criarDisciplina(dados);
      exibirToast('sucesso', 'Disciplina criada com sucesso!');
      await carregarDisciplinas();
      return true;
    } catch (err) {
      const msg = err?.response?.data?.nome?.[0] || err?.response?.data?.detail || 'Erro ao criar disciplina.';
      exibirToast('erro', msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEditarDisciplina = async (id, dados) => {
    setLoading(true);
    try {
      await editarDisciplina(id, dados);
      exibirToast('sucesso', 'Disciplina atualizada com sucesso!');
      await carregarDisciplinas();
      return true;
    } catch {
      exibirToast('erro', 'Erro ao atualizar disciplina.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarDisciplina = async (id) => {
    setLoading(true);
    try {
      await deletarDisciplina(id);
      exibirToast('sucesso', 'Disciplina removida com sucesso!');
      await carregarDisciplinas();
      await carregarConteudos();
      return true;
    } catch {
      exibirToast('erro', 'Erro ao remover disciplina.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCriarConteudo = async (dados) => {
    setLoading(true);
    try {
      await criarConteudo(dados);
      exibirToast('sucesso', 'Conteúdo criado com sucesso!');
      await carregarConteudos();
      return true;
    } catch (err) {
      const msg = err?.response?.data?.nome?.[0] || err?.response?.data?.detail || 'Erro ao criar conteúdo.';
      exibirToast('erro', msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEditarConteudo = async (id, dados) => {
    setLoading(true);
    try {
      await editarConteudo(id, dados);
      exibirToast('sucesso', 'Conteúdo atualizado com sucesso!');
      await carregarConteudos();
      return true;
    } catch {
      exibirToast('erro', 'Erro ao atualizar conteúdo.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarConteudo = async (id) => {
    setLoading(true);
    try {
      await deletarConteudo(id);
      exibirToast('sucesso', 'Conteúdo removido com sucesso!');
      await carregarConteudos();
      return true;
    } catch {
      exibirToast('erro', 'Erro ao remover conteúdo.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAlocarProfessor = async (conteudoId, professoresIds) => {
    setLoading(true);
    try {
      await alocarProfessorConteudo(conteudoId, professoresIds);
      exibirToast('sucesso', 'Professor alocado com sucesso!');
      await carregarConteudos();
      return true;
    } catch {
      exibirToast('erro', 'Erro ao alocar professor.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cria uma nova matrícula associando o aluno ao conteúdo correspondente
  const handleMatricularAluno = async (conteudoId, alunoId) => {
    setLoading(true);
    try {
      await criarMatricula({ conteudo: conteudoId, aluno: alunoId });
      exibirToast('sucesso', 'Aluno matriculado com sucesso!');
      await carregarAlunosEMatriculas();
      return true;
    } catch (err) {
      const msg = err?.response?.data?.non_field_errors?.[0] || err?.response?.data?.conteudo?.[0] || 'Erro ao matricular aluno.';
      exibirToast('erro', msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove o registro de matrícula passando o ID do vínculo
  const handleCancelarMatricula = async (matriculaId) => {
    setLoading(true);
    try {
      await deletarMatricula(matriculaId);
      exibirToast('sucesso', 'Matrícula cancelada com sucesso!');
      await carregarAlunosEMatriculas();
      return true;
    } catch {
      exibirToast('erro', 'Erro ao cancelar matrícula.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const conteudosDaDisciplina = (disciplinaId) =>
    conteudos.filter((c) => c.disciplina === disciplinaId);

  const handleCriarMaterial = async (formData) => {
  setLoading(true);
  try {
    await criarMaterial(formData);
    exibirToast('sucesso', 'Material criado com sucesso!');
    await carregarMateriais();
    return true;
  } catch (err) {
    const msg = err?.response?.data?.detail || 'Erro ao criar material.';
    exibirToast('erro', msg);
    return false;
  } finally {
    setLoading(false);
  }
};

const handleEditarMaterial = async (id, formData) => {
  setLoading(true);
  try {
    await editarMaterial(id, formData);
    exibirToast('sucesso', 'Material atualizado com sucesso!');
    await carregarMateriais();
    return true;
  } catch {
    exibirToast('erro', 'Erro ao atualizar material.');
    return false;
  } finally {
    setLoading(false);
  }
};

const handleDeletarMaterial = async (id) => {
  setLoading(true);
  try {
    await deletarMaterial(id);
    exibirToast('sucesso', 'Material removido com sucesso!');
    await carregarMateriais();
    return true;
  } catch {
    exibirToast('erro', 'Erro ao remover material.');
    return false;
  } finally {
    setLoading(false);
  }
};

  return {
    disciplinas,
    conteudos,
    professores,
    alunos,
    matriculas,
    loading,
    erro,
    toast,
    materiais,
    handleCriarMaterial,
    handleEditarMaterial,
    handleDeletarMaterial,
    handleCriarDisciplina,
    handleEditarDisciplina,
    handleDeletarDisciplina,
    handleCriarConteudo,
    handleEditarConteudo,
    handleDeletarConteudo,
    handleAlocarProfessor,
    handleMatricularAluno,
    handleCancelarMatricula,
    conteudosDaDisciplina,
    recarregar: () => {
      carregarDisciplinas();
      carregarConteudos();
      carregarAlunosEMatriculas();
    },
  };
}