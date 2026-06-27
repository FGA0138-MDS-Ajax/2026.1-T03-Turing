import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export default function Denuncias() {
  // Estados para controlar a abertura dos modais
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalParecerAberto, setModalParecerAberto] = useState(false);
  
  // Estado para saber qual denúncia foi clicada
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);

  // Estados do formulário de parecer
  const [statusParecer, setStatusParecer] = useState('');
  const [observacaoParecer, setObservacaoParecer] = useState('');

  // Mock de dados para garantir o visual enquanto não ligamos à API
  const mockStats = {
    total: '1,284',
    resolvidas: '48',
    pendentes: '1,236',
    negadas: '32'
  };

  const mockDenuncias = [
    {
      id: 1,
      titulo: 'Como resolver essa integral?',
      autor: 'usuario_55',
      resumo: 'Comportamento inadequado nos comentários.',
      tempo: '5 min atrás',
      status: 'Pendente',
    },
    {
      id: 2,
      titulo: 'Reclamações',
      autor: 'usuario_55',
      resumo: 'Spam no fórum.',
      tempo: '5 min atrás',
      status: 'Negado',
    },
    {
      id: 3,
      titulo: 'Algo errado',
      autor: 'usuario_55',
      resumo: 'Conteúdo incorreto.',
      tempo: '5 min atrás',
      status: 'Resolvida',
    }
  ];

  // Funções para abrir os modais e guardar os dados da linha clicada
  const abrirDetalhes = (denuncia) => {
    setDenunciaSelecionada(denuncia);
    setModalDetalhesAberto(true);
  };

  const abrirParecer = (denuncia) => {
    setDenunciaSelecionada(denuncia);
    setStatusParecer(''); // Limpa o formulário anterior
    setObservacaoParecer('');
    setModalParecerAberto(true);
  };

  // Simulação de submissão do parecer (O feedback visual pedido na Issue)
  const salvarParecer = () => {
    if (!statusParecer) {
      alert("Por favor, selecione um resultado para a análise.");
      return;
    }
    // Aqui entrará a lógica de ligar à API (Endpoint de atualização) na Fase 4
    alert(`Parecer guardado com sucesso!\nStatus definido: ${statusParecer}`);
    setModalParecerAberto(false);
  };

  return (
    <AdminLayout>
      <div className="denuncias-container" style={{ padding: '24px' }}>
        
        {/* Cabeçalho */}
        <div className="header" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A1A1A', margin: 0 }}>Denúncias</h1>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>gerenciamento de denuncias</p>
        </div>

        {/* Indicadores (Cards) */}
        <div className="stats-grid" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div style={{ flex: 1, background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
            <span style={{ fontSize: '24px' }}>👥</span>
            <p style={{ margin: '8px 0 4px', fontSize: '12px', color: '#666' }}>Total de Denúncias</p>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{mockStats.total}</h2>
          </div>
          <div style={{ flex: 1, background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
            <span style={{ fontSize: '24px' }}>🎓</span>
            <p style={{ margin: '8px 0 4px', fontSize: '12px', color: '#666' }}>Resolvidas</p>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{mockStats.resolvidas}</h2>
          </div>
          <div style={{ flex: 1, background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
            <span style={{ fontSize: '24px' }}>👤</span>
            <p style={{ margin: '8px 0 4px', fontSize: '12px', color: '#666' }}>Pendente</p>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{mockStats.pendentes}</h2>
          </div>
          <div style={{ flex: 1, background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #EAEAEA', position: 'relative' }}>
            <span style={{ fontSize: '24px' }}>📖</span>
            <span style={{ position: 'absolute', top: '16px', right: '16px', color: '#4CAF50', fontSize: '12px', fontWeight: 'bold' }}>+3%</span>
            <p style={{ margin: '8px 0 4px', fontSize: '12px', color: '#666' }}>Negadas</p>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{mockStats.negadas}</h2>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="filters-container" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 2, display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '8px', padding: '8px 12px' }}>
            <span style={{ marginRight: '8px', color: '#999' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por conteúdo ou autor..." 
              style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }} 
            />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '8px', padding: '8px 12px' }}>
            <span style={{ marginRight: '8px', color: '#999' }}>⏳</span>
            <select style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }}>
              <option value="">categoria</option>
            </select>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #EAEAEA', borderRadius: '8px', padding: '8px 12px' }}>
            <span style={{ marginRight: '8px', color: '#999' }}>⏳</span>
            <select style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }}>
              <option value="">status</option>
              <option value="pendente">Pendente</option>
              <option value="resolvida">Resolvida</option>
              <option value="negado">Negado</option>
            </select>
          </div>
        </div>

        {/* Listagem de Denúncias */}
        <div className="list-container" style={{ background: '#fff', borderRadius: '8px', padding: '16px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #EAEAEA', paddingBottom: '12px' }}>
            <div style={{ flex: 2 }}>Post</div>
            <div style={{ flex: 1, textAlign: 'center' }}>Status</div>
            <div style={{ flex: 1, textAlign: 'right' }}>Ações</div>
          </div>
          
          <div className="list-items" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mockDenuncias.map((denuncia) => (
              <div key={denuncia.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F9F9F7', padding: '16px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
                <div style={{ flex: 2, display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ background: '#E0E7E9', padding: '8px', borderRadius: '4px' }}>📖</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{denuncia.titulo}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>por: {denuncia.autor}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#999' }}>{denuncia.resumo}</p>
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: '#999' }}>{denuncia.tempo}</span>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{denuncia.status}</span>
                </div>
                <div style={{ flex: 1, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                  <button onClick={() => abrirDetalhes(denuncia)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Detalhes</button>
                  <button onClick={() => abrirParecer(denuncia)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: '#4CAF50' }}>Parecer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL 1: DETALHES DA DENÚNCIA             */}
      {/* ========================================= */}
      {modalDetalhesAberto && denunciaSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', width: '500px', maxWidth: '90%', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#1A1A1A' }}>Detalhes da Denúncia</h2>
              <button onClick={() => setModalDetalhesAberto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✖</button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Informações da Publicação</h4>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Título:</strong> {denunciaSelecionada.titulo}</p>
              <p style={{ margin: '0', fontSize: '14px' }}><strong>Autor do post:</strong> {denunciaSelecionada.autor}</p>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', background: '#F9F9F7', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Dados da Denúncia</h4>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Motivo:</strong> {denunciaSelecionada.resumo}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Data:</strong> {denunciaSelecionada.tempo}</p>
              <p style={{ margin: '0', fontSize: '14px' }}><strong>Status Atual:</strong> <span style={{ fontWeight: 'bold' }}>{denunciaSelecionada.status}</span></p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setModalDetalhesAberto(false)} style={{ padding: '8px 16px', background: '#EAEAEA', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL 2: EMISSÃO DE PARECER               */}
      {/* ========================================= */}
      {modalParecerAberto && denunciaSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', width: '500px', maxWidth: '90%', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#1A1A1A' }}>Emitir Parecer</h2>
              <button onClick={() => setModalParecerAberto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✖</button>
            </div>
            
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>Denúncia referida: <strong>{denunciaSelecionada.titulo}</strong></p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Resultado da Análise</label>
              <select 
                value={statusParecer}
                onChange={(e) => setStatusParecer(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #CCC', fontSize: '14px' }}
              >
                <option value="">Selecione um status...</option>
                <option value="Resolvida">Resolvida (Aprovar denúncia)</option>
                <option value="Negado">Negada (Rejeitar denúncia)</option>
                <option value="Pendente">Manter Pendente</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Observações (opcional)</label>
              <textarea 
                value={observacaoParecer}
                onChange={(e) => setObservacaoParecer(e.target.value)}
                rows="4"
                placeholder="Descreva o motivo da sua decisão..."
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #CCC', fontSize: '14px', resize: 'vertical' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setModalParecerAberto(false)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #CCC', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
              <button onClick={salvarParecer} style={{ padding: '10px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Confirmar Parecer</button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}