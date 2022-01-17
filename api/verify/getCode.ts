import type { VercelApiHandler } from "@vercel/node";
import twilioVerify from "../../api-utils/twilio/verify";

import supabase from "../../api-utils/supabase";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error });
  const phoneNumber = req.body.phoneNumber as string;
  try {
    await twilioVerify.verifications.create({ to: phoneNumber, channel: "sms" });
    res.status(200).json({ success: true });
  } catch (error) {
    if (typeof error === "object" && error.status === 400) {
      return res.status(400).json({ error });
    }
    return res.status(500).json({ error });
  }
};

export default handler;
