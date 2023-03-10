import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'
import { DeepRecycle, DeepRecycleInput } from '@/types'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Allow', ['GET', 'HEAD', 'PUT', 'DELETE']);

  switch (req.method) {
    case 'GET':
    case 'HEAD':
      try {
        if (!parseInt(req.query.id as string)) throw new Error('No ID specified');
        
        /**
         * Returns the `Recycle` object with the given ID, with the mapItem object included, or throws an error if no `Recycle` object with the given ID exists.
         */
        const getData: DeepRecycle = await prisma.recycle.findFirstOrThrow({
          where: {
            id: parseInt(req.query.id as string)
          },
          include: {
            mapItem: true
          }
        })

        res.status(200).json(getData)
      }
      catch (err: any) {
        if (err.message === 'No ID specified') {
          res.status(400).json({ message: 'No ID specified' })
        }
        else if (err instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(400).json({ message: 'Something went wrong when processing the request. The specified ID might not exist in the database.' });
        }
        else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
          res.status(400).json({ message: 'Something went wrong when processing the request. Cause unknown.' });
        }
        else if (err instanceof Prisma.PrismaClientInitializationError) {
          res.status(500).json({ message: 'Internal server error. Failed to connect to database.' });
        }
        else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
      break;

    case 'PUT':
      try {
        if (!parseInt(req.query.id as string)) throw new Error('No ID specified');

        const updateData: DeepRecycleInput = req.body;
        const updatedData = await prisma.recycle.update({
          where: {
            id: parseInt(req.query.id as string)
          },

          data: {
            ...updateData,
            mapItem: {
              update: { ...updateData.mapItem }
            },
          },

          include: {
            mapItem: true
          },
        });

        res.status(200).json(updatedData);
      }
      catch (err: any) {
        if (err.message === 'No ID specified') {
          res.status(400).json({ message: 'No ID specified' })
        }
        else if (err instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(400).json({ message: 'Something went wrong when processing the request. The specified ID might not exist in the database.' });
        }
        else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
          res.status(400).json({ message: 'Something went wrong when processing the request. Cause unknown.' });
        }
        else if (err instanceof Prisma.PrismaClientValidationError) {
          res.status(400).json({ message: 'Something went wrong when processing the request. Some field(s) seems to be missing or have an incorrect type.' });
        }
        else if (err instanceof Prisma.PrismaClientInitializationError) {
          res.status(500).json({ message: 'Internal server error. Failed to connect to database.' });
        }
        else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
      break;

    case 'DELETE':
      res.status(501).json({ message: 'Not implemented' });
      break;

    case 'POST':
      res.status(405).json({ message: 'Method not allowed; use PUT if you want to modify data or got to /postData if you want to add data to the databa' });
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}