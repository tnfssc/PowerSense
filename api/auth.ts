import type { VercelApiHandler } from "@vercel/node";
import supabase from "../api-utils/supabase";

const handler: VercelApiHandler = async (req, res) => supabase.auth.api.setAuthCookie(req, res);

export default handler;
