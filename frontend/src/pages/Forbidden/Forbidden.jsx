import { Link } from "react-router-dom";
import "./Forbidden.css";

export default function Forbidden() {
  return (
    <div className="forbidden-page">
      <div className="forbidden-card">
        <h1>403</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <Link to="/login" className="forbidden-button">
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}
