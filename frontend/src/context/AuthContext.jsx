import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // TODO: chamar serviço de autenticação real
    // Exemplo: const data = await authService.login(email, password);
    setUser({ email });
  };

  const register = async (fullName, email, accountType, password) => {
    // TODO: chamar serviço de registro real
    setUser({ fullName, email, accountType });
  };

  const logout = () => {
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

