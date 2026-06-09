import {AdminLayout} from '../../components/admin/AdminLayout';
import GerenciamentoProfessores from './/Professores/professores';
import TeacherReview from './/TeacherReview/TeacherReview';

export function Professores() {
    return (
        <AdminLayout>
            <GerenciamentoProfessores/>
            <TeacherReview/>
        </AdminLayout>
    );
}