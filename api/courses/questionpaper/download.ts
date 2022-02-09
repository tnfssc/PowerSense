import type { VercelApiHandler } from "@vercel/node";
import supabase from "../../../api-utils/supabase";
import { CourseRegistrations } from "../../types/supabase/tables.d";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error });
  const course_id = req.body.course_id as number;
  try {
    const {
      data: { question_paper_link, question_paper_downloaded_at },
    } = await supabase
      .from<CourseRegistrations>("course-registrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", course_id)
      .single();
    if (!question_paper_link) {
      return res.status(404).json({ error: "Question paper not found" });
    }
    if (question_paper_downloaded_at) {
      return res.status(200).json({ question_paper: question_paper_link });
    }
    const r = await supabase
      .from<CourseRegistrations>("course-registrations")
      .update({ question_paper_downloaded_at: new Date() })
      .eq("user_id", user.id)
      .eq("course_id", course_id)
      .single();
    if (!r.error) return res.status(200).json({ question_paper: r.data.question_paper_link });
    else return res.status(500).json({ error: r.error });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default handler;
