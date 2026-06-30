import api from './api';

// gerenciamento professores

export const listarProfessores = () =>
  api.get('/api/usuarios/professores/');

export const buscarProfessor = (id) =>
  api.get(`/api/usuarios/professores/${id}/`);

// Rota atualizada para a issue
export const criarProfessor = (dados) =>
  api.post('/api/usuarios/professores/create_by_admin/', dados);

export const editarProfessor = (id, dados) =>
  api.patch(`/api/usuarios/professores/${id}/`, dados);

export const deletarProfessor = (id) =>
  api.delete(`/api/usuarios/professores/${id}/`);

// alunos

export const listarAlunos = () =>
  api.get('/api/usuarios/alunos/');

export const buscarAluno = (id) =>
  api.get(`/api/usuarios/alunos/${id}/`);

export const criarAluno = (dados) =>
  api.post('/api/usuarios/alunos/', dados);

export const editarAluno = (id, dados) =>
  api.patch(`/api/usuarios/alunos/${id}/`, dados);

export const deletarAluno = (id) =>
  api.delete(`/api/usuarios/alunos/${id}/`);