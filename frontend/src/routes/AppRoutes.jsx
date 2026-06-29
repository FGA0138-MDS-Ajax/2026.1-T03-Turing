import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute }  from './ProtectedRoute';
import { AdminProvider }   from '../context/AdminContext';
import { AdminDashboard }  from '../pages/admin/AdminDashboard';
import { Professores }     from '../pages/admin/Professores';
import { Alunos }          from '../pages/admin/Alunos';
import { Configuracoes }   from '../pages/admin/Configuracoes';
import { ProfessorDashboard }  from '../pages/professor/ProfessorDashboard';
import { ProfessorConteudos }    from '../pages/professor/ProfessorConteudos';
import { ProfessorMateriais }    from '../pages/professor/ProfessorMateriais';
import { ProfessorConfiguracoes } from '../pages/professor/ProfessorConfiguracoes';
import { AlunoDashboard }  from '../pages/aluno/AlunoDashboard';
import { AlunoConteudosExplorar } from '../pages/Aluno/AlunoConteudosExplorar';
import { AlunoMateriais }  from '../pages/aluno/AlunoMateriais';
import { AlunoMaterialDetalhe } from '../pages/Aluno/AlunoMaterialDetalhe';
import { AlunoConfiguracoes } from '../pages/aluno/AlunoConfiguracoes';
import Login               from '../pages/Login/Login';
import Register            from '../pages/Register/Register';
import TeacherReview       from '../pages/admin/TeacherReview/TeacherReview';
import ProfessorConteudo   from "../pages/Professor/ProfessorConteudo/ProfessorConteudo";
import ForumProfessor      from "../pages/Professor/ForumProfessor/ForumProfessor";
import { Disciplinas }     from '../pages/Disciplinas/Disciplinas';
import { MeusConteudos } from '../pages/Aluno/MeusConteudos/MeusConteudos';
import { ConteudoEspecifico } from '../pages/Aluno/ConteudoEspecifico/ConteudoEspecifico';
import { AlunoLayout }      from '../components/aluno/AlunoLayout';
import { ForumConteudo } from '../pages/Aluno/Forum/ForumConteudo';
import Denuncias from '../pages/admin/Denuncias';

function AdminLayout() {
  return (
    <AdminProvider>
      <Outlet />
    </AdminProvider>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index                       element={<AdminDashboard />} />
        <Route path="professores"          element={<Professores />} />
        <Route path="alunos"               element={<Alunos />} />
        <Route path="configuracoes"        element={<Configuracoes />} />
        <Route path="professores/revisao"  element={<TeacherReview />} />
        <Route path="conteudos"            element={<Disciplinas />} />
        <Route path="denuncias"            element={<Denuncias />} />
      </Route>

      <Route
        path="/professor"
        element={
          <ProtectedRoute requiredRole="professor">
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfessorDashboard />} />
        <Route path="conteudos"            element={<ProfessorConteudos />} />
        <Route path="conteudos/:id"        element={<ProfessorConteudo />} />
        <Route path="conteudos/:id/forum"  element={<ForumProfessor />} />
        <Route path="materiais"            element={<ProfessorMateriais />} />
        <Route path="configuracoes"        element={<ProfessorConfiguracoes />} />
      </Route>

      <Route
        path="/aluno"
        element={
          <ProtectedRoute requiredRole="aluno">
            <AlunoLayout>
              <Outlet />
            </AlunoLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<AlunoDashboard />} />
        <Route path="conteudos" element={<MeusConteudos />} />
        <Route path="conteudos/:id" element={<ConteudoEspecifico />} />
        <Route path="explorar" element={<AlunoConteudosExplorar />} />
        <Route path="materiais" element={<AlunoMateriais />} />
        <Route path="materiais/:id" element={<AlunoMaterialDetalhe />} />
        <Route path="configuracoes" element={<AlunoConfiguracoes />} />
        <Route path="conteudos/:id/forum" element={<ForumConteudo />} />
      </Route>

      <Route
        path="/403"
        element={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '4rem', color: '#C45C2E' }}>403</h1>
              <p>Você não tem permissão para acessar esta página.</p>
            </div>
          </div>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}