import type { VercelApiHandler } from "@vercel/node";
import supabase from "../api-utils/supabase";

const handler: VercelApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) {
    res.status(401).json({ error });
  } else {
    res.json({
      message: `Hello ${user.email}!`,
      user,
    });
  }
};

export default handler;
