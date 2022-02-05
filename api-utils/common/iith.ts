import type { User } from "@supabase/supabase-js";

export function isIITH(user: User): boolean {
  return user.email?.endsWith("@iith.ac.in") ?? false;
}
