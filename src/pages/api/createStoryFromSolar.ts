import type { NextApiRequest, NextApiResponse } from 'next'
import { MapItem } from "@prisma/client";

export type SolarStory = {
  mapItem: MapItem;
  id: number;
  mapId: number;
  categorySwedish: string;
  identity: string;
  descriptionSwedish: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SolarStory[]>
) {
  const rawSolarData = await fetch('https://stunssolar.azurewebsites.net/api/devices')
  const solarJSON = await rawSolarData.json()

  let solarStories: SolarStory[] = []

  solarJSON.map((item: any) => {
    let solarKeyValues: any = {}
    item.properties.map((property: any) => {
      solarKeyValues[property.key] = property.value
    })
    const mapItem: MapItem = {
      // The solar data IDs overlap with the map item IDs, so we add 100'000'000 to the solar data IDs to avoid conflicts
      id: parseInt(item.deviceId) + 100000000,
      name: solarKeyValues["display name"],
      // TODO: Check if the solar should be attributed to a specific organisation
      organisation: null,
      year: null,
      latitude: parseFloat(solarKeyValues["latitude"]),
      longitude: parseFloat(solarKeyValues["longitude"]),
      address: solarKeyValues["address"],
      postcode: parseInt(solarKeyValues["postal code"]),
      city: solarKeyValues["city"],
      isActive: true,
    }

    const story: SolarStory = {
      mapItem,
      id: parseInt(item.deviceId) + 100000000,
      mapId: parseInt(item.deviceId) + 100000000,
      identity: item.identity,
      categorySwedish: "Grön energi",
      descriptionSwedish: solarKeyValues["description"].replace(/<\/?[^>]+(>|$)/g, " "),
    }

    solarStories.push(story)
  })

  res.status(200).json(solarStories)
}