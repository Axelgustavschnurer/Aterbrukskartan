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

  // Get the old and new password from the request body
  let { email, oldPassword, newPassword }: { email: string, oldPassword: string, newPassword: string } = await req.body;

  // Make sure the old and new passwords are present
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Missing old or new password" });
  }

  // Make sure the email is present
  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  // Make sure the old password is correct
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      password: true,
    }
  });

  if (!user) {
    return res.status(400).json({ message: "No user found with provided email address" });
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
        email: email,
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