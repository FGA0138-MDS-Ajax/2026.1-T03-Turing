import api from './api';

// Conteúdos nos quais o aluno autenticado está matriculado
export const listarMeusConteudos = async () => {
  const response = await api.get('/api/matriculas/');
  const data = Array.isArray(response.data) ? response.data : [];
  const conteudos = data.map((matricula) => ({
    id: matricula.conteudo,
    matricula_id: matricula.id,
    titulo: matricula.conteudo_detalhes?.nome,
    descricao: matricula.conteudo_detalhes?.descricao,
    status: matricula.conteudo_detalhes?.status,
    disciplina_id: matricula.disciplina_id,
  }));
  return { ...response, data: conteudos };
};

// Conteúdos disponíveis para inscrição (ativos e não matriculados)
export const listarConteudosDisponiveis = () =>
  api.get('/api/disciplinas/conteudos/disponiveis/');
