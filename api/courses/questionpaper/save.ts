import type { VercelApiHandler } from "@vercel/node";
import supabase from "../../../api-utils/supabase";
import { Paper } from "../../types/questionpapers/solutions.d";
import { CourseRegistrations } from "../../types/supabase/tables.d";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error });
  const answers = req.body.answers as Paper;
  const course_id = req.body.course_id as number;
  try {
    const { error } = await supabase
      .from<CourseRegistrations>("course-registrations")
      .update({ answers })
      .eq("user_id", user.id)
      .eq("course_id", course_id);
    if (error) return res.status(404).json({ error });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default handler;
