import { BrowserRouter } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { AppRoutes }     from './routes/AppRoutes';
import { useEffect }     from 'react';
import { loadAccessibilitySettings } from './services/configuracoesAcessibilidadeService';
import { applyAccessibilityPreferences } from './utils/preferenciasAcessibilidade';
import './App.css';

export default function App() {
  useEffect(() => {
    async function init() {
      const result = await loadAccessibilitySettings();
      applyAccessibilityPreferences(result.settings);
    }
    init();
  }, []);

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