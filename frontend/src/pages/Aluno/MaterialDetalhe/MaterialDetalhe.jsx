import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buscarMaterial } from "../../../services/materialService";
import "./MaterialDetalhe.css";

export default function MaterialDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarMaterial();
  }, [id]);

  const carregarMaterial = async () => {
    try {
      setLoading(true);

      const response = await buscarMaterial(id);

      setMaterial(response.data);
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

      if (error.response?.status === 404) {
        setErro("Material não encontrado.");
        return;
      }

      setErro("Erro ao carregar material.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Carregando material...</p>;
  }

  if (erro) {
    return (
      <div>
        <p>{erro}</p>

        <button onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="material-detalhe">
      <button
        className="btn-voltar"
        onClick={() => navigate(-1)}
      >
        ← Voltar
      </button>

      <h1>{material.nome}</h1>

      <p>Tipo: {material.tipo}</p>

      {material.link && (
        <div>
          <a
            href={material.link}
            target="_blank"
            rel="noreferrer"
          >
            Abrir Link
          </a>
        </div>
      )}

      {material.arquivo && (
        <div>
          <a
            href={material.arquivo}
            target="_blank"
            rel="noreferrer"
          >
            Download do Arquivo
          </a>
        </div>
      )}
    </div>
  );
}