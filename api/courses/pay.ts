import type { VercelApiHandler } from "@vercel/node";
import type { RazorpayPaymentLinkRequest } from "../types/razorpay";
import type { Courses } from "../types/supabase/tables";

import supabase from "../../api-utils/supabase";
import razorpay from "../../api-utils/razorpay";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error });
  const course_id = req.body.course_id as number;
  const {
    data: { name: course_name },
    error: error2,
  } = await supabase.from<Courses>("courses").select().eq("id", course_id).single();
  if (error2) return res.status(500).json({ error: error2 });

  try {
    const params: RazorpayPaymentLinkRequest = {
      amount: 100,
      currency: "INR",
      description: `${course_name} payment`,
      customer: {
        email: "gaurav.kumar@example.com",
        contact: "+919999999999",
      },
      notify: {
        sms: true,
        email: true,
      },
      reference_id: `${user.id}+${course_id}`,
    };
    const r = await razorpay.paymentLink.create(params);
    console.log(JSON.stringify({ razorpayCreatePaymentLinkResponse: r }, null, 2));
    if (!r.error) return res.status(200).json({ success: true });
    else return res.status(500).json({ error: r.error });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default handler;
