import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buscarConteudo,
  listarMateriaisDoConteudo,
  desinscreverDoConteudo,
  listarProfessores,
  buscarDisciplina,
} from '../services/conteudoService';
import { listarMeusConteudos } from '../services/alunoService';

export function useConteudoEspecifico(conteudoId) {
  const navigate = useNavigate();

  const [conteudo, setConteudo] = useState(null);
  const [disciplina, setDisciplina] = useState(null);
  const [professores, setProfessores] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [matriculaId, setMatriculaId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [desinscrevendo, setDesinscrevendo] = useState(false);
  const [erroDesinscricao, setErroDesinscricao] = useState(null);

  const fetchDados = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const [conteudoRes, materiaisRes, matriculasRes, professoresRes] = await Promise.all([
        buscarConteudo(conteudoId),
        listarMateriaisDoConteudo(conteudoId),
        listarMeusConteudos(),
        listarProfessores(),
      ]);

      const conteudoData = conteudoRes.data;
      setConteudo(conteudoData);
      setMateriais(Array.isArray(materiaisRes.data) ? materiaisRes.data : []);

      // Resolve nomes dos professores a partir dos IDs em conteudo.professores
      const todosProfessores = Array.isArray(professoresRes.data) ? professoresRes.data : [];
      const idsProfessores = Array.isArray(conteudoData.professores) ? conteudoData.professores : [];
      const professoresDoConteudo = todosProfessores
        .filter((p) => idsProfessores.includes(p.id))
        .map((p) => ({ id: p.id, nome: p.perfil?.nome ?? 'Professor' }));
      setProfessores(professoresDoConteudo);

      // Busca o nome da disciplina para o breadcrumb
      if (conteudoData.disciplina) {
        try {
          const disciplinaRes = await buscarDisciplina(conteudoData.disciplina);
          setDisciplina(disciplinaRes.data);
        } catch {
          setDisciplina(null);
        }
      }

      // Encontra a matrícula correspondente a este conteúdo
      const minhasMatriculas = Array.isArray(matriculasRes.data) ? matriculasRes.data : [];
      const matricula = minhasMatriculas.find(
        (m) => String(m.id) === String(conteudoId)
      );
      setMatriculaId(matricula?.matricula_id ?? null);
    } catch (err) {
      if (err.response?.status === 401) {
        return;
      }
      setErro('Não foi possível carregar o conteúdo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [conteudoId]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const handleDesinscrever = useCallback(async () => {
    if (!matriculaId) {
      setErroDesinscricao('Matrícula não encontrada.');
      return;
    }

    const confirmado = window.confirm(
      'Tem certeza que deseja se desinscrever deste conteúdo? Essa ação não pode ser desfeita.'
    );
    if (!confirmado) return;

    setDesinscrevendo(true);
    setErroDesinscricao(null);
    try {
      await desinscreverDoConteudo(matriculaId);
      navigate('/aluno/conteudos');
    } catch (err) {
      if (err.response?.status === 401) {
        return;
      }
      setErroDesinscricao('Não foi possível concluir a desinscrição. Tente novamente.');
    } finally {
      setDesinscrevendo(false);
    }
  }, [matriculaId, navigate]);

  return {
    conteudo,
    disciplina,
    professores,
    materiais,
    loading,
    erro,
    refetch: fetchDados,
    podeDesinscrever: Boolean(matriculaId),
    desinscrevendo,
    erroDesinscricao,
    handleDesinscrever,
  };
}