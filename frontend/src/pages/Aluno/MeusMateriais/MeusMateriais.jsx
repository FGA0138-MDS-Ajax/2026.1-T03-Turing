import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarMateriais } from "../../../services/materialService";

export default function MeusMateriais() {
  const navigate = useNavigate();

  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = async () => {
    try {
      setLoading(true);

      const response = await listarMateriais();

      setMateriais(response.data);
      setErro("");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setErro("Você não possui acesso a este material.");
        return;
      }

      setErro("Erro ao carregar materiais.");
    } finally {
      setLoading(false);
    }
  };

  const abrirMaterial = (materialId) => {
    navigate(`/aluno/materiais/${materialId}`);
  };

  if (loading) {
    return <p>Carregando materiais...</p>;
  }

  if (erro) {
    return <p>{erro}</p>;
  }

  if (materiais.length === 0) {
    return (
      <p>
        Nenhum material disponível para os conteúdos matriculados.
      </p>
    );
  }

  return (
    <div>
      <h1>Meus Materiais</h1>

      {materiais.map((material) => (
        <div key={material.id}>
          <p>{material.nome}</p>

          <button
            onClick={() => abrirMaterial(material.id)}
          >
            Abrir
          </button>
        </div>
      ))}
    </div>
  );
}