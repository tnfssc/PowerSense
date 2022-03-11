import type { VercelApiHandler } from "@vercel/node";
import supabase from "../../../api-utils/supabase";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error });
  const course_id = req.body.course_id as number;
  try {
    const { data, error } = await supabase.storage.from("questionpapers").download(`${user.id}/${course_id}/key.json`);
    if (!data || error) return res.status(404).json({ error });
    return res.status(200).json({ data: JSON.parse(await data.text()) });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default handler;
