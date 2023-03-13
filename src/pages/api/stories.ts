import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'
import { DeepStory, DeepStoryInput } from '@/types'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Allow', ['GET', 'HEAD', 'POST', 'PUT', 'DELETE']);

  switch (req.method) {
    case 'GET':
    case 'HEAD':
      if (!parseInt(req.query.id as string)) {
        try {
          /**
           * Returns all `Story` objects, with `mapItem` objects included.
           */
          const getData: DeepStory[] = await prisma.story.findMany({
            include: {
              mapItem: true
            }
          })

          res.status(200).json(getData)
        }
        catch (err: any) {
          if (err instanceof Prisma.PrismaClientInitializationError) {
            res.status(500).json({ message: 'Failed to connect to database' });
          }
          else {
            res.status(500).json({ message: 'Internal server error' });
          }
        }
      }
      else {
        try {
          /**
           * Returns the `Story` object with the given ID, with the `mapItem` object included, or throws an error if no `Recycle` object with the given ID exists.
           */
          const getData: DeepStory = await prisma.story.findFirstOrThrow({
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
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
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
      }
      break;

    case 'POST':
      res.status(501).json({ message: 'Not implemented' });
      break;

    case 'PUT':
      res.status(501).json({ message: 'Not implemented' });
      break;

    case 'DELETE':
      res.status(501).json({ message: 'Not implemented' });
      break;

    default:
      res.status(405).json({ message: `Method ${req.method} not allowed` });
      break;
  }
}