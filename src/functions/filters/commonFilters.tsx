import { DeepRecycle, DeepStory } from "@/types";

/**
 * Filters away objects that do not have a year that is within the range of the year parameter.
 * @param data Array of `DeepRecycle` or `DeepStory` objects to filter by year.
 * @param years Array of numbers, where the highest number is the max year and the lowest number is the min year. Can contain a single number, which will be used as both the min and max year.
 * @returns Objects that have a year that is within the range of the year parameter.
 */
export function filterByYear(data: DeepRecycle[] | DeepStory[], years: number[]): DeepRecycle[] | DeepStory[] {
  let returnData: DeepRecycle[] | DeepStory[] = [];
  
  for (let i in data) {
    if (data[i].mapItem.year! <= Math.max(...years) && data[i].mapItem.year! >= Math.min(...years)) {
      // @ts-ignore - `data` should always fit
      returnData.push(data[i]);
    }
  }

  return returnData;
}

/**
 * Filters away objects that do not belong to any of the organisations in the organisation parameter
 * @param data Array of `DeepRecycle` or `DeepStory` objects to filter by organisation
 * @param organisation Array of strings containing the organisations to filter by
 * @returns Objects that belong to *one or more* of the organisations in the organisation parameter
*/
export function filterByOrganisation(data: DeepRecycle[] | DeepStory[], organisation: string[]): DeepRecycle[] | DeepStory[] {
  let returnData: DeepRecycle[] | DeepStory[] = [];

  for (let i in data) {
    if (organisation.includes(data[i].mapItem.organisation!)) {
      // @ts-ignore - `data` should always fit
      returnData.push(data[i]);
    }
  }

  return returnData;
}