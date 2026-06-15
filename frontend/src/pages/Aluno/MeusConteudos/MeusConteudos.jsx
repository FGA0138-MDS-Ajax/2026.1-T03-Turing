import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { listarMeusConteudos } from '../../../services/alunoService';

import './MeusConteudos.css';

const AREA_COLOR_MAP = {
  matematica: '#4f46e5',
  fisica:     '#0891b2',
  quimica:    '#7c3aed',
  biologia:   '#16a34a',
  historia:   '#b45309',
  geografia:  '#0f766e',
  portugues:  '#be185d',
  ingles:     '#1d4ed8',
  filosofia:  '#92400e',
  sociologia: '#065f46',
  default:    '#6b7280',
};

function getAreaColor(area = '') {
  const key = area.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return AREA_COLOR_MAP[key] || AREA_COLOR_MAP.default;
}

function ConteudoCardSkeleton() {
  return (
    <div className="mc-card" aria-hidden="true">
      <div className="mc-skeleton-accent" />
      <div className="mc-card-body">
        <div className="mc-skeleton-top">
          <div className="mc-skeleton-texts">
            <div className="mc-skeleton-line mc-skeleton-title" />
            <div className="mc-skeleton-line mc-skeleton-prof" />
          </div>
          <div className="mc-skeleton-icon-box" />
        </div>
        <div className="mc-skeleton-infos">
          <div className="mc-skeleton-line mc-skeleton-info" />
          <div className="mc-skeleton-line mc-skeleton-info mc-skeleton-info--short" />
        </div>
      </div>
      <div className="mc-card-footer">
        <div className="mc-skeleton-btn" />
      </div>
    </div>
  );
}

function ConteudoCard({ conteudo, onAcessar }) {
  // Puxa estritamente o que vem da API
  const titulo      = conteudo.titulo    || conteudo.nome           || 'Sem título';
  const professor   = conteudo.professor || conteudo.nome_professor || 'Professor não atribuído';
  const area        = conteudo.area      || '';
  const informacoes = conteudo.informacoes || [];
  const icone       = conteudo.icone     || null;
  const color       = getAreaColor(area || titulo);

  return (
    <div className="mc-card">
      <div className="mc-card-accent" style={{ backgroundColor: color }} />
      <div className="mc-card-body">
        <div className="mc-card-top">
          <div className="mc-card-text">
            <h3 className="mc-card-titulo">{titulo}</h3>
            <p className="mc-card-professor">{professor}</p>
          </div>
          <div 
            className="mc-card-icon-box" 
            style={{ backgroundColor: `${color}20`, color: color }} 
            aria-hidden="true"
          >
            {icone || '📚'} 
          </div>
        </div>
        
        {/* Só renderiza a lista se a API realmente enviar o array 'informacoes' com dados */}
        {informacoes.length > 0 && (
          <ul className="mc-card-infos" aria-label="Informações">
            {informacoes.map((info, i) => (
              <li key={i} className="mc-card-info-item">
                <span className="mc-info-icon" aria-hidden="true">{info.icone || '📋'}</span>
                <span>{info.texto}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mc-card-footer">
        <button
          className="mc-btn-acessar"
          onClick={onAcessar}
          aria-label={`Acessar conteúdo de ${titulo}`}
        >
          Acessar Conteúdo
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onInscrever }) {
  return (
    <div className="mc-empty" role="status">
      <span className="mc-empty-icon">📚</span>
      <h2 className="mc-empty-title">Nenhum conteúdo ainda</h2>
      <p className="mc-empty-desc">
        Você ainda não está inscrito em nenhum conteúdo.
        <br />
        Explore os conteúdos disponíveis e comece a aprender!
      </p>
      <button className="mc-btn-explorar" onClick={onInscrever}>
        Explorar conteúdos
      </button>
    </div>
  );
}

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
      <div className="mc-page">
        {/* Props: user, loading, erro, conteudos, fetchConteudos, handleAcessarConteudo, handleInscrever */}

        <div className="mc-header">
          <div>
            <h1 className="mc-title">Meus conteúdos</h1>
            <p className="mc-subtitle">
              Acompanhe seus conteúdos e dê continuidade aos seus estudos.
            </p>
          </div>
          <button className="mc-btn-inscrever" onClick={handleInscrever}>
            + Novo conteúdo
          </button>
        </div>

        {erro && (
          <div className="mc-error" role="alert">
            <span className="mc-error-icon">⚠</span>
            <span className="mc-error-msg">{erro}</span>
            <button className="mc-btn-retry" onClick={fetchConteudos}>
              Tentar novamente
            </button>
          </div>
        )}

        {loading && (
          <div className="mc-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <ConteudoCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !erro && conteudos.length === 0 && (
          <EmptyState onInscrever={handleInscrever} />
        )}

        {!loading && !erro && conteudos.length > 0 && (
          <div className="mc-grid">
            {conteudos.map((c) => (
              <ConteudoCard
                key={c.conteudo_id ?? c.id}
                conteudo={c}
                onAcessar={() => handleAcessarConteudo(c)}
              />
            ))}
          </div>
        )}

      </div>
  );
}