import type { VercelApiHandler } from "@vercel/node";
import supabase from "../../../api-utils/supabase";
import { CourseRegistrations } from "../../types/supabase/tables.d";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error });
  const course_id = req.body.course_id as number;
  try {
    const {
      data: { question_paper_downloaded_at },
    } = await supabase
      .from<CourseRegistrations>("course-registrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", course_id)
      .single();
    let { signedURL, error } = await supabase.storage
      .from("questionpapers")
      .createSignedUrl(`${user.id}/${course_id}/questionpaper.pdf`, 60 * 60);
    if (error && error.message === "The resource was not found") {
      const { data: list, error: listError } = await supabase.storage.from("questionpapers").list("unused");
      if (listError || !list) return res.status(500).json({ error: listError });
      if (list.length === 0) return res.status(500).json({ error: { message: "Please contact admin" } });
      const { error: moveError1 } = await supabase.storage
        .from("questionpapers")
        .move(`unused/${list[0].name}`, `${user.id}/${course_id}/questionpaper.pdf`);
      const { error: moveError2 } = await supabase.storage
        .from("questionpapers")
        .move(`unused/${`key_${list[0].name.split("_")[1].split(".")[0]}.json`}`, `${user.id}/${course_id}/key.json`);
      if (moveError1 || moveError2) return res.status(500).json({ error: { moveError1, moveError2 } });
      const { signedURL: _signedURL, error: _error } = await supabase.storage
        .from("questionpapers")
        .createSignedUrl(`${user.id}/${course_id}/questionpaper.pdf`, 60 * 60);
      signedURL = _signedURL;
      error = _error;
    }
    if (!signedURL) {
      return res.status(404).json({ error });
    }
    if (question_paper_downloaded_at) {
      return res.status(200).json({ question_paper: signedURL });
    }
    const r = await supabase
      .from<CourseRegistrations>("course-registrations")
      .update({ question_paper_downloaded_at: new Date() })
      .eq("user_id", user.id)
      .eq("course_id", course_id)
      .single();
    if (!r.error) return res.status(200).json({ question_paper: signedURL });
    else return res.status(500).json({ error: r.error });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default handler;
