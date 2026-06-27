import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Users, GraduationCap, User, BookX, Search, Filter, BookOpen, Loader2, ChevronDown } from 'lucide-react';
import api from '../../services/api';

// Funções de conversão (Frontend <-> Backend)
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

export default function Denuncias() {
  // Estados de Modais e Seleção
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalParecerAberto, setModalParecerAberto] = useState(false);
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);
  const [statusParecer, setStatusParecer] = useState('');
  const [observacaoParecer, setObservacaoParecer] = useState('');
  const [observacaoSalva, setObservacaoSalva] = useState({});

  // Estados de Dados e UI
  const [listaDenuncias, setListaDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estados de Filtro e Busca
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // 1. CARREGAMENTO DOS DADOS (GET)
  useEffect(() => {
    const carregarDenuncias = async () => {
      setCarregando(true);
      try {
        const resposta = await api.get('/api/interacoes/denuncias/');
        const dadosDoBanco = resposta.data.results ? resposta.data.results : resposta.data;

        const denunciasFormatadas = dadosDoBanco.map(d => ({
          id: d.id,
          titulo: `Denúncia #${d.id} - ${d.motivo || 'Geral'}`, 
          autor: d.nome_denunciante || d.denunciante_nome || (d.denunciante ? `ID: ${d.denunciante}` : 'Desconhecido'),
          resumo: d.descricao,
          dataCriacao: d.data_create, 
          dataAtualizacao: d.data_update || d.updated_at || d.data_create, 
          status: mapStatusParaFront(d.status)
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

  // 2. LÓGICA DE FILTRAGEM
  const denunciasFiltradas = listaDenuncias.filter(denuncia => {
    const textoBusca = termoBusca.toLowerCase();
    const bateBusca = denuncia.titulo.toLowerCase().includes(textoBusca) || 
                      denuncia.autor.toLowerCase().includes(textoBusca) ||
                      denuncia.resumo.toLowerCase().includes(textoBusca);
    
    const bateStatus = filtroStatus ? denuncia.status === filtroStatus : true;
    
    // A categoria verifica se o título/motivo contém a palavra selecionada
    const bateCategoria = filtroCategoria ? denuncia.titulo.toLowerCase().includes(filtroCategoria.toLowerCase()) : true;

    return bateBusca && bateStatus && bateCategoria;
  });

  // Indicadores atualizados dinamicamente
  const stats = {
    total: denunciasFiltradas.length,
    resolvidas: denunciasFiltradas.filter(d => d.status === 'Resolvida').length,
    pendentes: denunciasFiltradas.filter(d => d.status === 'Pendente').length,
    negadas: denunciasFiltradas.filter(d => d.status === 'Negada').length
  };

  const abrirDetalhes = (denuncia) => {
    setDenunciaSelecionada(denuncia);
    setModalDetalhesAberto(true);
  };

  const abrirParecer = (denuncia) => {
    setDenunciaSelecionada(denuncia);
    setStatusParecer(denuncia.status === 'Pendente' ? '' : denuncia.status); 
    setObservacaoParecer('');
    setModalParecerAberto(true);
  };

  // 3. ENVIO DO PARECER (PATCH)
  const salvarParecer = async () => {
    if (!statusParecer) { alert("Selecione um resultado."); return; }
    if (!window.confirm("Confirmar parecer?")) return;

    try {
        await api.patch(`/api/interacoes/denuncias/${denunciaSelecionada.id}/`, { 
        status: mapStatusParaDb(statusParecer) 
        });

        // Atualiza a lista E guarda a observação específica dessa denúncia
        setListaDenuncias(prev => prev.map(d => d.id === denunciaSelecionada.id ? { 
        ...d, status: statusParecer, dataAtualizacao: new Date().toISOString() 
        } : d));

        setObservacaoSalva(prev => ({ ...prev, [denunciaSelecionada.id]: observacaoParecer }));

        setModalParecerAberto(false);
    } catch (e) { alert("Erro ao salvar."); }
    };

  return (
    <AdminLayout>
      <div className="denuncias-container" style={{ padding: '24px' }}>
        
        <div className="header" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Denúncias</h1>
          <p style={{ fontSize: '14px', color: '#4B5563', margin: 0, fontWeight: '500' }}>gerenciamento de denuncias</p>
        </div>

        {/* INDICADORES */}
        <div className="stats-grid" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total de Denúncias', valor: stats.total, icon: Users },
            { label: 'Resolvidas', valor: stats.resolvidas, icon: GraduationCap },
            { label: 'Pendente', valor: stats.pendentes, icon: User },
            { label: 'Negadas', valor: stats.negadas, icon: BookX }
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #EAEAEA', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'inline-flex', padding: '10px', background: '#FDF1E8', borderRadius: '8px', color: '#E87C28', marginBottom: '12px' }}>
                <stat.icon size={20} />
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#4B5563', fontWeight: '600' }}>{stat.label}</p>
              <h2 style={{ margin: 0, fontSize: '28px', color: '#111827', fontWeight: '800' }}>{stat.valor}</h2>
            </div>
          ))}
        </div>

        {/* BUSCA E FILTROS */}
        <div className="filters-container" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          
          <div style={{ flex: 2, display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '8px', padding: '12px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <Search size={18} color="#9CA3AF" style={{ marginRight: '12px', minWidth: '18px' }} />
            <input 
              type="text" 
              placeholder="Buscar por conteúdo ou autor..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '14px', color: '#111827', fontWeight: '500' }} 
            />
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '8px', padding: '12px 16px', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <Filter size={18} color="#9CA3AF" style={{ marginRight: '12px', minWidth: '18px' }} />
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '14px', color: '#4B5563', cursor: 'pointer', fontWeight: '500', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '20px' }}>
              <option value="">Todas as categorias</option>
              <option value="ofensiv">Ofensivo</option>
              <option value="spam">Spam</option>
            </select>
            <ChevronDown size={16} color="#9CA3AF" style={{ position: 'absolute', right: '16px', pointerEvents: 'none' }} />
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '8px', padding: '12px 16px', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <Filter size={18} color="#9CA3AF" style={{ marginRight: '12px', minWidth: '18px' }} />
            <select 
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '14px', color: '#4B5563', cursor: 'pointer', fontWeight: '500', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: '20px' }}>
              <option value="">Todos os status</option>
              <option value="Pendente">Pendente</option>
              <option value="Resolvida">Resolvida</option>
              <option value="Negada">Negada</option>
            </select>
            <ChevronDown size={16} color="#9CA3AF" style={{ position: 'absolute', right: '16px', pointerEvents: 'none' }} />
          </div>

        </div>

        {/* LISTAGEM DE DENÚNCIAS */}
        <div className="list-container" style={{ background: '#fff', borderRadius: '8px', padding: '16px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px', fontWeight: '800', fontSize: '14px', borderBottom: '1px solid #EAEAEA', paddingBottom: '12px', color: '#111827' }}>
            <div>Post</div>
            <div style={{ textAlign: 'center' }}>Status</div>
            <div style={{ textAlign: 'center' }}>Ações</div>
          </div>
          
          <div className="list-items" style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '200px', position: 'relative' }}>
            
            {/* ESTADO DE LOADING */}
            {carregando && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#9CA3AF' }}>
                <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px', color: '#E87C28' }} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Carregando denúncias...</span>
              </div>
            )}

            {/* ESTADO VAZIO */}
            {!carregando && denunciasFiltradas.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px', color: '#6B7280', fontSize: '14px' }}>
                Nenhuma denúncia encontrada para os filtros atuais.
              </div>
            )}

            {/* LINHAS DA TABELA */}
            {!carregando && denunciasFiltradas.map((denuncia) => (
              <div key={denuncia.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', alignItems: 'center', background: '#F9F9F7', padding: '16px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ background: '#DBEAFE', color: '#3B82F6', padding: '10px', borderRadius: '6px' }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#111827' }}>{denuncia.titulo}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#4B5563', fontWeight: '500' }}>por: {denuncia.autor}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6B7280', fontWeight: '500' }}>{denuncia.resumo}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500' }}>
                    {calcularTempoDecorrido(denuncia.dataCriacao)}
                  </span>
                  <span style={{ fontWeight: '700', fontSize: '13px', color: '#111827' }}>{denuncia.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                  <button onClick={() => abrirDetalhes(denuncia)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#111827', padding: 0 }}>Detalhes</button>
                  <button onClick={() => abrirParecer(denuncia)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#111827', padding: 0 }}>Parecer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: DETALHES */}
      {modalDetalhesAberto && denunciaSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', width: '500px', maxWidth: '90%', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#111827', fontWeight: '700' }}>Detalhes da Denúncia</h2>
              <button onClick={() => setModalDetalhesAberto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#111827' }}>✖</button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4B5563', fontWeight: '600' }}>Informações da Publicação</h4>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#111827' }}><strong>Título:</strong> {denunciaSelecionada.titulo}</p>
              <p style={{ margin: '0', fontSize: '14px', color: '#111827' }}><strong>Autor do post:</strong> {denunciaSelecionada.autor}</p>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', background: '#F9F9F7', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4B5563', fontWeight: '600' }}>Dados da Denúncia</h4>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#111827' }}><strong>Motivo:</strong> {denunciaSelecionada.resumo}</p>
              
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#111827' }}>
                <strong>Criada há:</strong> {calcularTempoDecorrido(denunciaSelecionada.dataCriacao)}
              </p>
              
              {/* Só mostra o tempo de resolução se a denúncia já foi processada */}
              {denunciaSelecionada.status !== 'Pendente' && (
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#111827' }}>
                  <strong>{denunciaSelecionada.status === 'Resolvida' ? 'Resolvida' : 'Negada'} há:</strong> {calcularTempoDecorrido(denunciaSelecionada.dataAtualizacao)}
                </p>
              )}

              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#111827' }}><strong>Status Atual:</strong> <span style={{ fontWeight: 'bold' }}>{denunciaSelecionada.status}</span></p>
              <p style={{ margin: '0', fontSize: '14px', color: '#111827' }}>
                <strong>Histórico:</strong> {observacaoSalva[denunciaSelecionada.id] || "A denúncia foi registrada e aguarda ou já passou por revisão."}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setModalDetalhesAberto(false)} style={{ padding: '8px 16px', background: '#EAEAEA', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#111827' }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PARECER */}
      {modalParecerAberto && denunciaSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', width: '500px', maxWidth: '90%', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#111827', fontWeight: '700' }}>Emitir Parecer</h2>
              <button onClick={() => setModalParecerAberto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#111827' }}>✖</button>
            </div>
            
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#4B5563', fontWeight: '500' }}>Denúncia referida: <strong>{denunciaSelecionada.titulo}</strong></p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>Resultado da Análise</label>
              <select 
                value={statusParecer}
                onChange={(e) => setStatusParecer(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #CCC', fontSize: '14px', color: '#111827', fontWeight: '500' }}
              >
                <option value="">Selecione um status...</option>
                <option value="Resolvida">Resolvida (Aprovar denúncia)</option>
                <option value="Negada">Negada (Rejeitar denúncia)</option>
                <option value="Pendente">Manter Pendente</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>Observações (opcional)</label>
              <textarea 
                value={observacaoParecer}
                onChange={(e) => setObservacaoParecer(e.target.value)}
                rows="4"
                placeholder="Descreva o motivo da sua decisão..."
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #CCC', fontSize: '14px', resize: 'vertical', color: '#111827', fontWeight: '500' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setModalParecerAberto(false)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #CCC', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', color: '#111827' }}>Cancelar</button>
              <button onClick={salvarParecer} style={{ padding: '10px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Confirmar Parecer</button>
            </div>
          </div>
        </div>
      )}

      {/* CSS para a animação do spinner de loading */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AdminLayout>
  );
}