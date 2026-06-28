import { Sidebar } from './Sidebar';
import { Bell, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import '../../styles/layout-shared.css'

export function AdminLayout({ children }) {
 const { user } = useAuth();
 const navigate = useNavigate();

  const iniciais = user?.nome
    ? user.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'P';

  return (
    <div className="gs-professor-layout">
      <Sidebar/>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        <header className="gs-topbar-wrapper">
          <div className="gs-topbar-right">
            <button className="gs-icon-btn" aria-label="Notificações">
              <Bell size={17} />
            </button>
            <button
                className="gs-icon-btn"
                aria-label="Configurações"
                onClick={() => navigate("/admin/configuracoes")}
            >
                <Settings size={17} />
            </button>
            <div className="gs-topbar-user">
              <div>
                <p className="gs-topbar-name">{user?.nome ?? 'Professor'}</p>
                <p className="gs-topbar-role">Administrador</p>
              </div>
              <div className="gs-topbar-avatar">{iniciais}</div>
            </div>
          </div>
        </header>

        <main className="gs-professor-main">
          <div className="gs-page-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}