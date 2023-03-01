// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Recycle, MapItem } from '@prisma/client'
import { DeepRecycle } from '@/types'

const prisma = new PrismaClient()

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeepRecycle[]>
) {
  const getData = await prisma.recycle.findMany({
    include: {
      mapItem: true
    }
  })
  res.json(getData)
}
