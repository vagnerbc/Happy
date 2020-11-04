import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(data: SignInData): Promise<void>;
  signOut(): void;
}

interface SignInData {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storageUser = localStorage.getItem("@HAPPY:USER");
    const storageToken = localStorage.getItem("@HAPPY:AUTH_TOKEN");

    if (storageUser && storageToken) {
      setUser(JSON.parse(storageUser));
      // api.defaults.headers["Authorization"] = `Bearer ${storageToken}`;
      setLoading(false);
    }
  }, []);

  const signIn = async ({ email, password }: SignInData) => {
    const { data } = await api.post("/authenticate", { email, password });

    setUser(data.user);

    // api.defaults.headers["Authorization"] = `Bearer ${data.token}`;

    localStorage.setItem("@HAPPY:USER", JSON.stringify(data.user));
    localStorage.setItem("@HAPPY:AUTH_TOKEN", data.token);
  };

  const signOut = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("@HAPPY:AUTH_TOKEN");
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
