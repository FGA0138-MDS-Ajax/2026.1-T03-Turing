import { Sidebar } from './Sidebar';
import './admin.css';

export function AdminLayout({ children }) {
  return (
    <div className="gs-admin-layout">
      <Sidebar />
      <main className="gs-admin-main">{children}</main>
    </div>
  );
}