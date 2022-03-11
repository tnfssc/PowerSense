export interface CourseRegistrations {
  user_id: string;
  course_id: number;
  registered_at: number;
  paid: boolean;
  question_paper_downloaded_at: Date | null;
}

export interface Courses {
  id: number;
  name: string;
  description: string;
  payment_link: string | null;
  registered: boolean;
}
