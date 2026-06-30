import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForumConteudo } from '../../../hooks/useForumConteudo';
import { useConteudoEspecifico } from '../../../hooks/useConteudoEspecifico';
import ModalPergunta from '../../../components/ModalPergunta';
import ModalDenuncia from '../../../components/ModalDenuncia';
import './ForumConteudo.css';

function formatarData(iso) {
  if (!iso) return '';
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '';

  const dataParte = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(data);

  const horaParte = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(data);

  return `${dataParte} ${horaParte}`;
}

function iniciais(nome) {
  if (!nome) return '?';
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function Avatar({ nome, tipo }) {
  const isProfessor = tipo === 'professor';
  const bg = isProfessor ? '#2F5D62' : '#C07A30';
  const ring = isProfessor ? '#B8D8DB' : '#FBBF6A';
  const skinColor = isProfessor ? '#C4E0E2' : '#FFD7A0';
  const bodyColor = isProfessor ? '#1E4F54' : '#92400E';

  return (
    <div
      className="fc-avatar"
      style={{ background: bg, boxShadow: `0 0 0 2px ${ring}`, overflow: 'visible', position: 'relative' }}
      aria-label={isProfessor ? 'Professor' : 'Aluno'}
    >
      <svg viewBox="0 0 32 32" width="32" height="32">
        {/* corpo */}
        <ellipse cx="16" cy="27" rx="11" ry="8" fill={bodyColor} />
        {/* cabeça */}
        <circle cx="16" cy="17" r="7" fill={skinColor} />
        {isProfessor && (
          <>
            {/* aba do capelo */}
            <polygon points="16,7 5,12 16,15 27,12" fill="#E0EDEE" />
            <rect x="5" y="11" width="22" height="3" rx="0.5" fill="#E0EDEE" />
            {/* botão */}
            <circle cx="16" cy="7" r="2" fill="#B8D8DB" />
            {/* cordão */}
            <path d="M25 11 Q29 16 27 22" fill="none" stroke="#B8D8DB" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="27" cy="23" r="1.5" fill="#B8D8DB" />
          </>
        )}
      </svg>
    </div>
  );
}

// --- Identificação visual de autor [Ce7/RF21] ---
function BadgePerfil({ tipo }) {
  if (!tipo) return null;
  const isProfessor = tipo === 'professor';
  return (
    <span className={`fc-badge-perfil ${isProfessor ? 'fc-badge-perfil--professor' : 'fc-badge-perfil--aluno'}`}>
      {isProfessor ? 'Professor' : 'Aluno'}
    </span>
  );
}
// ------------------------------------------------

function BadgeStatus({ respondida }) {
  return respondida
    ? <span className="fc-badge fc-badge--respondida">Respondida</span>
    : <span className="fc-badge fc-badge--aguardando">Aguardando resposta</span>;
}

function separarTituloDescricao(mensagem) {
  const tituloOriginal = mensagem?.titulo?.trim();
  const textoCompleto = mensagem?.texto?.trim() || '';

  if (tituloOriginal) {
    return { titulo: tituloOriginal, descricao: textoCompleto };
  }

  if (!textoCompleto) {
    return { titulo: 'Sem título', descricao: '' };
  }

  const partes = textoCompleto.split(/\n\s*\n/);
  if (partes.length > 1) {
    const [tituloExtraido, ...descricaoPartes] = partes;
    return {
      titulo: tituloExtraido.trim(),
      descricao: descricaoPartes.join('\n\n').trim(),
    };
  }

  return { titulo: textoCompleto, descricao: '' };
}

function CardPergunta({ mensagem, respostas, ativo, onClick }) {
  const respondida = respostas && respostas.length > 0;
  const { titulo, descricao } = separarTituloDescricao(mensagem);
  const descricaoResumo = descricao
    ? descricao.slice(0, 80) + (descricao.length > 80 ? '...' : '')
    : '';
  return (
    <div
      className={`fc-card-pergunta ${ativo ? 'fc-card-pergunta--ativo' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className="fc-card-topo">
        <Avatar nome={mensagem.autor_nome} tipo={mensagem.autor_tipo || 'aluno'} />
        <div className="fc-card-info">
          <span className="fc-card-titulo">{titulo}</span>
          <BadgeStatus respondida={respondida} />
          {descricaoResumo && (
            <span className="fc-card-descricao">{descricaoResumo}</span>
          )}
        </div>
        <span className="fc-card-seta">›</span>
      </div>
      <div className="fc-card-rodape">
        <span className="fc-card-autor" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {mensagem.autor_nome}
          <BadgePerfil tipo={mensagem.autor_tipo} />
        </span>
        <span className="fc-card-data">{formatarData(mensagem.data_create)}</span>
      </div>
    </div>
  );
}


function IconeFlag({ onClick, label }) {
  return (
    <button
      type="button"
      className="fc-btn-flag"
      onClick={onClick}
      aria-label={label}
      title="Denunciar"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M5 21V4a1 1 0 0 1 1-1h11.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function PainelDetalhe({ pergunta, respostas, onDenunciar }) {
  if (!pergunta) {
    return (
      <div className="fc-detalhe-vazio">
        <p>Selecione uma pergunta para ver a discussão.</p>
      </div>
    );
  }

  const { titulo, descricao } = separarTituloDescricao(pergunta);

  return (
    <div className="fc-detalhe">
      <div className="fc-detalhe-pergunta">
        <div className="fc-detalhe-autor">
          <Avatar nome={pergunta.autor_nome} tipo={pergunta.autor_tipo || 'aluno'} />
          <div>
            <span className="fc-detalhe-nome" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {pergunta.autor_nome}
              <BadgePerfil tipo={pergunta.autor_tipo} />
            </span>
            <span className="fc-detalhe-data">{formatarData(pergunta.data_create)}</span>
          </div>
          <BadgeStatus respondida={respostas.length > 0} />
          <IconeFlag
            label="Denunciar pergunta"
            onClick={() => onDenunciar(pergunta.id)}
          />
        </div>
        <h3 className="fc-detalhe-titulo">{titulo}</h3>
        {descricao && (
          <p className="fc-detalhe-texto">{descricao}</p>
        )}
      </div>

      {respostas.length > 0 && (
        <div className="fc-respostas">
          <p className="fc-respostas-label">Resposta do professor</p>
          {respostas.map(r => (
            <div key={r.id} className="fc-resposta-item">
              <div className="fc-detalhe-autor">
                <Avatar nome={r.autor_nome} tipo={r.autor_tipo || 'professor'} />
                <div>
                  <span className="fc-detalhe-nome" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {r.autor_nome}
                    <BadgePerfil tipo={r.autor_tipo || 'professor'} />
                  </span>
                  <span className="fc-detalhe-data">{formatarData(r.data_create)}</span>
                </div>
                <IconeFlag
                  label="Denunciar resposta"
                  onClick={() => onDenunciar(r.id)}
                />
              </div>
              <p className="fc-resposta-texto">{r.texto}</p>
            </div>
          ))}
        </div>
      )}

      {respostas.length === 0 && (
        <p className="fc-sem-resposta">Ainda não há resposta do professor.</p>
      )}
    </div>
  );
}


export function ForumConteudo() {
  const { id } = useParams();
  const { conteudo, disciplina } = useConteudoEspecifico(id);
  const {
    forumId,
    perguntas,
    respostasMap,
    loading,
    erro,
    refetch,
    inserirMensagemLocal,
  } = useForumConteudo(id);

  const [perguntaSelecionada, setPerguntaSelecionada] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [denunciaAberta, setDenunciaAberta] = useState(null);
  const [mobileModo, setMobileModo] = useState('lista');

  useEffect(() => {
    if (perguntas.length > 0 && !perguntaSelecionada) {
      setPerguntaSelecionada(perguntas[0]);
    }
  }, [perguntas]);

  const perguntasFiltradas = useMemo(() => {
    return perguntas.filter(p => {
      const respondida = (respostasMap[p.id] || []).length > 0;
      const buscaOk = !busca || p.texto.toLowerCase().includes(busca.toLowerCase())
        || p.titulo?.toLowerCase().includes(busca.toLowerCase())
        || p.autor_nome?.toLowerCase().includes(busca.toLowerCase());
      const statusOk =
        filtroStatus === 'todos' ||
        (filtroStatus === 'respondida' && respondida) ||
        (filtroStatus === 'aguardando' && !respondida);
      return buscaOk && statusOk;
    });
  }, [perguntas, respostasMap, busca, filtroStatus]);

  const selecionarPergunta = (pergunta) => {
    setPerguntaSelecionada(pergunta);
    setMobileModo('detalhe');

    // Sempre sobe para o topo da página ao selecionar uma pergunta.
    // Assim o usuário vê o detalhe imediatamente em qualquer tamanho de tela.
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <>
      <div className="fc-page">

        <nav className="fc-breadcrumb">
          <Link to="/aluno/conteudos">{disciplina?.nome ?? 'Disciplina'}</Link>
          <span className="fc-sep">›</span>
          <Link to={`/aluno/conteudos/${id}`}>{conteudo?.nome ?? 'Conteúdo'}</Link>
          <span className="fc-sep">›</span>
          <span className="fc-sep-atual">fórum</span>
        </nav>

        <div className="fc-header">
          <div>
            <Link className="fc-voltar" to={`/aluno/conteudos/${id}`}>← Voltar ao conteúdo</Link>
            <h1 className="fc-titulo">{conteudo?.nome ?? 'Carregando...'}</h1>
            <p className="fc-subtitulo">Fórum de dúvidas desse conteúdo com professor e colegas</p>
          </div>
          <button className="fc-btn-perguntar" onClick={() => setModalAberto(true)}>
            + Perguntar algo
          </button>
        </div>

        {loading && <p className="fc-estado">Carregando fórum...</p>}
        {!loading && erro && (
          <div className="fc-erro-banner">
            {erro}
            <button className="fc-btn-retry" onClick={refetch}>Tentar novamente</button>
          </div>
        )}

        {!loading && !erro && (
          <div className="fc-conteudo">

            <div className={`fc-coluna-lista ${mobileModo === 'detalhe' ? 'fc-mobile-hide' : ''}`}>
              <div className="fc-orientacoes fc-orientacoes--mobile">
                <h4 className="fc-orientacoes-titulo">Orientações para melhores perguntas</h4>
                <ul className="fc-orientacoes-lista">
                  <li>Seja claro e objetivo</li>
                  <li>Contextualize</li>
                  <li>Dê exemplos do que já fez</li>
                </ul>
              </div>

              <div className="fc-filtros">
                <div className="fc-busca-wrap">
                  <svg className="fc-busca-icone" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <input
                    className="fc-busca"
                    placeholder="Buscar perguntas..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                  />
                </div>
                <select
                  className="fc-filtro-select"
                  value={filtroStatus}
                  onChange={e => setFiltroStatus(e.target.value)}
                >
                  <option value="todos">Filtrar por status</option>
                  <option value="respondida">Respondida</option>
                  <option value="aguardando">Aguardando resposta</option>
                </select>
              </div>

              {perguntasFiltradas.length === 0 ? (
                <div className="fc-lista-vazia">
                  <p>Nenhuma pergunta encontrada.</p>
                  <button className="fc-btn-perguntar-sm" onClick={() => setModalAberto(true)}>
                    Fazer a primeira pergunta
                  </button>
                </div>
              ) : (
                <div className="fc-lista">
                  {perguntasFiltradas.map(p => (
                    <CardPergunta
                      key={p.id}
                      mensagem={p}
                      respostas={respostasMap[p.id] || []}
                      ativo={perguntaSelecionada?.id === p.id}
                      onClick={() => selecionarPergunta(p)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className={`fc-coluna-detalhe ${mobileModo === 'lista' ? 'fc-mobile-hide' : ''}`}>
              <button
                type="button"
                className="fc-mobile-voltar"
                onClick={() => setMobileModo('lista')}
              >
                ← Ver perguntas
              </button>

              <div className="fc-detalhe-scroll">
                <PainelDetalhe
                  pergunta={perguntaSelecionada}
                  respostas={perguntaSelecionada ? (respostasMap[perguntaSelecionada.id] || []) : []}
                  onDenunciar={(itemId) => setDenunciaAberta(itemId)}
                />
              </div>

              <div className="fc-orientacoes fc-orientacoes--desktop">
                <h4 className="fc-orientacoes-titulo">Orientações para melhores perguntas</h4>
                <ul className="fc-orientacoes-lista">
                  <li>Seja claro e objetivo</li>
                  <li>Contextualize</li>
                  <li>Dê exemplos do que já fez</li>
                </ul>
              </div>
            </div>

          </div>
        )}
      </div>

      <ModalPergunta
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        conteudoId={id}
        onSuccess={(novaMensagem) => inserirMensagemLocal(novaMensagem)}
      />

      <ModalDenuncia
        isOpen={denunciaAberta !== null}
        onClose={() => setDenunciaAberta(null)}
        mensagemId={denunciaAberta}
      />
    </>
  );
}