import type { VercelApiHandler } from "@vercel/node";
// import supabase from "../../../api-utils/supabase";

const handler: VercelApiHandler = async (req, res) => {
  try {
    console.log(req.body);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export default handler;
