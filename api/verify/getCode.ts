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
    return res.status(error?.status ?? 500).json({ error });
  }
};

export default handler;
