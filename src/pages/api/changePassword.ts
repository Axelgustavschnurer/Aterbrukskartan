// This endpoint is used to change the password of a user *WHO IS LOGGED IN AND KNOWS THEIR CURRENT PASSWORD*.

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, createResponse } from "@/session"
import prisma from "@/prismaClient"
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  res.setHeader("Allow", "POST")

  // Make sure the request is a POST request
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Make sure the user is logged in
  if (!session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Get the old and new password from the request body
  let { oldPassword, newPassword }: { oldPassword: string, newPassword: string } = await req.body;

  // Make sure the old and new passwords are present
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Missing old or new password" });
  }

  // Make sure the old password is correct
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      email: session.user.email,
    },
    select: {
      password: true,
    }
  });

  if (!user) {
    return res.status(500).json({ message: "User not found, try logging out and in again before trying to change password again." });
  }

  const oldPasswordMatches = await bcrypt.compare(oldPassword, user.password);

  if (!oldPasswordMatches) {
    return res.status(403).json({ message: "Old password is incorrect" });
  }

  // Hash the new password
  const saltRounds = 11;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update the user's password
  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
        email: session.user.email,
      },
      data: {
        password: hashedPassword,
      }
    });
  }
  catch (error) {
    return res.status(500).json({ message: "Error updating password" });
  }

  return res.status(200).json({ message: "Password updated" });
}