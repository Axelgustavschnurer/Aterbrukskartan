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
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);

  switch (req.method) {
    case 'GET':
      res.status(501).json({ message: 'Not implemented' });
      break;

    case 'PUT':
      res.status(501).json({ message: 'Not implemented' });
      break;

    case 'DELETE':
      res.status(501).json({ message: 'Not implemented' });
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}