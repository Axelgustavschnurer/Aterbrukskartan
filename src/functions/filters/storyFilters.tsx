import { DeepStory, StoryFilter } from "@/types";
import { yearLimits } from "@/pages/stories";
import { MapItem } from "@prisma/client";
import { filterByYear, filterByOrganisation } from "./commonFilters";

export default runActiveFilters;

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

/**
 * Filters out `Story` objects without any of the selected categories.
 * @param data Array of `DeepStory` objects to filter.
 * @param categories Array of strings containing categories to filter by.
 * @returns `Story` objects that have at least one of the selected categories.
 */
export function filterByCategories(data: DeepStory[], categories: string[]) {
  let returnData: DeepStory[] = [];

  for (let i in data) {
    if (!data[i].categorySwedish) continue;
    for (let j = 0; j <= data[i].categorySwedish!?.split(",").length; j++) {
      if (categories.includes(data[i].categorySwedish!?.split(",")[j].trim())) {
        returnData.push(data[i]);
        break;
      }
    }
  }

  return returnData;
}

/**
 * Filters out `Story` objects that do not have an educational program that matches with at least one of the educational programs in the `educationalProgram` parameter.
 * 
 * Intended to be used specifically to check if the educational program contains "Civilingenjör", "Högskoleingenjör", "Agronom" or "Kandidatexamen",
 * but could also be used to check if the educationalProgram field contains any other string.
 * @param data Array of `DeepStory` objects to filter.
 * @param educationalProgram Array of strings containing educational programs to filter by.
 * @returns `Story` objects that have at least one of the selected educational programs (matches at least one of the strings in `educationalProgram`).
 */
export function filterByEducationalProgram(data: DeepStory[], educationalProgram: string[]) {
  let returnData: DeepStory[] = [];

  for (let i in data) {
    if (!data[i].educationalProgram) continue;
    for (let j in educationalProgram) {
      if (data[i].educationalProgram?.includes(educationalProgram[j])) {
        returnData.push(data[i]);
        break;
      }
    }
  }

  return returnData;
}

/**
 * Filters through the data parameter using the filters parameter.
 * @param data Array of `DeepStory` objects to run through the filters.
 * @param filters Object containing the filters to apply.
 * @returns Filtered list of `DeepStory` objects.
 */
export function runActiveFilters(data: DeepStory[], filters: StoryFilter) {
  let returnData: DeepStory[] = data;

  // The year filter is not run if the year values are in their default state.
  if (filters.years && (Math.max(...filters.years) != yearLimits.max || Math.min(...filters.years) != yearLimits.min)) {
    returnData = filterByYear(returnData, filters.years) as DeepStory[];
  }
  if (filters.organisation?.length) {
    returnData = filterByOrganisation(returnData, filters.organisation) as DeepStory[];
  }
  if (filters.categories?.length) {
    returnData = filterByCategories(returnData, filters.categories);
  }
  if (filters.educationalProgram?.length) {
    returnData = filterByEducationalProgram(returnData, filters.educationalProgram);
  }
  if (filters.searchInput) {
    returnData = filterStoriesBySearchInput(returnData, filters.searchInput);
  }

  return returnData;
}