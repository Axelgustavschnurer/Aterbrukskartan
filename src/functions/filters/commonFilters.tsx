import { DeepRecycle, DeepStory } from "@/types";

/**
 * Filters out recycle objects that do not have a year that is within the range of the year parameter.
 * @param data Array of DeepRecycle objects to filter by year.
 * @param years Array of numbers, where the highest number is the max year and the lowest number is the min year. Can contain a single number, which will be used as both the min and max year.
 * @returns The recycle objects that have a year that is within the range of the year parameter.
 */
export function filterByYear(data: DeepRecycle[] | DeepStory[], years: number[]): DeepRecycle[] | DeepStory[] {
  let returnData: DeepRecycle[] | DeepStory[] = [];
  
  for (let i in data) {
    if (data[i].mapItem.year! <= Math.max(...years) && data[i].mapItem.year! >= Math.min(...years)) {
      // @ts-ignore - `data` will always fit
      returnData.push(data[i]);
    }
  }

  return returnData;
}

/**
 * Filters out recycle objects that do not belong to any of the organisations in the organisation parameter
 * @param data Array of DeepRecycle objects to filter by organisation
 * @param organisation Array of strings containing the organisations to filter by
 * @returns Recycle objects that belong to *one or more* of the organisations in the organisation parameter
*/
export function filterByOrganisation(data: DeepRecycle[] | DeepStory[], organisation: string[]): DeepRecycle[] | DeepStory[] {
  let returnData: DeepRecycle[] | DeepStory[] = [];

  for (let i in data) {
    if (organisation.includes(data[i].mapItem.organisation!)) {
      // @ts-ignore - `data` will always fit
      returnData.push(data[i]);
    }
  }

  return returnData;
}