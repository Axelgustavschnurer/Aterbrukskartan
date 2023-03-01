import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Recycle, Prisma } from '@prisma/client'
import { DeepRecycle } from '@/types';

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Allow', ['POST']);
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const newUser: Prisma.RecycleCreateInput = req.body;
    const savedUser = await prisma.recycle.create({
      data: {
        mapItem: {
          create: {
            latitude: newUser.mapItem.latitude,
            longitude: newUser.mapItem.longitude,
            organisation: newUser.mapItem.organisation,
          }
        },
        projectType: newUser.projectType,
        lookingForMaterials: newUser.lookingForMaterials,
        availableMaterials: newUser.availableMaterials,
        description: newUser.description,
        contact: newUser.contact,
      }
    });
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: 'Something went wrong' });
  }
}