import api from './api';

// Conteúdos nos quais o aluno autenticado está matriculado
export const listarMeusConteudos = () =>
  api.get('/api/matriculas/meus-conteudos/');
