import { useState, useEffect, useCallback } from 'react';


 //Hook genérico de gerenciamento de usuários.
 //Recebe as funções de serviço (listar, criar, editar, deletar) como parâmetros,
 
export function useGerenciamentoUsuarios({ listar, criar, editar, deletar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [toast, setToast] = useState(null); // { tipo: 'sucesso'|'erro', mensagem: string }

  const exibirToast = (tipo, mensagem) => {
    setToast({ tipo, mensagem });
    setTimeout(() => setToast(null), 3500);
  };

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const { data } = await listar();
      setUsuarios(data);
    } catch {
      setErro('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [listar]);

  // Carrega os dados ao montar
useEffect(() => {
  carregar();
}, [carregar]);

// Escuta o evento de atualização disparado pelo TeacherReview
useEffect(() => {
  const handler = () => carregar();
  window.addEventListener('professores-atualizados', handler);
  return () => window.removeEventListener('professores-atualizados', handler);
}, [carregar]);

  const handleCriar = async (dados) => {
    setLoading(true);
    try {
      await criar(dados);
      exibirToast('sucesso', 'Usuário criado com sucesso!');
      await carregar();
      return true;
    } catch (err) {
      const erros = err?.response?.data?.perfil;

      let mensagem = 'Erro ao criar usuário. Verifique os dados.';

      if (erros) {
        const primeiroCampo = Object.values(erros)[0];
        if (Array.isArray(primeiroCampo) && primeiroCampo.length > 0) {
          mensagem = primeiroCampo[0];
        }
      }

      exibirToast('erro', mensagem);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = async (id, dados) => {
    setLoading(true);
    try {
      await editar(id, dados);
      exibirToast('sucesso', 'Usuário atualizado com sucesso!');
      await carregar();
      return true;
    } catch {
      exibirToast('erro', 'Erro ao atualizar usuário.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id) => {
    setLoading(true);
    try {
      await deletar(id);
      exibirToast('sucesso', 'Usuário removido com sucesso!');
      await carregar();
      return true;
    } catch {
      exibirToast('erro', 'Erro ao remover usuário.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarios,
    loading,
    erro,
    toast,
    handleCriar,
    handleEditar,
    handleDeletar,
    recarregar: carregar,
  };
}