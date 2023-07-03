// This file should only be run manually, and is used to add data to the database from an external source.
import type { NextApiRequest, NextApiResponse } from 'next'
import path from "path"
import { promises } from "fs"
import prisma from '@/prismaClient'

/**
 * This is the geoJSON format used by a specific external data source which we can use to automatically
 * add items to the database by matching data from a csv file to the geoJSON file.
 */
export type geoJson = {
  type: string,
  name: string,
  crs: {
    type: string,
    properties: {
      name: string
    },
  },
  features: {
    type: string,
    properties: {
      OBJECTID: number,
      dep: string,
      trakt: string,
      block_enhet: string,
      omrade: string,
      antal_omr: string,
      fastighet: string,
    }
    geometry: {
      type: string,
      coordinates: number[][][]
    }
  }[]
}

/**
 * This regex captures a property designation, "fastighetsbeteckning", such as one the following:  
 * "LILLA SLÄSSBO 1:35"  
 * "KÅBO 67:1"  
 * "BÄLINGE-EKEBY 2:20"
 */
const fastighetRegex = /[\wÅÄÖåäö\-]+\s[\wÅÄÖåäö\-]*\s?\d+:\d+/

/**
 * This API is intended to be run manually and locally, and is used to add data to the database from an external source.
 * The implementation of this API is very specific to the data sources we are currently using
 * (construction permits (bygglov) from the municipality of Uppsala (converted from xlsx to csv utf8), and a geoJSON file called "ByggaBo.geojson")
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers.host?.split(":")[0] !== "localhost") {
    res.status(403).json({ message: "This API is only intended to be run locally" })
    return
  }

  // Folder where the external data is stored
  const dataDirectory = path.join(process.cwd(), "externalData")

  // Read the csv file
  const csvFile: string = await promises.readFile(dataDirectory + "/skolfastigheter.csv", "utf8")
  let csvLines: string[] = csvFile.split("\n")
  // Split each line into an array of strings
  // I sure hope there are no semicolons in the data :)
  /**
   * The data we might be interested in are as follows:  
   * 2. A unique identifier for the permit formatted similar to this: "PBN 2023-000083"  
   * 3. "Fastighetsbeteckning" (needs to be refined to exclude any extra information)  
   * 4. Date of permit (YYYY-MM-DD)
   * 5. "Ärendemening", describes the permit  
   * 7. Kind of permit ("Bygglov för", "Rivningslov för", "Tidsbegränsat lov för" etc.)  
   * 8. Specifies what they will do ("rivning av", "fasadändring på", "nybyggnad av" etc.)  
   * 9. Gives some information about the building ("skola/förskola", "sophus/miljöhus" etc.)  
   */
  let csvArray: string[][] = csvLines.map((line) => line.split(";"))
  // Removes any part of row[3] that is not part of the property designation
  for (let row of csvArray) {
    if (fastighetRegex.test(row[3])) {
      row[3] = row[3].match(fastighetRegex)![0]
    }
    else {
      row[3] = ""
    }
  }
  // Remove any rows that do not have a proper property designation, such as the header row(-s) and empty rows
  csvArray = csvArray.filter((row) => row[3] !== "")

  // Read the geoJSON file
  const geoJsonFile: string = await promises.readFile(dataDirectory + "/ByggaBo.geojson", "utf8")
  const geoJson: geoJson = JSON.parse(geoJsonFile)
  // Create a lookup table for the geoJSON file so we can easily find the coordinates of a specific building
  // This should hopefully be faster than looping through all 50'000+ entries in the geoJSON file all the time
  const lookup = new Map<string, [number, number]>()
  geoJson.features.forEach((feature) => {
    lookup.set(feature.properties.fastighet, [feature.geometry.coordinates[0][0][0], feature.geometry.coordinates[0][0][1]])
  })

  // Add the data to the database
  for (let row of csvArray) {
    // Get coordinates from the lookup table based on the property designation
    // Note: ByggaBo has longitude in position 0 and latitude in position 1
    let coordinates: number[] | undefined = lookup.get(row[3])

    // If the property designation is not found in the lookup table, we skip this row
    if (!coordinates) { continue }

    // Check if a mapItem with the unique identifier as name already exists in the database
    // If it doesn't, we can safely add it to the database without worrying about duplicates
    try {
      await prisma.mapItem.findFirstOrThrow({
        where: {
          name: row[2],
        }
      })

      console.log("Skipping " + row[2])
    }
    catch {
      console.log("Adding " + row[2])
      await prisma.recycle.create({
        data: {
          projectType: row[7],
          description: row[3] + "; " + row[5],
          month: parseInt(row[4].split("-")[1]),
          mapItem: {
            create: {
              name: row[2],
              longitude: coordinates[0],
              latitude: coordinates[1],
              year: parseInt(row[4].split("-")[0]),
            }
          }
        }
      })
    }
  }

  res.status(200).json({ message: "ok" })
}