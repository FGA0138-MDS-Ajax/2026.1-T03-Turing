import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForumConteudo } from '../../../hooks/useForumConteudo';
import { useConteudoEspecifico } from '../../../hooks/useConteudoEspecifico';
import './ForumConteudo.css';

function formatarData(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function iniciais(nome) {
  if (!nome) return '?';
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function Avatar({ nome, tipo }) {
  const bg = tipo === 'professor' ? '#2F5D62' : '#C07A30';
  return (
    <div className="fc-avatar" style={{ background: bg }}>
      {iniciais(nome)}
    </div>
  );
}


function BadgeStatus({ respondida }) {
  return respondida
    ? <span className="fc-badge fc-badge--respondida">Respondida</span>
    : <span className="fc-badge fc-badge--aguardando">Aguardando resposta</span>;
}

function CardPergunta({ mensagem, respostas, ativo, onClick }) {
  const respondida = respostas && respostas.length > 0;
  return (
    <div
      className={`fc-card-pergunta ${ativo ? 'fc-card-pergunta--ativo' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className="fc-card-topo">
        <Avatar nome={mensagem.autor_nome} tipo="aluno" />
        <div className="fc-card-info">
          <span className="fc-card-titulo">{mensagem.texto.slice(0, 80)}{mensagem.texto.length > 80 ? '...' : ''}</span>
          <BadgeStatus respondida={respondida} />
        </div>
        <span className="fc-card-seta">›</span>
      </div>
      <div className="fc-card-rodape">
        <span className="fc-card-autor">{mensagem.autor_nome}</span>
        <span className="fc-card-data">{formatarData(mensagem.data_create)}</span>
      </div>
    </div>
  );
}


function PainelDetalhe({ pergunta, respostas }) {
  if (!pergunta) {
    return (
      <div className="fc-detalhe-vazio">
        <p>Selecione uma pergunta para ver a discussão.</p>
      </div>
    );
  }

  return (
    <div className="fc-detalhe">
      <div className="fc-detalhe-pergunta">
        <div className="fc-detalhe-autor">
          <Avatar nome={pergunta.autor_nome} tipo="aluno" />
          <div>
            <span className="fc-detalhe-nome">{pergunta.autor_nome}</span>
            <span className="fc-detalhe-data">{formatarData(pergunta.data_create)}</span>
          </div>
          <BadgeStatus respondida={respostas.length > 0} />
        </div>
        <h3 className="fc-detalhe-titulo">{pergunta.texto}</h3>
      </div>

      {respostas.length > 0 && (
        <div className="fc-respostas">
          <p className="fc-respostas-label">Resposta do professor</p>
          {respostas.map(r => (
            <div key={r.id} className="fc-resposta-item">
              <div className="fc-detalhe-autor">
                <Avatar nome={r.autor_nome} tipo="professor" />
                <div>
                  <span className="fc-detalhe-nome">{r.autor_nome}</span>
                  <span className="fc-detalhe-data">{formatarData(r.data_create)}</span>
                </div>
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

function ModalNovaPergunta({ onFechar, onEnviar, enviando, erroEnvio }) {
  const [texto, setTexto] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  const handleEnviar = async () => {
    if (!texto.trim()) {
      setErroLocal('A pergunta não pode estar vazia.');
      return;
    }
    const ok = await onEnviar(texto.trim());
    if (ok) onFechar();
  };

  return (
    <div className="fc-overlay" onClick={e => e.target === e.currentTarget && onFechar()}>
      <div className="fc-modal">
        <div className="fc-modal-header">
          <h2 className="fc-modal-titulo">Nova pergunta</h2>
          <button className="fc-modal-fechar" onClick={onFechar}>✕</button>
        </div>
        <div className="fc-modal-body">
          <label className="fc-label">Sua dúvida <span className="fc-required">*</span></label>
          <textarea
            className={`fc-textarea ${erroLocal || erroEnvio ? 'fc-textarea--erro' : ''}`}
            rows={5}
            placeholder="Descreva sua dúvida com detalhes. Seja claro e objetivo, contextualize e dê exemplos do que já fez..."
            value={texto}
            onChange={e => { setTexto(e.target.value); setErroLocal(''); }}
          />
          {(erroLocal || erroEnvio) && (
            <span className="fc-erro-msg">{erroLocal || erroEnvio}</span>
          )}
        </div>
        <div className="fc-modal-acoes">
          <button className="fc-btn-cancelar" onClick={onFechar} disabled={enviando}>
            Cancelar
          </button>
          <button className="fc-btn-enviar" onClick={handleEnviar} disabled={enviando}>
            {enviando ? 'Enviando...' : 'Perguntar'}
          </button>
        </div>
      </div>
    </div>
  );
}


export function ForumConteudo() {
  const { id } = useParams();
  const { conteudo, disciplina } = useConteudoEspecifico(id);
  const {
    perguntas,
    respostasMap,
    loading,
    erro,
    refetch,
    enviarPergunta,
    enviando,
    erroEnvio,
  } = useForumConteudo(id);

  const [perguntaSelecionada, setPerguntaSelecionada] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalAberto, setModalAberto] = useState(false);

  useMemo(() => {
    if (perguntas.length > 0 && !perguntaSelecionada) {
      setPerguntaSelecionada(perguntas[0]);
    }
  }, [perguntas]);

  const perguntasFiltradas = useMemo(() => {
    return perguntas.filter(p => {
      const respondida = (respostasMap[p.id] || []).length > 0;
      const buscaOk = !busca || p.texto.toLowerCase().includes(busca.toLowerCase())
        || p.autor_nome?.toLowerCase().includes(busca.toLowerCase());
      const statusOk =
        filtroStatus === 'todos' ||
        (filtroStatus === 'respondida' && respondida) ||
        (filtroStatus === 'aguardando' && !respondida);
      return buscaOk && statusOk;
    });
  }, [perguntas, respostasMap, busca, filtroStatus]);

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
            <h1 className="fc-titulo">{conteudo?.nome ?? 'Carregando...'}</h1>
            <p className="fc-subtitulo">Fórum de dúvidas desse conteúdo com professor e colegas</p>
            <Link className="fc-voltar" to={`/aluno/conteudos/${id}`}>← Voltar ao conteúdo</Link>
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

            <div className="fc-coluna-lista">
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
                      onClick={() => setPerguntaSelecionada(p)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="fc-coluna-detalhe">
              <PainelDetalhe
                pergunta={perguntaSelecionada}
                respostas={perguntaSelecionada ? (respostasMap[perguntaSelecionada.id] || []) : []}
              />

              <div className="fc-orientacoes">
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

      {modalAberto && (
        <ModalNovaPergunta
          onFechar={() => setModalAberto(false)}
          onEnviar={enviarPergunta}
          enviando={enviando}
          erroEnvio={erroEnvio}
        />
      )}
    </>
  );
}