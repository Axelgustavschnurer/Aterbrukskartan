// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { DeepRecycle } from '@/types'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeepRecycle[]>
  ) {
  /**
   * Returns a list of all the `Recycle` objects in the database, with the mapItem object included
   */
  const getData: DeepRecycle[] = await prisma.recycle.findMany({
    include: {
      mapItem: true
    }
  })
  res.json(getData)
}
