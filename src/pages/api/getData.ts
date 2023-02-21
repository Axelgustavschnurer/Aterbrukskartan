// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import type { MapItem } from '@prisma/client'
const prisma = new PrismaClient()

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MapItem[]>
) {
  const getData = await prisma.mapItem.findMany()
  res.json(getData)
}
