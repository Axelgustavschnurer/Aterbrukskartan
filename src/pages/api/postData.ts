import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'

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
    const newPost: DeepRecycleInput = req.body;
    const savedPost = await prisma.recycle.create({
      data: {
        mapItem: {
          create: {
            // TODO: Possibly add a check to see if all the data matches with an existing mapItem, and if so, use that instead of creating a new one.
            organisation: newPost.mapItem.organisation,
            year: newPost.mapItem.year,
            latitude: newPost.mapItem.latitude,
            longitude: newPost.mapItem.longitude,

            // These fields are currently not included in the form (as of 2023-03-09) but are included here for possible future use.
            name: newPost.mapItem.name,
            address: newPost.mapItem.address,
            postcode: newPost.mapItem.postcode,
            city: newPost.mapItem.city,
          }
        },
        month: newPost.month,
        projectType: newPost.projectType,
        description: newPost.description,
        contact: newPost.contact,
        externalLinks: newPost.externalLinks,
        lookingForMaterials: newPost.lookingForMaterials,
        availableMaterials: newPost.availableMaterials,
      }
    });
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: 'Something went wrong' });
  }
}