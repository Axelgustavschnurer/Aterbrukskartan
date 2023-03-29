// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * This is an old data format, used at https://maps.stuns.se/. Data is fetched from the database and formatted to this format in order to be compatible with said website without a major rewrite.
 * 
 * It is derived from the structure of the data it currently (as of 2023-03-02) fetches from [here](https://stuns.entryscape.net/rowstore/dataset/6dc2b750-8fd5-4717-9d4e-e92f547c2b38/json).
 */
export type oldDataFormat = {
  id: string,
  name: string | null,
  organisation: string | null,
  year: string | null,
  coordinates?: string | null,
  address: string | null,
  "postal code"?: string | null,
  city: string | null,
  category_swedish: string | null,
  category_english: string | null,
  utbildningsprogram: string | null,
  description_swedish: string | null,
  description_english: string | null,
  description_swedish_short: string | null,
  description_english_short: string | null,
  "open data": string | null,
  "energy stories": string | null,
  reports: string | null,
  videos: string | null,
  pdfcase: string | null,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ results: oldDataFormat[] }>
) {
  /** Returns a list of all the `Story` objects in the database, with the mapItem object included */
  const getData = await prisma.story.findMany({
    include: {
      mapItem: true
    }
  })

  let oldJSON: oldDataFormat[] = [];

  // Format the data to the old format
  getData.map((item) => {
    const { mapItem, ...story } = item

    // Postcodes are stored as numbers (12345) in the database, but they are usually formatted as "123 45" in practice
    const postcodeString = mapItem.postcode?.toString().substring(0, 3) + " " + mapItem.postcode?.toString().substring(3)

    const formattedString = {
      id: mapItem.id.toString(),
      name: mapItem.name,
      organisation: mapItem.organisation,
      // If the year is null, set it to "Ongoing", as the old format expects a string whereas the new format expects a number or null
      year: mapItem.year?.toString() || "Ongoing",
      coordinates: `${mapItem.latitude}, ${mapItem.longitude}`,
      address: mapItem.address,
      "postal code": postcodeString,
      city: mapItem.city,
      category_swedish: story.categorySwedish,
      category_english: story.categoryEnglish,
      utbildningsprogram: story.educationalProgram,
      description_swedish: story.descriptionSwedish,
      description_english: story.descriptionEnglish,
      description_swedish_short: story.descriptionSwedishShort,
      description_english_short: story.descriptionEnglishShort,
      "open data": story.openData,
      // Energy stories is a confusing field, the old data sets it to "x" for all entries except 4, which are null.
      // The new data sets it to true or false, but the non-energy stories should probably be moved to another table instead?
      "energy stories": story.isEnergyStory ? "x" : null,
      reports: story.reports,
      videos: story.videos,
      pdfcase: story.pdfCase,
    }
    oldJSON.push(formattedString)
  })

  // "Access-Control-Allow-Origin": "*" allows the old website to fetch the data despite possibly being on a different domain
  res.status(200).setHeader("Access-Control-Allow-Origin", "*").json({ results: oldJSON })
}