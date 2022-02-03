import { useQuery, useQueryClient, useMutation } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";

import supabase from "../lib/supabase";
import ERRORS from "../constants/errors";

export type CoursesType = {
  id: number;
  name: string;
  description: string;
  question_paper: string | null;
  payment_link: string | null;
};

export type CourseRegistrationsType = { user_id: string; course_id: number; paid: boolean };

export type CourseType = CoursesType & { registered: boolean; paid: boolean };

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
      const result = { ...data!, registered: !!registered.data, paid: registered.data?.paid || false };
      return result;
    },
    {
      refetchOnWindowFocus: false,
    },
  );
  const queryClient = useQueryClient();
  const mutation = useMutation<CoursesType, PostgrestError>(
    async () => {
      const { status } = await fetch("/api/courses/register", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ course_id: id }),
      });
      if (status !== 200) throw new Error("Failed to register course");
      const registered = await supabase
        .from<CourseRegistrationsType>("course-registrations")
        .select()
        .eq("course_id", id)
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

export type CoursesList = Omit<Omit<Omit<CoursesType, "description">, "question_paper">, "payment_link"> & {
  registered: boolean;
  paid: boolean;
};

const useCourses = (all = false) => {
  const courses = useQuery<Array<CoursesList>, PostgrestError>(
    "courses",
    async () => {
      const { data, error } = await supabase.from<Omit<CoursesList, "registered">>("courses").select("id,name");
      const registered = await supabase
        .from<CourseRegistrationsType>("course-registrations")
        .select("user_id,course_id,paid");
      if (error || registered.error) throw error || registered.error;
      const result = data!.map((course) => ({
        ...course,
        registered: registered.data!.some((reg) => reg.course_id === course.id),
        paid: registered.data!.find((reg) => reg.course_id === course.id)?.paid ?? false,
      }));
      if (all) return result;
      return result.filter((course) => course.registered);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
  return courses;
};

export default useCourses;
