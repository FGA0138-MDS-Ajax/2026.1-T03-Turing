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

// Envia uma denúncia sobre uma mensagem do fórum
export const criarDenuncia = (forumId, motivo, mensagem) =>
  api.post('/api/interacoes/denuncias/', { forum: forumId, motivo, mensagem });

// Busca o fórum de um conteúdo específico
export const buscarForumPorConteudo = (conteudoId) =>
  api.get('/api/interacoes/foruns/', { params: { conteudo_id: conteudoId } });

// Cria uma pergunta no fórum (usado pelo aluno)
export const criarMensagem = (forumId, texto) =>
  api.post('/api/interacoes/mensagens/', { forum: forumId, texto });