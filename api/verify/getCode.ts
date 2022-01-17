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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      error.status &&
      typeof error.status === "number" &&
      error.status >= 400 &&
      error.status < 500
    ) {
      return res.status(error.status).json({ error });
    }
    return res.status(500).json({ error });
  }
};

export default handler;
