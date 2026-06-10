import { AlunoSidebar } from './AlunoSidebar';
import '../../components/professor/professor.css';

export function AlunoLayout({ children }) {
  return (
    <div className="gs-professor-layout">
      <AlunoSidebar />
      <main className="gs-professor-main">{children}</main>
    </div>
  );
}