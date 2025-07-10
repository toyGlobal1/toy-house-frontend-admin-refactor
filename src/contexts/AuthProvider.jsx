import { createContext, useState } from "react";
import { getAuthToken } from "../lib/auth-token.util";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const token = getAuthToken();

  const [isAuthenticated, setIsAuthenticated] = useState(token ? true : false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
