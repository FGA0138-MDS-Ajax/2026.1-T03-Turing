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

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleCriar = async (dados) => {
    setLoading(true);
    try {
      await criar(dados);
      exibirToast('sucesso', 'Usuário criado com sucesso!');
      await carregar();
      return true;
    } catch (err) {
      const mensagem =
        err?.response?.data?.perfil?.email?.[0] ||
        err?.response?.data?.perfil?.cpf?.[0] ||
        'Erro ao criar usuário. Verifique os dados.';
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