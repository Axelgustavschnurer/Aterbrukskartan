import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Recycle, Prisma } from '@prisma/client'

/**
 * This is the data format used when creating a new `Recycle` object in the database.
 */
type DeepRecycleInput = Prisma.RecycleCreateWithoutMapItemInput & {
  mapItem: Prisma.MapItemCreateWithoutRecycleInput
}

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Allow', ['POST']);
  // Only allow POST requests, as this is an API route for creating new data.
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const newUser: DeepRecycleInput = req.body;
    const savedUser = await prisma.recycle.create({
      data: {
        mapItem: {
          create: {
            // TODO: Possibly add a check to see if all the data matches with an existing mapItem, and if so, use that instead of creating a new one.
            // TODO: Possibly add an option to include data for the name, address, postcode and city fields. They are currently not included in the form.
            latitude: newUser.mapItem.latitude,
            longitude: newUser.mapItem.longitude,
            organisation: newUser.mapItem.organisation,
            year: newUser.mapItem.year,
          }
        },
        projectType: newUser.projectType,
        lookingForMaterials: newUser.lookingForMaterials,
        availableMaterials: newUser.availableMaterials,
        description: newUser.description,
        contact: newUser.contact,
        externalLinks: newUser.externalLinks,
      }
    });
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: 'Something went wrong' });
  }
}