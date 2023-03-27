import type { NextApiRequest, NextApiResponse } from 'next'
import { MapItem } from "@prisma/client";

export type solarStory = {
  mapItem: MapItem;
  id: number;
  mapId: number;
  categorySwedish: string;
  identity: string;
  descriptionSwedish: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<solarStory[]>
) {
  const rawSolarData = await fetch('https://stunssolar.azurewebsites.net/api/devices')
  const solarJSON = await rawSolarData.json()

  let solarStories: solarStory[] = []

  solarJSON.map((item: any) => {
    const mapItem: MapItem = {
      // The solar data IDs overlap with the map item IDs, so we add 100'000'000 to the solar data IDs to avoid conflicts
      id: item.deviceId + 100000000,

    }

    const story = {
      mapItem,
      id: item.deviceId + 100000000,
      mapId: item.deviceId + 100000000,
      identity: item.identity,
      categorySwedish: "Grön energi",
      // Might need to be changed to item.properties[16].description
      descriptionSwedish: item.properties.description
    }

    solarStories.push(story)
  })

  console.log(rawSolarData)

  // console.log(solarStories)

  res.status(200).json(solarStories)
}