import { DeepRecycle } from "@/types";

/**
 * Filters away objects that do not have a year that is within the range of the year parameter.
 * @param data Array of `DeepRecycle` or `DeepStory` objects to filter by year.
 * @param years Array of numbers, where the highest number is the max year and the lowest number is the min year. Can contain a single number, which will be used as both the min and max year.
 * @returns Objects that have a year that is within the range of the year parameter.
 */
export function filterByYear(data: DeepRecycle[], years: number[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];

  for (let i in data) {
    // If the year is not defined, use the current year
    let current: number
    if (!data[i].mapItem.year) {
      current = new Date().getFullYear()
    }
    else {
      current = data[i].mapItem.year!
    }

    if (current <= Math.max(...years) && current >= Math.min(...years)) {
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
export function filterByOrganisation(data: DeepRecycle[], organisation: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];

  for (let i in data) {
    if (organisation.includes(data[i].mapItem.organisation!)) {
      // @ts-ignore - `data` should always fit
      returnData.push(data[i]);
    }
  }

  return returnData;
}

/**
 * If showInactive is true, removes all objects that *are* active.
 * @param data Array of `DeepRecycle` or `DeepStory` objects to filter
 * @param showInactive Boolean
 */
export function filterByActive(data: DeepRecycle[], showInactive: boolean): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];

  for (let i in data) {
    // If showInactive is true, return all inactive objects
    if (showInactive) {
      if (!data[i].isActive || !data[i].mapItem.isActive) {
        // @ts-ignore - `data` should always fit
        returnData.push(data[i]);
      }
    }
    // otherwise, do nothing
    else {
      // @ts-ignore - `data` should always fit
      returnData.push(data[i]);
    }
  }

  return returnData;
}