import { useState, useEffect, useCallback } from 'react';
import {
  buscarForumDoConteudo,
  listarMensagensDoForum,
  criarMensagem,
} from '../services/disciplinasService';

export function useForumConteudo(conteudoId) {
  const [forumId, setForumId]       = useState(null);
  const [mensagens, setMensagens]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [erro, setErro]             = useState(null);
  const [enviando, setEnviando]     = useState(false);
  const [erroEnvio, setErroEnvio]   = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const forumRes = await buscarForumDoConteudo(conteudoId);
      const foruns = Array.isArray(forumRes.data) ? forumRes.data : [];

      const forum = foruns.find(f => String(f.conteudo) === String(conteudoId));

      if (!forum) {
        setErro('Fórum não encontrado para este conteúdo.');
        return;
      }

      setForumId(forum.id);

      const mensagensRes = await listarMensagensDoForum(forum.id);
      setMensagens(Array.isArray(mensagensRes.data) ? mensagensRes.data : []);
    } catch (err) {
      console.error(err);
      setErro('Não foi possível carregar o fórum. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [conteudoId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const enviarPergunta = useCallback(async (texto) => {
    if (!forumId) return false;
    setEnviando(true);
    setErroEnvio(null);
    try {
      await criarMensagem({ forum: forumId, texto });
      await carregar(); 
      return true;
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.texto?.[0]
        || err.response?.data?.detail
        || 'Erro ao enviar pergunta.';
      setErroEnvio(msg);
      return false;
    } finally {
      setEnviando(false);
    }
  }, [forumId, carregar]);

  const perguntas = mensagens.filter(m => m.resposta_para === null);
  const respostasMap = mensagens.reduce((acc, m) => {
    if (m.resposta_para !== null) {
      if (!acc[m.resposta_para]) acc[m.resposta_para] = [];
      acc[m.resposta_para].push(m);
    }
    return acc;
  }, {});

  return {
    forumId,
    perguntas,
    respostasMap,
    loading,
    erro,
    refetch: carregar,
    enviarPergunta,
    enviando,
    erroEnvio,
  };
}