import { getSession, createResponse } from "@/session";
import prisma from "@/prismaClient";
import bcrypt from "bcrypt";
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  res.setHeader("Allow", "POST");

  // Make sure the request is a POST request
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let { email, password }: { email: string, password: string } = await req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Validate credentials
  let user: User & { recycleOrganisations: {name: string}[]} | void = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      isAdmin: true,
      isStoryteller: true,
      isRecycler: true,
      recycleOrganisations: {
        select: {
          name: true,
        }
      }
    }
  }).catch((e) => {
    return res.status(400).json({ message: "User not found" });
  });

  if (!user) { return; }

  // Check password
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  // Set session
  session.user = {
    id: user.id,
    email: user.email,
    isLoggedIn: true,
    isAdmin: user.isAdmin,
    isStoryteller: user.isStoryteller,
    isRecycler: user.isRecycler,
    recycleOrganisations: user.recycleOrganisations.map((organisation) => {
      return organisation.name;
    })
  };

  await session.save();

  return res.status(200).json({ message: "Login successful" });
}