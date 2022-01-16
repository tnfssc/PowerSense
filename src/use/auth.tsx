import { useEffect, useState } from "react";
import { User, AuthChangeEvent } from "@supabase/supabase-js";

import supabase from "../lib/supabase";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(supabase.auth.user() ?? null);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((e, s) => {
      if (e === "SIGNED_IN" || e === "TOKEN_REFRESHED") {
        setUser(s?.user as User);
      } else if (e === "SIGNED_OUT") {
        setUser(null);
      } else {
        console.error("Unhandled auth event", e, s);
      }
    });
    return () => data?.unsubscribe();
  }, [setUser]);
  return user;
}
