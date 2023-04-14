import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'
import { DeepRecycle, DeepRecycleInput } from '@/types'

const prisma = new PrismaClient()

/**
 * This API handles requests regarding recycle data, such as creating new Recycle objects, or fetching existing ones.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Allow', ['GET', 'HEAD', 'POST', 'PUT', 'DELETE']);

  switch (req.method) {
    // On GET or HEAD requests, return the `Recycle` object with the given ID, or all `Recycle` objects if no ID is specified
    case 'GET':
    case 'HEAD':
      if (!parseInt(req.query.id as string)) {
        try {
          /** Returns all `Recycle` objects, with `mapItem` objects included. */
          const getData: DeepRecycle[] = await prisma.recycle.findMany({
            where: {
              isActive: true,
              mapItem: {
                isActive: true
              },
            },
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
          /** Returns the `Recycle` object with the given ID, with the `mapItem` object included, or throws an error if no `Recycle` object with the given ID exists. */
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

    // On POST requests, create a new `Recycle` object and return it
    case 'POST':
      try {
        const newPost: DeepRecycleInput = req.body;
        /** Creates a new `Recycle` object with the given data, and returns it with the `mapItem` object included. */
        const savedPost = await prisma.recycle.create({
          data: {
            ...newPost,
            mapItem: {
              create: { ...newPost.mapItem }
            },
          },
          include: {
            mapItem: true
          },
        })

        res.status(201).json(savedPost);
      }
      catch (err: any) {
        if (err instanceof Prisma.PrismaClientKnownRequestError || err instanceof Prisma.PrismaClientUnknownRequestError) {
          res.status(400).json({ message: 'Bad request' });
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

    // On PUT requests, update the `Recycle` object with the given ID and return it
    // Throws an error if no ID is specified or no `Recycle` object with the given ID exists
    // This is because we only want to update existing objects, new objects should instead be created with POST requests
    case 'PUT':
      try {
        if (!parseInt(req.query.id as string)) throw new Error('No ID specified');

        const updateData: DeepRecycleInput = req.body;
        /** Updates the `Recycle` object with the given ID with the given data, and returns it with the `mapItem` object included. */
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

    // On DELETE requests, change the `isActive` field of the `Recycle` object with the given ID to false, and return it
    case 'DELETE':
      try {
        if (!parseInt(req.query.id as string)) throw new Error('No ID specified');

        const updateData: DeepRecycleInput = req.body;
        /** Updates the `Recycle` object with the given ID to be inactive, and returns it with the `mapItem` object included. */
        const updatedData = await prisma.recycle.update({
          where: {
            id: parseInt(req.query.id as string)
          },

          data: {
            isActive: false,
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

    // If the request method is not one of the above, return a 405 error
    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}