import { useQuery, useQueryClient } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";

import supabase from "../lib/supabase";

export type PhonesType = {
  id: string;
  phone: string;
};

const usePhones = (id?: string) => {
  const phone = useQuery<PhonesType, PostgrestError>(
    "phones",
    async () => {
      const { data, error } = await supabase.from<PhonesType>("phones").select("*").single();
      if (error) throw error;
      return data ?? { id: id ?? "", phone: "" };
    },
    { retry: false, refetchOnWindowFocus: false },
  );
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries("phones");
  return { phone, invalidate };
};

export default usePhones;
