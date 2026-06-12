import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout-shared.css'
import minhaLogo from '../../assets/minha-logo.png';

const NAV_ITEMS = [
  { to: '/professor', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/professor/conteudos', label: 'Conteúdos', icon: BookOpen },
  { to: '/professor/materiais', label: 'Materiais', icon: FileText },
  { to: '/professor/configuracoes', label: 'Configurações', icon: Settings },
];

export function ProfessorSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const iniciais = user?.nome
    ? user.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : 'P';

  return (
    <aside className="gs-sidebar">
      <div className="gs-sidebar-logo">
        <div className="gs-logo-icon">
          <img 
             src={minhaLogo} 
             alt="Logo GoStudy" 
             style={{ width: '190px', height: 'auto' }} 
          />
        </div>
        <span className="gs-logo-text">
          <span className="gs-destaque">G</span>o<span className="gs-destaque">S</span>tudy
        </span>
      </div>

      <nav className="gs-sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              'gs-nav-item' + (isActive ? ' gs-nav-item--active' : '')
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="gs-sidebar-bottom">
        <button className="gs-sidebar-user" onClick={handleLogout} title="Sair">
          <div className="gs-user-avatar">{iniciais}</div>
          <LogOut size={16} className="gs-sidebar-logout-icon" />
        </button>
      </div>
    </aside>
  );
}