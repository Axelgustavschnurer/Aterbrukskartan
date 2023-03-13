import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'
import { DeepRecycle, DeepRecycleInput } from '@/types'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Allow', ['GET', 'HEAD', 'POST', 'PUT', 'DELETE']);

  switch (req.method) {
    case 'GET':
    case 'HEAD':
      res.status(501).json({ message: 'Not implemented' });
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