import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'
import { DeepRecycle, DeepRecycleInput } from '@/types'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);

  switch (req.method) {
    case 'GET':
      /**
       * Returns a list of all the `Recycle` objects in the database, with the mapItem object included
       */
      const getData: DeepRecycle[] = await prisma.recycle.findMany({
        include: {
          mapItem: true
        }
      })
      
      res.status(200).json(getData)
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