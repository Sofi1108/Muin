import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Customer } from "../../types.ts";

interface UserContextType {
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch("http://localhost:3000/api/auth/me", {
      credentials: "include",
      headers,
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autenticado");
        return res.json();
      })
      .then((data) => {
        if (data.customer) setCustomer(data.customer);
      })
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider
      value={{ customer, setCustomer, loading, setLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }
  return context;
}
