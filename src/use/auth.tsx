import { useEffect, useState, createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";

import supabase from "../lib/supabase";

const AuthContext = createContext<User | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(supabase.auth.user());
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((e, s) => {
      if (e === "SIGNED_IN" || e === "TOKEN_REFRESHED") {
        setUser(s?.user as User);
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event: e, session: s }),
        });
      } else if (e === "SIGNED_OUT") {
        setUser(null);
      } else {
        console.error("Unhandled auth event", e, s);
      }
    });
    return () => data?.unsubscribe();
  }, [setUser]);
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export default function useAuth() {
  const user = useContext(AuthContext);
  return user;
}
