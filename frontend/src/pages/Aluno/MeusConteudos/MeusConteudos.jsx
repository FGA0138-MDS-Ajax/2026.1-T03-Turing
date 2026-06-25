import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { listarMeusConteudos } from '../../../services/alunoService';
import { listarProfessores, buscarConteudo } from '../../../services/conteudoService';
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
  const titulo      = conteudo.titulo || conteudo.nome || 'Sem título';
  const professor   = conteudo.nome_professor || 'Professor não atribuído';
  const area        = conteudo.area || '';
  
  const informacoesApi = Array.isArray(conteudo.informacoes) ? conteudo.informacoes : [];
  const informacoesExibidas =  informacoesApi.length > 0 
  ? informacoesApi 
  : [
      {
        icone: '📅',
        texto: conteudo.matriculado_em
          ? `Inscrito em: ${new Date(conteudo.matriculado_em).toLocaleDateString('pt-BR')}`
          : 'Data de inscrição indisponível',
      },
      {
        icone: '📊',
        texto: conteudo.status === 'ativo' ? 'Conteúdo ativo' : 'Conteúdo encerrado',
      },
    ];

  const icone       = conteudo.icone || null;
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
        
        {/* Renderiza as informações da API ou o fallback */}
        <ul className="mc-card-infos" aria-label="Informações">
          {informacoesExibidas.map((info, i) => (
            <li key={i} className="mc-card-info-item">
              <span className="mc-info-icon" aria-hidden="true">{info.icone || '📋'}</span>
              <span>{info.texto}</span>
            </li>
          ))}
        </ul>
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
      // 1. Busca a lista resumida e os professores gerais
      const [responseConteudos, responseProfessores] = await Promise.all([
        listarMeusConteudos(),
        listarProfessores()
      ]);

      const dataConteudos = Array.isArray(responseConteudos.data) ? responseConteudos.data : [];
      const dataProfessores = Array.isArray(responseProfessores.data) ? responseProfessores.data : [];

      // 2. Para CADA conteúdo resumido, vamos buscar os detalhes completos na API
      const conteudosCompletos = await Promise.all(
        dataConteudos.map(async (conteudoResumido) => {
          let nomeResolvido = 'Professor não atribuído';
          
          try {
            // Busca o detalhe usando o ID correto
            const idParaBuscar = conteudoResumido.conteudo_id ?? conteudoResumido.id;
            const detalheRes = await buscarConteudo(idParaBuscar);
            const detalhe = detalheRes.data;

            // Agora sim, o 'detalhe' tem a chave .professores! Vamos cruzar os dados:
            if (Array.isArray(detalhe.professores) && detalhe.professores.length > 0) {
              const profs = dataProfessores
                .filter((p) => detalhe.professores.includes(p.id))
                .map((p) => p.perfil?.nome ?? 'Professor');

              if (profs.length > 0) {
                nomeResolvido = profs.join(', ');
              }
            }
          } catch (error) {
            console.error(`Erro ao buscar detalhes do conteudo ${conteudoResumido.id}`, error);
          }

          // Junta o resumo com o nome do professor encontrado
          return {
            ...conteudoResumido,
            nome_professor: nomeResolvido
          };
        })
      );

      setConteudos(conteudosCompletos);
    } catch (err) {
      if (err.response?.status === 401) return;
      setErro('Não foi possível carregar seus conteúdos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConteudos();
  }, [fetchConteudos]);

  const handleAcessarConteudo = (conteudo) => {
    const id = conteudo.conteudo_id ?? conteudo.id;
    navigate(`/aluno/conteudos/${id}`);
  };

  const handleInscrever = () => {
    navigate('/aluno/explorar');
  };

  return (
      <div className="mc-page">
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