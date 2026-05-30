import { AdminLayout } from '../../components/admin/AdminLayout';

export function Professores() {
  return (
    <AdminLayout>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1C2B3A', margin: 0 }}>
        Professores
      </h1>
      <p style={{ color: '#7A8A96', fontSize: 13 }}>Gerenciamento de professores.</p>
    </AdminLayout>
  );
}