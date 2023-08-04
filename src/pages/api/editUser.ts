import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "@/session"
import prisma from "@/prismaClient"
import { Prisma } from '@prisma/client';

type UserInfo = Prisma.UserCreateWithoutRecycleOrganisationsInput & {
  organisations: string[]
};

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
    return res.status(403).json({ message: "Unauthorized; only admins may edit users" });
  }

  // Get the email and password from the request body
  let { email, isAdmin, isStoryteller, isRecycler, organisations }: UserInfo = await req.body;

  // Make sure the email and password are present
  if (!email) {
    return res.status(400).json({ message: "Missing user email" });
  }

  // Update the user
  let isUpdated = await prisma.user.update({
    where: {
      email: email
    },
    data: {
      recycleOrganisations: {
        set: [],
      }
    }
  }).catch((e) => {
    return res.status(500).json({ message: "Error while removing old relations (probably couldn't find user)" });
  })

  if (!isUpdated) { return; }

  await prisma.user.update({
    where: {
      email: email
    },
    data: {
      isAdmin: !!isAdmin,
      isStoryteller: !!isStoryteller,
      isRecycler: !!isRecycler,
      recycleOrganisations: {
        connectOrCreate: organisations.map((organisation) => {
          return {
            where: {
              name: organisation
            },
            create: {
              name: organisation
            }
          }
        })
      }
    }
  }).then((user) => {
    return res.status(201).json({ message: "User updated" });
  }).catch((e) => {
    return res.status(500).json({ message: "Error while updating user" });
  })

  return
}