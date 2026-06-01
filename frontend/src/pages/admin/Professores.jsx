import { AdminLayout } from '../../components/admin/AdminLayout';
import GerenciamentoProfessores from '../Admin/Professores/professores';

export function Professores() {
  return (
    <AdminLayout>
      <GerenciamentoProfessores />
    </AdminLayout>
  );
}