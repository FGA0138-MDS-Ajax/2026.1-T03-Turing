import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import './aluno.css';

export function AlunoLayout({ children }) {
  const { user, logout } = useAuth();
  
  const userName = user?.nome || 'João Silva';
  const userRole = 'Aluno';
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="gs-aluno-app">
      
      {/* CABEÇALHO SUPERIOR */}
      <header className="gs-aluno-header-global">
        <div className="gs-header-logo">
          <span className="gs-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F5D62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </span> 
          <span className="gs-logo-text" style={{ color: '#101828', fontWeight: 'bold' }}>GoStudy</span>
        </div>
        
        <div className="gs-header-user-area">
          <div className="gs-header-user-text">
            <span className="gs-header-user-name">{userName}</span>
            <span className="gs-header-user-role">{userRole}</span>
          </div>
          <div className="gs-header-avatar">{userInitials}</div>
          <button className="gs-header-logout" onClick={logout} aria-label="Sair">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* CORPO DA PÁGINA (SIDEBAR + CONTEÚDO) */}
      <div className="gs-aluno-body-wrapper">
        
        {/* SIDEBAR EMBUTIDA */}
        <aside className="gs-sidebar">
          <nav className="gs-sidebar-nav">
            <NavLink to="/aluno/dashboard" className={({ isActive }) => `gs-nav-item ${isActive ? 'gs-nav-item--active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Dashboard
            </NavLink>
            
            <NavLink to="/aluno/conteudos" className={({ isActive }) => `gs-nav-item ${isActive ? 'gs-nav-item--active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Conteúdos
            </NavLink>
            
            <NavLink to="/aluno/materiais" className={({ isActive }) => `gs-nav-item ${isActive ? 'gs-nav-item--active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Materiais
            </NavLink>
            
            <NavLink to="/aluno/configuracoes" className={({ isActive }) => `gs-nav-item ${isActive ? 'gs-nav-item--active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Configurações
            </NavLink>
          </nav>
        </aside>

        <main className="gs-aluno-main">
          {children}
        </main>
      </div>
    </div>
  );
}