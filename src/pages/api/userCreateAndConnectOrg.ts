// Temporary? API for connecting a user to a new organisation they have created.
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "@/session"
import prisma from "@/prismaClient"

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

  // Reject the request if the user is not an admin or a recycler
  if (!session.user?.isAdmin && !session.user?.isRecycler) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // Get new organisation name from the request body
  const { name }: { name: string } = await req.body;

  // Make sure the name is present
  if (!name) {
    return res.status(400).json({ message: "Missing name" });
  }

  // Connect the user to the new organisation, creating it if it does not exist
  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      recycleOrganisations: {
        connectOrCreate: {
          where: {
            name: name,
          },
          create: {
            name: name,
          },
        },
      },
    },
  }).then(() => {
    return res.status(200).json({ message: "User updated" });
  }).catch((error) => {
    return res.status(500).json({ message: "Error while updating user" });
  });

  return
}