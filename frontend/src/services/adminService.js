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
    const response = await api.get('/admin/activity/recent');
    return response.data;
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