import { useQuery, useQueryClient, useMutation } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";

import supabase from "../lib/supabase";
import ERRORS from "../constants/errors";

import { MCASolnFile, MCA } from "../../api/types/questionpapers/solutions.d";

export type CoursesType = {
  id: number;
  name: string;
  description: string;
};

export type CourseRegistrationsType = {
  user_id: string;
  course_id: number;
  paid: boolean;
  question_paper_downloaded_at: string | null;
  answers: MCA[] | null;
};

export type CourseType = CoursesType & {
  registered: boolean;
  paid: boolean;
  question_paper_downloaded_at: string | null;
  answers: MCA[] | null;
};

export const useCourse = (id: number) => {
  const course = useQuery<CourseType, PostgrestError>(
    `course-${id}`,
    async () => {
      const { data, error } = await supabase.from<CourseType>("courses").select("*").eq("id", id).single();
      const registered = await supabase
        .from<CourseRegistrationsType>("course-registrations")
        .select()
        .eq("course_id", id)
        .single();
      if (error || (registered.error && registered.error.details !== ERRORS.SINGLE_ROW_NOT_FOUND.details))
        throw error || registered.error;
      const result = {
        ...data!,
        registered: !!registered.data,
        paid: registered.data?.paid || false,
        question_paper_downloaded_at: registered.data?.question_paper_downloaded_at ?? null,
        answers: registered.data?.answers ?? null,
      };
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
      onSuccess: () => queryClient.invalidateQueries<CoursesType>(`course-${id}`),
    },
  );
  return { course, register: mutation };
};

export type CoursesList = Omit<CoursesType, "description"> & {
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

export const useKey = (id: number) => {
  const key = useQuery<MCASolnFile, PostgrestError>(
    `course-key-${id}`,
    async () => {
      const res = await fetch("/api/courses/questionpaper/key", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ course_id: id }),
      });
      if (res.status !== 200) throw new Error("Error");
      const { data } = (await res.json()) as { data: MCASolnFile };
      return data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
  return key;
};

export default useCourses;
