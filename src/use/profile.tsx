import { useQuery, useQueryClient, useMutation } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";

import supabase from "../lib/supabase";
import ERRORS from "../constants/errors";

export type ProfileType = {
  id: string;
  displayName: string;
  designation: string;
  role: string;
  organization: string;
  department: string;
  rollNumber: string;
};

const useProfile = (id?: string) => {
  const profile = useQuery<ProfileType, PostgrestError>(
    "profile",
    async () => {
      const { data, error } = await supabase.from<ProfileType>("profiles").select("*").single();
      if (error && error.details !== ERRORS.SINGLE_ROW_NOT_FOUND.details) throw error;
      return (
        data ?? {
          id: id ?? "",
          displayName: "",
          designation: "",
          role: "",
          organization: "",
          department: "",
          rollNumber: "",
        }
      );
    },
    {
      refetchOnWindowFocus: false,
    },
  );
  const queryClient = useQueryClient();
  const mutation = useMutation<ProfileType, PostgrestError, ProfileType>(
    async (profile) => {
      const { data, error } = await supabase.from<ProfileType>("profiles").upsert(profile).single();
      if (error) throw error;
      return data!;
    },
    {
      onSuccess: () => queryClient.invalidateQueries<ProfileType>("profile"),
    },
  );
  return { profile, mutation };
};

export default useProfile;
