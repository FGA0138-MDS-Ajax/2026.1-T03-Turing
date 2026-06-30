import React, { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Users, GraduationCap, User, BookX, Search, Filter, BookOpen, Loader2, ChevronDown } from 'lucide-react';
import api from '../../services/api';

const mapStatusParaFront = (statusDb) => {
  if (statusDb === 'analisado') return 'Resolvida';
  if (statusDb === 'recusado') return 'Negada';
  return 'Pendente';
};

const mapStatusParaDb = (statusFront) => {
  if (statusFront === 'Resolvida') return 'analisado';
  if (statusFront === 'Negada') return 'recusado';
  return 'pendente';
};

const calcularTempoDecorrido = (dataIso) => {
  if (!dataIso) return '';
  const dataPost = new Date(dataIso);
  const agora = new Date();
  const diff = agora - dataPost;

  if (diff < 60000) return 'agora mesmo';

  const minutos = Math.floor(diff / (1000 * 60));
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (dias > 0) return `${dias} dia${dias > 1 ? 's' : ''} atrás`;
  if (horas > 0) return `${horas} hora${horas > 1 ? 's' : ''} atrás`;
  return `${minutos} min atrás`;
};

const DropdownCustomizado = ({ icone: Icone, valor, opcoes, onChange, placeholder }) => {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const lidarComCliqueFora = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setAberto(false);
      }
    };
    document.addEventListener('mousedown', lidarComCliqueFora);
    return () => document.removeEventListener('mousedown', lidarComCliqueFora);
  }, []);

  const opcaoSelecionada = opcoes.find(opt => opt.valor === valor);

  return (
    <div ref={containerRef} style={{ flex: 1, position: 'relative' }}>
      <div
        onClick={() => setAberto(!aberto)}
        style={{ display: 'flex', alignItems: 'center', background: 'var(--gs-surface, #fff)', border: '1px solid var(--gs-border, #EAEAEA)', borderRadius: '8px', padding: '12px 16px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', height: '45px' }}
      >
        {Icone && <Icone size={18} color="#9CA3AF" style={{ marginRight: '12px', minWidth: '18px' }} />}
        <span style={{ flex: 1, fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: opcaoSelecionada?.valor ? 'var(--gs-text-primary, #111827)' : 'var(--gs-text-secondary, #4B5563)', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', userSelect: 'none' }}>
          {opcaoSelecionada ? opcaoSelecionada.label : placeholder}
        </span>
        <ChevronDown size={16} color="#9CA3AF" style={{ transform: aberto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
      </div>

      {aberto && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: 'var(--gs-surface, #fff)', border: '1px solid var(--gs-border, #EAEAEA)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden' }}>
          {opcoes.map((opt, i) => (
            <div
              key={i}
              onClick={() => { onChange(opt.valor); setAberto(false); }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              style={{
                padding: '12px 16px',
                fontSize: 'calc(14px * var(--gs-font-scale, 1))',
                color: valor === opt.valor ? 'var(--gs-accent, #E87C28)' : 'var(--gs-text-secondary, #4B5563)',
                fontWeight: valor === opt.valor ? '600' : '500',
                cursor: 'pointer',
                transition: 'background 0.2s',
                borderBottom: i < opcoes.length - 1 ? '1px solid var(--gs-border, #F3F4F6)' : 'none',
                userSelect: 'none'
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Denuncias() {
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalParecerAberto, setModalParecerAberto] = useState(false);
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);
  const [statusParecer, setStatusParecer] = useState('');
  const [observacaoParecer, setObservacaoParecer] = useState('');
  const [observacaoSalva, setObservacaoSalva] = useState({});

  const [listaDenuncias, setListaDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    const carregarDenuncias = async () => {
      setCarregando(true);
      try {
        const resposta = await api.get('/api/interacoes/denuncias/');
        const dadosDoBanco = resposta.data.results ? resposta.data.results : resposta.data;

        const denunciasFormatadas = await Promise.all(dadosDoBanco.map(async (d) => {
        let textoMensagem = 'Mensagem não vinculada a esta denúncia.';

        if (d.mensagem) {
          try {
            const msgRes = await api.get(`/api/interacoes/mensagens/${d.mensagem}/`);
            textoMensagem = msgRes.data.texto || 'Sem conteúdo.';
          } catch {
            textoMensagem = 'Não foi possível carregar o conteúdo da mensagem.';
          }
        }

        return {
          id: d.id,
          mensagemId: d.mensagem ?? null,
          titulo: `Denúncia #${d.id} - ${d.motivo || 'Geral'}`,
          categoriaMotivo: d.motivo || 'Outros',
          autor: d.denunciante_nome || (d.denunciante ? `ID: ${d.denunciante}` : 'Desconhecido'),
          resumo: d.descricao || 'Sem descrição adicional.',
          mensagemDenunciada: textoMensagem,
          dataCriacao: d.data_create,
          dataAtualizacao: d.data_update || d.data_create,
          status: mapStatusParaFront(d.status)
        };
    }));

        setListaDenuncias(denunciasFormatadas);
      } catch (erro) {
        console.error("Erro ao buscar denúncias:", erro);
        alert("Erro ao carregar os dados. Verifique a sua conexão.");
      } finally {
        setCarregando(false);
      }
    };
    carregarDenuncias();
  }, []);

  const denunciasFiltradas = listaDenuncias.filter(denuncia => {
    const textoBusca = termoBusca.toLowerCase();
    const bateBusca = denuncia.titulo.toLowerCase().includes(textoBusca) ||
                      denuncia.autor.toLowerCase().includes(textoBusca) ||
                      denuncia.resumo.toLowerCase().includes(textoBusca);

    const bateStatus = filtroStatus ? denuncia.status === filtroStatus : true;
    const bateCategoria = filtroCategoria ? denuncia.titulo.toLowerCase().includes(filtroCategoria.toLowerCase()) : true;

    return bateBusca && bateStatus && bateCategoria;
  });

  const stats = {
    total: denunciasFiltradas.length,
    resolvidas: denunciasFiltradas.filter(d => d.status === 'Resolvida').length,
    pendentes: denunciasFiltradas.filter(d => d.status === 'Pendente').length,
    negadas: denunciasFiltradas.filter(d => d.status === 'Negada').length
  };

  const abrirDetalhes = async (denuncia) => {
  setDenunciaSelecionada(denuncia);
  setModalDetalhesAberto(true);

  if (denuncia.mensagemId) {
    try {
      const msgRes = await api.get(`/api/interacoes/mensagens/${denuncia.mensagemId}/`);
      const texto = msgRes.data.texto || 'Sem conteúdo.';
      const forumId = msgRes.data.forum;

      let nomeConteudo = 'Não identificado';
      if (forumId) {
        try {
          const forumRes = await api.get(`/api/interacoes/foruns/${forumId}/`);
          const conteudoId = forumRes.data.conteudo;
          if (conteudoId) {
            const conteudoRes = await api.get(`/api/disciplinas/conteudos/${conteudoId}/`);
            nomeConteudo = conteudoRes.data.nome || 'Não identificado';
          }
        } catch {}
      }

      setDenunciaSelecionada(prev => ({ ...prev, mensagemDenunciada: texto, nomeConteudo }));
    } catch {}
  }
  };

  const abrirParecer = (denuncia) => {
    setDenunciaSelecionada(denuncia);
    setStatusParecer(denuncia.status === 'Pendente' ? '' : denuncia.status);
    setObservacaoParecer('');
    setModalParecerAberto(true);
  };

  const salvarParecer = async () => {
    if (!statusParecer) { alert("Selecione um resultado."); return; }
    if (!window.confirm("Confirmar parecer?")) return;

    try {
        await api.patch(`/api/interacoes/denuncias/${denunciaSelecionada.id}/`, {
        status: mapStatusParaDb(statusParecer)
        });

        setListaDenuncias(prev => prev.map(d => d.id === denunciaSelecionada.id ? {
        ...d, status: statusParecer, dataAtualizacao: new Date().toISOString()
        } : d));

        setObservacaoSalva(prev => ({ ...prev, [denunciaSelecionada.id]: observacaoParecer }));

        setModalParecerAberto(false);
    } catch (e) { alert("Erro ao salvar."); }
    };

    const opcoesCategoria = [
    { valor: "", label: "Todas as categorias" },
    { valor: "Spam ou propaganda", label: "Spam ou propaganda" },
    { valor: "Conteúdo ofensivo ou inadequado", label: "Conteúdo ofensivo ou inadequado" },
    { valor: "Pergunta irrelevante ao conteúdo", label: "Pergunta irrelevante ao conteúdo" },
    { valor: "Pergunta duplicada", label: "Pergunta duplicada" },
    { valor: "Outro", label: "Outro" }
  ];

  const opcoesStatus = [
    { valor: "", label: "Todos os status" },
    { valor: "Pendente", label: "Pendente" },
    { valor: "Resolvida", label: "Resolvida" },
    { valor: "Negada", label: "Negada" }
  ];

  return (
    <AdminLayout>
      <div className="denuncias-container" style={{ padding: '24px' }}>

        <div className="header" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'calc(24px * var(--gs-font-scale, 1))',fontFamily: 'serif', fontWeight: '800', color: 'var(--gs-accent, #111827)', margin: 0 }}>Denúncias</h1>
          <p style={{ fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-secondary, #4B5563)', margin: 0, fontWeight: '500' }}>gerenciamento de denuncias</p>
        </div>

        <div className="stats-grid" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total de Denúncias', valor: stats.total, icon: Users },
            { label: 'Resolvidas', valor: stats.resolvidas, icon: GraduationCap },
            { label: 'Pendente', valor: stats.pendentes, icon: User },
            { label: 'Negadas', valor: stats.negadas, icon: BookX }
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, background: 'var(--gs-surface, #fff)', padding: '20px', borderRadius: '12px', border: '1px solid var(--gs-border, #000000)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'inline-flex', padding: '10px', background: 'var(--gs-icon-bg)', borderRadius: '8px', color: 'var(--gs-icon-color)', marginBottom: '12px' }}>
                <stat.icon size={20} />
              </div>
              <p style={{ margin: '0 0 4px', fontSize: 'calc(13px * var(--gs-font-scale, 1))', color: 'var(--gs-text-secondary, #4B5563)', fontWeight: '600' }}>{stat.label}</p>
              <h2 style={{ margin: 0, fontSize: 'calc(28px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)', fontWeight: '800' }}>{stat.valor}</h2>
            </div>
          ))}
        </div>

        <div className="filters-container" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>

          <div style={{ flex: 2, display: 'flex', alignItems: 'center', background: 'var(--gs-surface, #fff)', border: '1px solid var(--gs-border, #EAEAEA)', borderRadius: '8px', padding: '0 16px', height: '45px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <Search size={18} color="#9CA3AF" style={{ marginRight: '12px', minWidth: '18px' }} />
            <input
              type="text"
              placeholder="Buscar por conteúdo ou autor..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)', fontWeight: '500', height: '100%' }}
            />
          </div>

          <DropdownCustomizado
            icone={Filter}
            valor={filtroCategoria}
            opcoes={opcoesCategoria}
            onChange={setFiltroCategoria}
            placeholder="Todas as categorias"
          />

          <DropdownCustomizado
            icone={Filter}
            valor={filtroStatus}
            opcoes={opcoesStatus}
            onChange={setFiltroStatus}
            placeholder="Todos os status"
          />

        </div>

        <div className="list-container" style={{ background: 'var(--gs-surface, #fff)', borderRadius: '8px', padding: '16px', border: '1px solid var(--gs-border, #EAEAEA)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px', fontWeight: '800', fontSize: 'calc(14px * var(--gs-font-scale, 1))', borderBottom: '1px solid var(--gs-border, #EAEAEA)', paddingBottom: '12px', color: 'var(--gs-text-primary, #111827)' }}>
            <div>Post</div>
            <div style={{ textAlign: 'center' }}>Status</div>
            <div style={{ textAlign: 'center' }}>Ações</div>
          </div>

          <div className="list-items" style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '200px', position: 'relative' }}>

            {carregando && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9CA3AF' }}>
                <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px', color: 'var(--gs-accent, #E87C28)' }} />
                <span style={{ fontSize: 'calc(14px * var(--gs-font-scale, 1))', fontWeight: '500' }}>Carregando denúncias...</span>
              </div>
            )}

            {!carregando && denunciasFiltradas.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--gs-text-secondary, #6B7280)', fontSize: 'calc(14px * var(--gs-font-scale, 1))' }}>
                Nenhuma denúncia encontrada para os filtros atuais.
              </div>
            )}

            {!carregando && denunciasFiltradas.map((denuncia) => (
              <div key={denuncia.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', alignItems: 'center', background: 'var(--gs-surface-2, #F9F9F7)', padding: '16px', borderRadius: '8px', border: '1px solid var(--gs-border, #EAEAEA)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ background: 'var(--gs-icon-background, #DBEAFE)', color: 'var(--gs-icon-color, #3B82F6)', padding: '10px', borderRadius: '6px' }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', fontWeight: '600', color: 'var(--gs-text-primary, #111827)' }}>{denuncia.titulo}</h4>
                    <p style={{ margin: 0, fontSize: 'calc(12px * var(--gs-font-scale, 1))', color: 'var(--gs-text-secondary, #4B5563)', fontWeight: '500' }}>por: {denuncia.autor}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: 'calc(11px * var(--gs-font-scale, 1))', color: 'var(--gs-text-muted, #6B7280)', fontWeight: '500' }}>{denuncia.resumo}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ fontSize: 'calc(11px * var(--gs-font-scale, 1))', color: 'var(--gs-text-muted, #6B7280)', fontWeight: '500' }}>
                    {calcularTempoDecorrido(denuncia.dataCriacao)}
                  </span>
                  <span style={{ fontWeight: '700', fontSize: 'calc(13px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}>{denuncia.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                  <button onClick={() => abrirDetalhes(denuncia)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-accent, #111827)', padding: 0 }}>Detalhes</button>
                  <button onClick={() => abrirParecer(denuncia)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-accent, #111827)', padding: 0 }}>Parecer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalDetalhesAberto && denunciaSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'var(--gs-surface, #fff)', width: '500px', maxWidth: '90%', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: 'calc(20px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)', fontWeight: '700' }}>Detalhes da Denúncia</h2>
              <button onClick={() => setModalDetalhesAberto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'calc(16px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}>✖</button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-secondary, #4B5563)', fontWeight: '600' }}>Informações da Publicação</h4>
              <p style={{ margin: '0 0 4px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}><strong>Título:</strong> {denunciaSelecionada.titulo}</p>

              <p style={{ margin: '0 0 4px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}>
                <strong>Autor do post:</strong> {denunciaSelecionada.autor}
              </p>
              <p style={{ margin: '0 0 4px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}>
                <strong>Conteúdo vinculado:</strong> {denunciaSelecionada.nomeConteudo || 'Não vinculado'}
              </p>

              <div style={{ padding: '12px', background: 'var(--gs-surface-2, #F3F4F6)', borderRadius: '4px', borderLeft: '4px solid var(--gs-accent, #E87C28)' }}>
                <span style={{ fontSize: 'calc(12px * var(--gs-font-scale, 1))', fontWeight: '600', color: 'var(--gs-text-muted, #6B7280)', display: 'block', marginBottom: '4px' }}>Conteúdo da publicação:</span>
                <p style={{ margin: 0, fontSize: 'calc(13px * var(--gs-font-scale, 1))', color: 'var(--gs-text-secondary, #4B5563)', fontStyle: 'italic', wordBreak: 'break-word' }}>
                  "{denunciaSelecionada.mensagemDenunciada}"
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--gs-surface-2, #F9F9F7)', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-secondary, #4B5563)', fontWeight: '600' }}>Dados da Denúncia</h4>
              <p style={{ margin: '0 0 4px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}><strong>Motivo:</strong> {denunciaSelecionada.resumo}</p>

              <p style={{ margin: '0 0 4px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}>
                <strong>Criada há:</strong> {calcularTempoDecorrido(denunciaSelecionada.dataCriacao)}
              </p>

              {denunciaSelecionada.status !== 'Pendente' && (
                <p style={{ margin: '0 0 4px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}>
                  <strong>{denunciaSelecionada.status === 'Resolvida' ? 'Resolvida' : 'Negada'} há:</strong> {calcularTempoDecorrido(denunciaSelecionada.dataAtualizacao)}
                </p>
              )}

              <p style={{ margin: '0 0 4px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}><strong>Status Atual:</strong> <span style={{ fontWeight: 'bold' }}>{denunciaSelecionada.status}</span></p>
              <p style={{ margin: '0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}>
                <strong>Histórico:</strong> {observacaoSalva[denunciaSelecionada.id] || "A denúncia foi registrada e aguarda ou já passou por revisão."}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setModalDetalhesAberto(false)} style={{ padding: '8px 16px', background: 'var(--gs-surface-2, #EAEAEA)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--gs-text-primary, #111827)' }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {modalParecerAberto && denunciaSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'var(--gs-surface, #fff)', width: '500px', maxWidth: '90%', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: 'calc(20px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)', fontWeight: '700' }}>Emitir Parecer</h2>
              <button onClick={() => setModalParecerAberto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'calc(16px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)' }}>✖</button>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-secondary, #4B5563)', fontWeight: '500' }}>Denúncia referida: <strong>{denunciaSelecionada.titulo}</strong></p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: 'calc(14px * var(--gs-font-scale, 1))', fontWeight: '600', color: 'var(--gs-text-primary, #111827)' }}>Resultado da Análise</label>
              <select
                value={statusParecer}
                onChange={(e) => setStatusParecer(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--gs-border, #CCC)', fontSize: 'calc(14px * var(--gs-font-scale, 1))', color: 'var(--gs-text-primary, #111827)', fontWeight: '500', background: 'var(--gs-surface, #fff)' }}
              >
                <option value="">Selecione um status...</option>
                <option value="Resolvida">Resolvida (Aprovar denúncia)</option>
                <option value="Negada">Negada (Rejeitar denúncia)</option>
                <option value="Pendente">Manter Pendente</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: 'calc(14px * var(--gs-font-scale, 1))', fontWeight: '600', color: 'var(--gs-text-primary, #111827)' }}>Observações (opcional)</label>
              <textarea
                value={observacaoParecer}
                onChange={(e) => setObservacaoParecer(e.target.value)}
                rows="4"
                placeholder="Descreva o motivo da sua decisão..."
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--gs-border, #CCC)', fontSize: 'calc(14px * var(--gs-font-scale, 1))', resize: 'vertical', color: 'var(--gs-text-primary, #111827)', fontWeight: '500', background: 'var(--gs-surface, #fff)' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setModalParecerAberto(false)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--gs-border, #CCC)', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', color: 'var(--gs-text-primary, #111827)' }}>Cancelar</button>
              <button onClick={salvarParecer} style={{ padding: '10px 16px', background: 'var(--gs-accent, #4CAF50)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Confirmar Parecer</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AdminLayout>
  );
}