import api from './api';

// Detalhes de um conteúdo específico
export const buscarConteudo = (id) =>
  api.get(`/api/disciplinas/conteudos/${id}/`);

// Materiais vinculados a um conteúdo
export const listarMateriaisDoConteudo = (conteudoId) =>
  api.get(`/api/disciplinas/materiais/?conteudo=${conteudoId}`);

// Desinscrição do conteúdo (remove a matrícula pelo ID da matrícula)
export const desinscreverDoConteudo = (matriculaId) =>
  api.delete(`/api/matriculas/${matriculaId}/`);

// Lista todos os professores (para resolver nomes a partir dos IDs em conteudo.professores)
export const listarProfessores = () =>
  api.get('/api/usuarios/professores/');

// Detalhes de uma disciplina (para exibir o nome no breadcrumb)
export const buscarDisciplina = (id) =>
  api.get(`/api/disciplinas/${id}/`);