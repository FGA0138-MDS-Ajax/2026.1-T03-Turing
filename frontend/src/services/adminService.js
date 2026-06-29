import api from './api';

export const adminService = {
  async getStats() {
    const [alunosRes, professoresRes, disciplinasRes, conteudosRes] = await Promise.all([
      api.get('/api/usuarios/alunos/'),
      api.get('/api/usuarios/professores/'),
      api.get('/api/disciplinas/'),
      api.get('/api/disciplinas/conteudos/'),
    ]);

    const alunos      = Array.isArray(alunosRes.data)       ? alunosRes.data       : [];
    const professores = Array.isArray(professoresRes.data)   ? professoresRes.data   : [];
    const disciplinas = Array.isArray(disciplinasRes.data)   ? disciplinasRes.data   : [];
    const conteudos   = Array.isArray(conteudosRes.data)     ? conteudosRes.data     : [];

    return {
      totalUsuarios:       alunos.length + professores.length,
      professoresAtivos:   professores.length,
      alunosMatriculados:  alunos.length,
      disciplinasAtivas:   disciplinas.length,
      conteudosAtivos:     conteudos.length,
    };
  },
  async getRecentActivity() {
    const response = await api.get('/api/interacoes/denuncias/');
    const dados = Array.isArray(response.data)
      ? response.data
      : response.data?.results ?? [];

    return dados.slice(0, 10).map(d => {
      const statusLabel = {
        pendente: '🔴 Pendente',
        analisado: '🟡 Em análise',
        recusado: '🟢 Recusado',
      }[d.status] || d.status;

      const data = d.data_create
        ? new Date(d.data_create).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })
        : '—';

      return {
        id: d.id,
        actor: d.denunciante_nome || 'Usuário',
        type: 'aluno',
        description: `Denúncia contra ${d.denunciado_nome || 'usuário'} — ${d.motivo || 'sem motivo'}`,
        subject: statusLabel,
        timeAgo: data,
      };
    });
  },

  async createAdmin(data) {
    const response = await api.post('/admin/create', data);
    return response.data;
  },

  async getAdmins() {
    const response = await api.get('/admin/list');
    return response.data;
  },
};