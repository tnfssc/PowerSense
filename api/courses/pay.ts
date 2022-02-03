import type { VercelApiHandler } from "@vercel/node";
import type { RazorpayPaymentLinkRequest, RazorpayPaymentLinkResponse } from "../types/razorpay";
import type { Courses } from "../types/supabase/tables";

import supabase from "../../api-utils/supabase";
import razorpay from "../../api-utils/razorpay";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error });
  const course_id = req.body.course_id as number;
  const { data, error: error2 } = await supabase.from<Courses>("courses").select().eq("id", course_id).single();
  const course_name = data!.name;
  if (error2) return res.status(500).json({ error: error2 });
  try {
    const params: RazorpayPaymentLinkRequest = {
      amount: 100,
      currency: "INR",
      description: `${course_name} payment`,
      customer: {
        email: `${user.email}`,
      },
      notify: {
        sms: true,
        email: true,
      },
      reference_id: `${user.id}+${course_id}`,
      expire_by: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week
    };
    const r = (await razorpay.paymentLink.create(params)) as RazorpayPaymentLinkResponse;
    if (r) return res.status(200).json({ payment_link: r.short_url });
    else return res.status(500).json({ error: "Failed to create payment link" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default handler;
