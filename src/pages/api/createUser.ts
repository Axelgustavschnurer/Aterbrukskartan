import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "@/session"
import prisma from "@/prismaClient"
import bcrypt from "bcrypt";
import { Prisma } from '@prisma/client';

type UserInfo = Prisma.UserCreateWithoutRecycleOrganisationsInput;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  res.setHeader('Allow', 'POST');

  // Make sure the request is a POST request
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Reject the request if the user is not an admin
  if (!session.user?.isAdmin) {
    return res.status(403).json({ message: "Unauthorized; only admins may add new users right now" });
  }

  // Get the email and password from the request body
  let { email, password, isAdmin, isStoryteller, isRecycler }: UserInfo = await req.body;

  // Make sure the email and password are present
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  // Make sure the email is not yet in use
  const emailExists = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  if (emailExists) {
    return res.status(409).json({ message: "Email " + email + " already exists" });
  }

  // Hash the password
  const saltRounds = 11;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create the user
  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      isAdmin: isAdmin,
      isStoryteller: isStoryteller,
      isRecycler: isRecycler,
    }
  }).then((user) => {
    return res.status(201).json({ message: "User created" });
  }).catch((e) => {
    return res.status(500).json({ message: "Error while creating user" });
  })

  return
}