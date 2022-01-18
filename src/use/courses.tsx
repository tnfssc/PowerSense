import { useQuery, useQueryClient, useMutation } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";

import supabase from "../lib/supabase";
import ERRORS from "../constants/errors";

export type CoursesType = {
  id: number;
  name: string;
  description: string;
  question_paper: string | null;
};

export type CourseRegistrationsType = { user_id: string; course_id: number };

export type CourseType = CoursesType & { registered: boolean };

export const useCourse = (id: number) => {
  const course = useQuery<CourseType, PostgrestError>(
    "course",
    async () => {
      const { data, error } = await supabase.from<CourseType>("courses").select("*").eq("id", id).single();
      const registered = await supabase
        .from<CourseRegistrationsType>("course-registrations")
        .select()
        .eq("course_id", id)
        .single();
      if (error || (registered.error && registered.error.details !== ERRORS.SINGLE_ROW_NOT_FOUND.details))
        throw error || registered.error;
      const result = { ...data!, registered: !!registered.data };
      return result;
    },
    {
      refetchOnWindowFocus: false,
    },
  );
  const queryClient = useQueryClient();
  const mutation = useMutation<CoursesType, PostgrestError>(
    async () => {
      const registered = await supabase
        .from<CourseRegistrationsType>("course-registrations")
        .upsert({ course_id: id })
        .single();
      const { data, error } = await supabase.from<CoursesType>("courses").select("*").eq("id", id).single();
      if (error || (registered.error && registered.error.details !== ERRORS.SINGLE_ROW_NOT_FOUND.details))
        throw error || registered.error;
      const result = { ...data!, registered: !!registered.data };
      return result;
    },
    {
      onSuccess: () => queryClient.invalidateQueries<CoursesType>("course"),
    },
  );
  return { course, register: mutation };
};

export type CoursesList = Omit<Omit<CoursesType, "description">, "question_paper"> & { registered: boolean };

const useCourses = () => {
  const courses = useQuery<Array<CoursesList>, PostgrestError>(
    "courses",
    async () => {
      const { data, error } = await supabase.from<Omit<CoursesList, "registered">>("courses").select("id,name");
      const registered = await supabase
        .from<CourseRegistrationsType>("course-registrations")
        .select("user_id,course_id");
      if (error || registered.error) throw error || registered.error;
      const result = data!.map((course) => ({
        ...course,
        registered: registered.data!.some((reg) => reg.course_id === course.id),
      }));
      return result;
    },
    {
      refetchOnWindowFocus: false,
    },
  );
  return courses;
};

export default useCourses;
