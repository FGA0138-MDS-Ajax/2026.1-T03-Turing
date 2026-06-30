import { AdminLayout } from '../../components/admin/AdminLayout';

export function Alunos() {
  return (
    <AdminLayout>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1C2B3A', margin: 0 }}>
        Alunos
      </h1>
      <p style={{ color: '#7A8A96', fontSize: 13 }}>Gerenciamento de alunos.</p>
    </AdminLayout>
  );
}

export function Configuracoes() {
  return (
    <AdminLayout>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#02373a', margin: 0, fontFamily: 'Serif' }}>
        Configurações
      </h1>
      <p style={{ color: '#7A8A96', fontSize: 13 }}>Configurações do sistema.</p>
    </AdminLayout>
  );
}