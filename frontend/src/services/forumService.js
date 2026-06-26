import api from './api';

// Lista todos os fóruns que o professor tem acesso (sem filtro server-side por conteúdo)
export const listarForuns = () =>
  api.get('/api/interacoes/foruns/');

// Lista todas as mensagens (perguntas e respostas) de um fórum específico
export const listarMensagensDoForum = (forumId) =>
  api.get('/api/interacoes/mensagens/', { params: { forum: forumId } });

// Detalhe de uma mensagem específica (usado se precisarmos buscar uma pergunta isolada)
export const buscarMensagem = (mensagemId) =>
  api.get(`/api/interacoes/mensagens/${mensagemId}/`);

// Envia a resposta do professor: cria uma nova Mensagem com resposta_para apontando pra pergunta
export const responderPergunta = (forumId, perguntaId, texto) =>
  api.post('/api/interacoes/mensagens/', {
    forum: forumId,
    resposta_para: perguntaId,
    texto,
  });