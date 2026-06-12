import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout-shared.css'

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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="12,2 23,7.5 12,13 1,7.5" fill="#1A7A8A"/>
            <path d="M6 10.2V16.5C6 16.5 8.5 19.5 12 19.5C15.5 19.5 18 16.5 18 16.5V10.2" fill="#1A7A8A" opacity="0.55"/>
            <line x1="23" y1="7.5" x2="23" y2="15" stroke="#1A7A8A" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="23" cy="15.5" r="1.2" fill="#1A7A8A"/>
          </svg>
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