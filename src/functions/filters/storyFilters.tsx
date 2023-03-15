import { DeepStory, Filter } from "@/types";
import { yearLimits } from "@/pages/stories";
import { MapItem } from "@prisma/client";

/**
 * Looks through most of the fields of the `Story` objects and returns an array of the objects that match the search string.
 * @param data Array of `DeepStory` objects to search through.
 * @param search String to search for.
 */
export function filterStoriesBySearchInput(data: DeepStory[], search: string) {
  let returnData: DeepStory[] = [];

  // Fields to search through in the `Story` objects.
  let storySearchFields = [
    "categorySwedish",
    "categoryEnglish",
    "educationalProgram",
    "descriptionSwedish",
    "descriptionEnglish",
    "descriptionSwedishShor",
    "descriptionEnglishShor",
    "openData",
    "reports",
    "reportTitle",
    "videos",
    "pdfCase",
  ]

  // Fields to search through in the `MapItem` objects.
  let mapItemSearchFields = [
    "name",
    "organisation",
    "year",
    "address",
    "postcode",
    "city",
  ]

  search = search.toLowerCase();
  for (let i in data) {
    // Used to continue to next iteration of the outer loop if a match is found in the first inner loop.
    let breakCheck = false;

    for (let j of storySearchFields) {
      if ((data[i][j as keyof DeepStory] as string)?.toLowerCase().includes(search)) {
        returnData.push(data[i]);
        breakCheck = true;
        break;
      }
    }

    if (breakCheck) continue;
    
    for (let k of mapItemSearchFields) {
      if ((data[i].mapItem[k as keyof MapItem] as string)?.toLowerCase().includes(search)) {
        returnData.push(data[i]);
        break;
      }
    }
  }

  return returnData;
}