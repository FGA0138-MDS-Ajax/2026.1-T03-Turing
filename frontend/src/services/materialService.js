import api from "./api";

export const listarMateriais = () => {
  return api.get("/api/disciplinas/materiais/");
};

export const buscarMaterial = (id) => {
  return api.get(`/api/disciplinas/materiais/${id}/`);
};

export const listarMateriaisPorConteudo = (conteudoId) => {
  return api.get(
    `/api/disciplinas/materiais/?conteudo=${conteudoId}`
  );
};