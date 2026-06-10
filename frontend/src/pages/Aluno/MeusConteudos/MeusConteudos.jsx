import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { listarMeusConteudos } from '../../../services/alunoService';

export function MeusConteudos() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const fetchConteudos = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const response = await listarMeusConteudos();
      const data = Array.isArray(response.data) ? response.data : [];
      setConteudos(data);
    } catch (err) {
      if (err.response?.status === 401) {
        // interceptor do api.js já redireciona para /login automaticamente
        return;
      }
      setErro('Não foi possível carregar seus conteúdos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConteudos();
  }, [fetchConteudos]);

  // Redireciona para a página do conteúdo específico passando o ID
  const handleAcessarConteudo = (conteudo) => {
    const id = conteudo.conteudo_id ?? conteudo.id;
    navigate(`/aluno/conteudos/${id}`);
  };

  // Redireciona para a listagem geral de conteúdos (onde o aluno se inscreve)
  const handleInscrever = () => {
    navigate('/aluno/explorar');
  };

  return (
    <div>
      {/* aq é contigo evagelista */}
      {/* Props: user, loading, erro, conteudos, fetchConteudos, handleAcessarConteudo, handleInscrever */}
    </div>
  );
}
