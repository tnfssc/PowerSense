import type { VercelApiHandler } from "@vercel/node";
import supabase from "../../../api-utils/supabase";
import { CourseRegistrations } from "../../types/supabase/tables.d";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error });
  const course_id = req.body.course_id as number;
  const { data, error: keyError } = await supabase
    .from<CourseRegistrations>("course-registrations")
    .select("key")
    .eq("user_id", user.id)
    .eq("course_id", course_id)
    .single();
  if (keyError || !data) return res.status(500).json({ error: keyError });
  const code = data.key;
  try {
    let { data, error } = await supabase.storage.from("questionpapers").download(`${user.id}/${course_id}/key.json`);
    if (error?.message === "The resource was not found") {
      const { error: moveError } = await supabase.storage
        .from("questionpapers")
        .move(`unused/key_${code}.json`, `${user.id}/${course_id}/key.json`);
      if (moveError) return res.status(500).json({ error: moveError });
      const { data: _data, error: _error } = await supabase.storage
        .from("questionpapers")
        .download(`${user.id}/${course_id}/key.json`);
      data = _data;
      error = _error;
    }
    if (!data || error) return res.status(404).json({ error });
    return res.status(200).json({ data: JSON.parse(await data.text()) });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default handler;
