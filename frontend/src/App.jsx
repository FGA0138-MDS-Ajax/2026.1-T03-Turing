import { BrowserRouter } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { AppRoutes }     from './routes/AppRoutes';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <AppRoutes />
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}