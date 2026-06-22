import api from './api';

// ─── Disciplinas ───────────────────────────────────────────────
export const listarDisciplinas = () =>
  api.get('/api/disciplinas/');

export const buscarDisciplina = (id) =>
  api.get(`/api/disciplinas/${id}/`);

export const criarDisciplina = (dados) =>
  api.post('/api/disciplinas/', dados);

export const editarDisciplina = (id, dados) =>
  api.patch(`/api/disciplinas/${id}/`, dados);

export const deletarDisciplina = (id) =>
  api.delete(`/api/disciplinas/${id}/`);

// ─── Conteúdos ─────────────────────────────────────────────────
export const listarConteudos = () =>
  api.get('/api/disciplinas/conteudos/');

export const listarConteudosPorDisciplina = (disciplinaId) =>
  api.get(`/api/disciplinas/conteudos/?disciplina=${disciplinaId}`);

export const buscarConteudo = (id) =>
  api.get(`/api/disciplinas/conteudos/${id}/`);

export const criarConteudo = (dados) =>
  api.post('/api/disciplinas/conteudos/', dados);

export const editarConteudo = (id, dados) =>
  api.patch(`/api/disciplinas/conteudos/${id}/`, dados);

export const deletarConteudo = (id) =>
  api.delete(`/api/disciplinas/conteudos/${id}/`);

export const alocarProfessorConteudo = (conteudoId, professoresIds) =>
  api.patch(`/api/disciplinas/conteudos/${conteudoId}/`, { professores: professoresIds });

// ─── Professores aprovados (para dropdown) ─────────────────────
export const listarProfessoresAprovados = () =>
  api.get('/api/usuarios/professores/');

// ─── Matrículas e Alunos ───────────────────────────────────────
export const listarAlunos = () =>
  api.get('/api/usuarios/alunos/');

export const listarMatriculas = () =>
  api.get('/api/matriculas/');

export const criarMatricula = (dados) =>
  api.post('/api/matriculas/', dados);

export const deletarMatricula = (id) =>
  api.delete(`/api/matriculas/${id}/`);

// ─── Materiais ─────────────────────────────────────────────────
export const listarMateriais = () =>
  api.get('/api/disciplinas/materiais/');

export const criarMaterial = (formData) =>
  api.post('/api/disciplinas/materiais/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const editarMaterial = (id, formData) =>
  api.patch(`/api/disciplinas/materiais/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deletarMaterial = (id) =>
  api.delete(`/api/disciplinas/materiais/${id}/`);

export const listarMinhasMensagens = () =>
  api.get('/api/interacoes/mensagens/');