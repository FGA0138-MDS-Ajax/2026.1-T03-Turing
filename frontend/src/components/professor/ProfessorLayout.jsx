import { ProfessorSidebar } from './ProfessorSidebar';
import './professor.css';

export function ProfessorLayout({ children }) {
  return (
    <div className="gs-professor-layout">
      <ProfessorSidebar />
      <main className="gs-professor-main">{children}</main>
    </div>
  );
}