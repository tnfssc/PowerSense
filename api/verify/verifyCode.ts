import type { VercelApiHandler } from "@vercel/node";
import twilioVerify from "../../api-utils/twilio/verify";

import supabase from "../../api-utils/supabase";

type Phones = {
  id: string;
  phone: string;
};

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) return res.status(401).json({ error: error.message });
  const code = req.body.code as string;
  const phoneNumber = req.body.phoneNumber as string;
  try {
    const verificationResult = await twilioVerify.verificationChecks.create({ to: phoneNumber, code });
    if (verificationResult.status === "approved") {
      await supabase.from<Phones>("phones").upsert({ id: user.id, phone: phoneNumber });
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ error: "Invalid verification code" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default handler;
