import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getUserFromToken(token) {
  const payload = parseJwt(token);
  if (!payload) return null;
  return {
    email: payload.email,
    nome: payload.nome,
    role: payload.role,
    tipo: payload.tipo,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    return token ? getUserFromToken(token) : null;
  });

  const login = async (email, password) => {
    const response = await api.post("/api/usuarios/login/", {
      email,
      password,
    });

    const token = response.data.access || response.data.token;
    if (!token) {
      throw new Error("Não foi possível obter o token de autenticação.");
    }

    localStorage.setItem("authToken", token);
    const loggedUser = getUserFromToken(token);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (fullName, email, accountType, password) => {
    // TODO: implementar registro real quando o endpoint estiver disponível.
    setUser({ fullName, email, accountType });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

