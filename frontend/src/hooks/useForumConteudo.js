import { useState, useEffect, useCallback } from 'react';
import {
  buscarConteudo,
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
      const conteudoRes = await buscarConteudo(conteudoId);
      const forumIdDoConteudo = conteudoRes.data?.forum_id;

      if (!forumIdDoConteudo) {
        setErro('Fórum não encontrado para este conteúdo.');
        setForumId(null);
        setMensagens([]);
        return;
      }

      setForumId(forumIdDoConteudo);

      const mensagensRes = await listarMensagensDoForum(forumIdDoConteudo);
      const mensagensData = Array.isArray(mensagensRes.data)
        ? mensagensRes.data
        : mensagensRes.data?.results ?? [];
      setMensagens(mensagensData);
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

  const enviarPergunta = useCallback(async ({ titulo, texto }) => {
    if (!forumId) return false;
    setEnviando(true);
    setErroEnvio(null);
    try {
      await criarMensagem({ forum: forumId, titulo, texto });
      await carregar();

      return true;
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.titulo?.[0]
        || err.response?.data?.texto?.[0]
        || err.response?.data?.detail
        || 'Erro ao enviar pergunta.';
      setErroEnvio(msg);
      return false;
    } finally {
      setEnviando(false);
    }
  }, [forumId, carregar]);

  const inserirMensagemLocal = useCallback((mensagem) => {
    if (!mensagem?.id) return;

    setMensagens((prev) => {
      if (prev.some((m) => m.id === mensagem.id)) return prev;
      return [...prev, mensagem];
    });
  }, []);

  const perguntas = mensagens
    .filter(m => m.resposta_para === null)
    .sort((a, b) => new Date(b.data_create) - new Date(a.data_create));
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
    inserirMensagemLocal,
  };
}