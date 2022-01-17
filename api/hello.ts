import type { VercelApiHandler } from "@vercel/node";

const handler: VercelApiHandler = async (req, res) => {
  res.status(200).json({ hello: "world" });
};

export default handler;
