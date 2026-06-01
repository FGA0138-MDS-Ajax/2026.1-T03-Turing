import { AdminLayout } from '../../components/admin/AdminLayout';
import GerenciamentoProfessores from '../Admin/Professores/professores';
import TeacherReview from '../Admin/TeacherReview/TeacherReview';

export function Professores() {
  return (
    <AdminLayout>
      <GerenciamentoProfessores />
      <TeacherReview />
    </AdminLayout>
  );
}