import type { VercelApiHandler } from "@vercel/node";
import supabase from "../../api-utils/supabase";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error });
  const course_id = req.body.course_id as number;
  try {
    const r = await supabase
      .from<{ user_id: string; course_id: number }>("course-registrations")
      .upsert({ user_id: user.id, course_id }).single();
    if (!r.error) return res.status(200).json({ success: true });
    else return res.status(500).json({ error: r.error });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default handler;
