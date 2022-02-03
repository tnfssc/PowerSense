export interface CourseRegistrations {
  user_id: string;
  course_id: number;
  registered_at: number;
  paid: boolean;
}

export interface Courses {
  id: number;
  name: string;
  description: string;
  question_paper: string | null;
  payment_link: string | null;
  registered: boolean;
}
