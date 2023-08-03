import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "@/session"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);

  // Remove session to log out
  await session.destroy();

  return res.status(200).json({ message: "Logged out" });

}