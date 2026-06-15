import { Bell, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AlunoSidebar } from './AlunoSidebar';
import '../../styles/layout-shared.css';

export function AlunoLayout({ children }) {
  const { user } = useAuth();

  const iniciais = user?.nome
    ? user.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'A';

  return (
    <div className="gs-professor-layout">
      <AlunoSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        <header className="gs-topbar-wrapper">
          <div className="gs-topbar-right">
            <button className="gs-icon-btn" aria-label="Notificações">
              <Bell size={17} />
            </button>
            <button className="gs-icon-btn" aria-label="Configurações">
              <Settings size={17} />
            </button>
            <div className="gs-topbar-user">
              <div>
                <p className="gs-topbar-name">{user?.nome ?? 'Aluno'}</p>
                <p className="gs-topbar-role">Aluno</p>
              </div>
              <div className="gs-topbar-avatar">{iniciais}</div>
            </div>
          </div>
        </header>

        <main className="gs-professor-main">
          <div className="gs-page-content" style={{ flex: 1, padding: '40px', overflowY: 'auto', backgroundColor: '#F2EFE9', minWidth: 0, height: '100%' }}>
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}