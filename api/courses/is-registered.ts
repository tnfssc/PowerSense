import type { VercelApiHandler } from "@vercel/node";
import supabase from "../../api-utils/supabase";
import razorpay from "../../api-utils/razorpay";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error });
  const course_id = req.body.course_id as number;
  // const email = user.email!;
  try {
    return res.json(await razorpay.paymentLink.fetch("plink_Iql5A02NvsBnal"));
    const r = await supabase
      .from<{ user_id: string; course_id: number }>("course-registrations")
      .select()
      .eq("user_id", user.id)
      .eq("course_id", course_id)
      .single();
    if (!r.error) return res.status(200).json({ success: true });
    else return res.status(500).json({ error: r.error });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export default handler;
