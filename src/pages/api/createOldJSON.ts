// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, MapItem, Story } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getData = await prisma.story.findMany({
    include: {
      mapItem: true
    }
  })

  let oldJSON: any = [];
  getData.map((item) => {
    const { mapItem, ...story } = item

    const formattedString = {
      id: mapItem.id.toString(),
      name: mapItem.name,
      organisation: mapItem.organisation,
      year: mapItem.year?.toString() || "Ongoing",
      coordinates: `${mapItem.latitude}, ${mapItem.longitude}`,
      address: mapItem.address,
      "postal code": mapItem.postcode?.toString(),
      city: mapItem.city,
      category_swedish: story.categorySwedish,
      category_english: story.categoryEnglish,
      utbildningsprogram: story.educationalProgram,
      description_swedish: story.descriptionSwedish,
      description_english: story.descriptionEnglish,
      description_swedish_short: story.descriptionSwedishShort,
      description_english_short: story.descriptionEnglishShort,
      "open data": story.openData,
      "energy stories": "x",
      reports: story.reports,
      videos: story.videos,
      pdfcase: story.pdfCase,
    }
    oldJSON.push(formattedString)
  })

  res.status(200).setHeader("Access-Control-Allow-Origin", "*").json({ results: oldJSON })
}