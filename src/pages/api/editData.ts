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
      try {
        /**
         * Returns the `Recycle` object with the given ID, with the mapItem object included, or throws an error if no `Recycle` object with the given ID exists.
         */
        const getData: DeepRecycle = await prisma.recycle.findFirstOrThrow({
          where: {
            id: parseInt(req.body.id)
          },
          include: {
            mapItem: true
          }
        })

        res.status(200).json(getData)
      } catch (err) {
        res.status(400).json({ message: 'Something went wrong, the requested ID might not exist in the database' });
      }
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