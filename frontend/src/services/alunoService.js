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
// Estratégia: busca disciplinas → conteúdos por disciplina → subtrai matriculados
export const listarConteudosDisponiveis = async () => {
  const [disciplinasRes, matriculasRes] = await Promise.all([
    api.get('/api/disciplinas/'),
    api.get('/api/matriculas/'),
  ]);

  const disciplinas = Array.isArray(disciplinasRes.data) ? disciplinasRes.data : [];
  const matriculas = Array.isArray(matriculasRes.data) ? matriculasRes.data : [];

  // IDs dos conteúdos que o aluno já está matriculado
  const idsMatriculados = new Set(matriculas.map((m) => m.conteudo));

  // Busca conteúdos de todas as disciplinas em paralelo
  const conteudosPorDisciplina = await Promise.all(
    disciplinas.map((d) =>
      api.get(`/api/disciplinas/${d.id}/conteudos/`).then((res) => ({
        disciplina: d,
        conteudos: Array.isArray(res.data) ? res.data : [],
      }))
    )
  );

  // Junta tudo, filtra ativos e não matriculados, injeta nome da disciplina
  const disponiveis = conteudosPorDisciplina.flatMap(({ disciplina, conteudos }) =>
    conteudos
      .filter((c) => c.status === 'ativo' && !idsMatriculados.has(c.id))
      .map((c) => ({ ...c, disciplina_nome: disciplina.nome, disciplina_id: disciplina.id }))
  );

  return disponiveis;
};
