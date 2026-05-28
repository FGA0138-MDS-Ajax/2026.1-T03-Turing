import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute }  from './ProtectedRoute';
import { AdminProvider }   from '../context/AdminContext';
import { AdminDashboard }  from '../pages/admin/AdminDashboard';
import { Professores }     from '../pages/admin/Professores';
import { Alunos }          from '../pages/admin/Alunos';
import { Configuracoes }   from '../pages/admin/Configuracoes';
import Login               from '../pages/Login/Login';
import Register            from '../pages/Register/Register';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminProvider>
              <Routes>
                <Route path="/"              element={<AdminDashboard />} />
                <Route path="/professores"   element={<Professores />} />
                <Route path="/alunos"        element={<Alunos />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Routes>
            </AdminProvider>
          </ProtectedRoute>
        }
      />

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