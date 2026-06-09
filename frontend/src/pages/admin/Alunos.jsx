import { AdminLayout } from '../../components/admin/AdminLayout';
import GerenciamentoAlunos from './/Alunos/alunos';

export function Alunos() {
  return (
    <AdminLayout>
      <GerenciamentoAlunos />
    </AdminLayout>
  );
}