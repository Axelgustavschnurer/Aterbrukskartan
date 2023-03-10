// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { DeepRecycle } from '@/types'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeepRecycle[]>
) {
  // Since this API fetches data from the database, we only allow GET and HEAD requests
  res.setHeader('Allow', ['GET', 'HEAD']);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  /**
   * Returns a list of all the `Recycle` objects in the database, with the mapItem object included
   */
  const getData: DeepRecycle[] = await prisma.recycle.findMany({
    include: {
      mapItem: true
    }
  })
  res.status(200).json(getData)
}
