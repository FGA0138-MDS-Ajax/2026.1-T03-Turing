import { useState, useEffect, useMemo, useCallback } from 'react';
import { listarForuns, listarMensagensDoForum, responderPergunta as responderPerguntaAPI } from '../services/forumService';

export function useForum(conteudoId) {
  const [forumId, setForumId] = useState(null);
  const [mensagens, setMensagens] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [perguntaSelecionadaId, setPerguntaSelecionadaId] = useState(null);

  const [filtroStatus, setFiltroStatus] = useState(null); // null | 'respondida' | 'aguardando'
  const [busca, setBusca] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  // 1. Resolve o forumId encontrando, entre os fóruns do professor, o que pertence a este conteúdo
  const fetchDados = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const forunsRes = await listarForuns();
      const foruns = Array.isArray(forunsRes.data)
        ? forunsRes.data
        : forunsRes.data?.results ?? [];

      const forumDoConteudo = foruns.find(
        (f) => String(f.conteudo) === String(conteudoId)
      );

      if (!forumDoConteudo) {
        setErro('Este conteúdo ainda não possui um fórum associado.');
        setMensagens([]);
        return;
      }

      const idDoForum = forumDoConteudo.id;
      setForumId(idDoForum);

      const mensagensRes = await listarMensagensDoForum(idDoForum);
      // Trata tanto array puro quanto resposta paginada (DRF padrão: { results: [...] })
      const dados = Array.isArray(mensagensRes.data)
        ? mensagensRes.data
        : mensagensRes.data?.results ?? [];
      setMensagens(dados);
    } catch (err) {
      if (err.response?.status === 401) {
        return;
      }
      setErro('Não foi possível carregar o fórum. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [conteudoId]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  // 2. Deriva perguntas (resposta_para === null) e respostas, calcula status de cada pergunta
  const perguntasComStatus = useMemo(() => {
    const perguntas = mensagens.filter((m) => m.resposta_para === null);
    const respostas = mensagens.filter((m) => m.resposta_para !== null);

    return perguntas.map((pergunta) => {
      const respostaDoProfessor = respostas.find(
        (r) => r.resposta_para === pergunta.id
      );
      return {
        ...pergunta,
        status: respostaDoProfessor ? 'respondida' : 'aguardando',
        resposta: respostaDoProfessor ?? null,
      };
    });
  }, [mensagens]);

  // 3. Aplica busca (texto) e filtro de status no front
  const perguntasFiltradas = useMemo(() => {
    let resultado = perguntasComStatus;

    if (filtroStatus) {
      resultado = resultado.filter((p) => p.status === filtroStatus);
    }

    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      resultado = resultado.filter((p) =>
        p.texto?.toLowerCase().includes(termo)
      );
    }

    return resultado.sort(
      (a, b) => new Date(b.data_create) - new Date(a.data_create)
    );
  }, [perguntasComStatus, filtroStatus, busca]);

  const perguntaSelecionada = useMemo(
    () => perguntasComStatus.find((p) => p.id === perguntaSelecionadaId) ?? null,
    [perguntasComStatus, perguntaSelecionadaId]
  );

  // 4. Envio de resposta do professor
  const handleResponder = useCallback(
    async (texto) => {
      if (!perguntaSelecionadaId || !forumId) return;
      if (!texto?.trim()) return;

      setEnviando(true);
      setErroEnvio(null);
      try {
        const res = await responderPerguntaAPI(forumId, perguntaSelecionadaId, texto.trim());
        // Atualiza localmente sem recarregar a página/lista inteira
        setMensagens((prev) => [...prev, res.data]);
      } catch (err) {
        if (err.response?.status === 401) {
          return;
        }
        setErroEnvio('Não foi possível enviar a resposta. Tente novamente.');
      } finally {
        setEnviando(false);
      }
    },
    [perguntaSelecionadaId, forumId]
  );

  return {
    loading,
    erro,
    perguntas: perguntasFiltradas,
    perguntaSelecionada,
    selecionarPergunta: setPerguntaSelecionadaId,
    filtroStatus,
    setFiltroStatus,
    busca,
    setBusca,
    enviando,
    erroEnvio,
    handleResponder,
    refetch: fetchDados,
  };
}