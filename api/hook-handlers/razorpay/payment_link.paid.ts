import type { VercelApiHandler } from "@vercel/node";
import type { RazorpayRequest } from "../../types/razorpay";
import type { CourseRegistrations } from "../../types/supabase/tables";
import supabase from "../../../api-utils/supabase";

const handler: VercelApiHandler = async (req, res) => {
  try {
    const [user_id, course_id] = (req.body as RazorpayRequest).payload.payment_link.entity.reference_id.split("+");
    const { error } = await supabase
      .from<CourseRegistrations>("course-registrations")
      .update({ paid: true })
      .eq("user_id", user_id)
      .eq("course_id", course_id);
    if (error) return res.status(500).json({ error });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export default handler;
