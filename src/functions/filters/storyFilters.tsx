import { DeepStory, StoryFilter } from "@/types";
import { yearLimitsStories } from "@/pages";
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
    "descriptionSwedishShort",
    "descriptionEnglishShort",
    "openData",
    "reportSite",
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

    // Search through the fields in the `Story` objects.
    for (let j of storySearchFields) {
      if (!data[i][j as keyof DeepStory]) continue;
      if (String((data[i][j as keyof DeepStory]))?.toLowerCase().includes(search)) {
        returnData.push(data[i]);
        breakCheck = true;
        break;
      }
    }

    if (breakCheck) continue;

    // Search through the fields in the `MapItem` objects.
    for (let k of mapItemSearchFields) {
      if (!data[i].mapItem[k as keyof MapItem]) continue;
      if (String((data[i].mapItem[k as keyof MapItem]))?.toLowerCase().includes(search)) {
        returnData.push(data[i]);
        break;
      }
    }
  }

  return returnData;
}

/**
 * Filters away `Story` objects without any of the selected categories.
 * 
 * If the category "Övrigt" is included in the `categories` parameter, all `Story` objects without a category will also be returned.
 * @param data Array of `DeepStory` objects to filter.
 * @param categories Array of strings containing categories to filter by.
 * @returns `Story` objects that have at least one of the selected categories.
 */
export function filterByCategories(data: DeepStory[], categories: string[]) {
  let returnData: DeepStory[] = [];

  // Convert all categories to lowercase to make the comparison actually fucking work with the messed up data from users
  let lowerCaseCategories: string[] = [];
  for (let i in categories) {
    lowerCaseCategories.push(categories[i].toLowerCase());
  }

  for (let i in data) {
    if (!data[i].categorySwedish) {
      if (lowerCaseCategories.includes("övrigt")) {
        returnData.push(data[i]);
      }
      continue;
    }
    for (let j = 0; j < data[i].categorySwedish!?.split(",").length; j++) {
      if (lowerCaseCategories.includes(data[i].categorySwedish!?.split(",")[j].trim().toLowerCase())) {
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
      if (data[i].educationalProgram?.toLowerCase().includes(educationalProgram[j].toLowerCase())) {
        returnData.push(data[i]);
        break;
      }
    }
  }

  return returnData;
}

/**
 * Filters out `Story` objects that do not have any videos.
 * @param data Array of `DeepStory` objects to filter.
 * @returns `Story` objects that have at least one video.
 */
export function filterHasVideo(data: DeepStory[]) {
  let returnData: DeepStory[] = [];

  for (let i in data) {
    // Double negation is used to convert the string to a boolean, without it an empty string could evaluate to true.
    if (!!data[i].videos) {
      returnData.push(data[i]);
    }
  }

  return returnData;
}

/**
 * Filters out `Story` objects that do not have any reports.
 * @param data Array of `DeepStory` objects to filter.
 * @returns `Story` objects that have at least one report.
 */
export function filterHasReport(data: DeepStory[]) {
  let returnData: DeepStory[] = [];

  for (let i in data) {
    // Double negation is used to convert the string to a boolean, without it an empty string could evaluate to true.
    if (!!data[i].reportSite || !!data[i].reportLink) {
      returnData.push(data[i]);
    }
  }

  return returnData;
}

/**
 * Filters out `Story` objects that do not have any case.
 * @param data Array of `DeepStory` objects to filter.
 * @returns `Story` objects that have at least one case.
 */
export function filterHasCase(data: DeepStory[]) {
  let returnData: DeepStory[] = [];

  for (let i in data) {
    // Double negation is used to convert the string to a boolean, without it an empty string could evaluate to true.
    if (!!data[i].pdfCase) {
      returnData.push(data[i]);
    }
  }

  return returnData;
}

/**
 * Filters out `Story` objects that do not have any open data.
 * @param data Array of `DeepStory` objects to filter.
 * @returns `Story` objects that have at least one open data link.
 */
export function filterHasOpenData(data: DeepStory[]) {
  let returnData: DeepStory[] = [];

  for (let i in data) {
    // Double negation is used to convert the string to a boolean, without it an empty string could evaluate to true.
    if (!!data[i].openData) {
      returnData.push(data[i]);
    }
  }

  return returnData;
}

/**
 * Filters out `Story` objects that are not energy stories, whatever that means.
 * @param data Array of `DeepStory` objects to filter.
 * @returns `Story` objects where the `isEnergyStory` field is true.
 */
export function filterIsEnergyStory(data: DeepStory[]) {
  let returnData: DeepStory[] = [];

  for (let i in data) {
    if (!!data[i].isEnergyStory) {
      returnData.push(data[i]);
    }
  }

  return returnData;
}

/**
 * Filters out `Story` objects that do not have any associated solar data.
 * @param data Array of `DeepStory` objects to filter (taken as `any` to avoid type errors as we check for a field that is not normally present in the `Story` object)
 * @returns `Story` objects that have associated solar data.
 */
export function filterIsSolarData(data: any) {
  let returnData: DeepStory[] = [];

  for (let i in data) {
    // identity is a field that is only present on solar data stories, created by createStoryFromSolar.ts and used for linking to the solar data.
    if (!!data[i].identity) {
      returnData.push(data[i]);
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
  if (filters.years && (Math.max(...filters.years) != yearLimitsStories.max || Math.min(...filters.years) != yearLimitsStories.min)) {
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
  if (filters.video) {
    returnData = filterHasVideo(returnData);
  }
  if (filters.report) {
    returnData = filterHasReport(returnData);
  }
  if (filters.cases) {
    returnData = filterHasCase(returnData);
  }
  if (filters.openData) {
    returnData = filterHasOpenData(returnData);
  }
  if (filters.energyStory) {
    returnData = filterIsEnergyStory(returnData);
  }
  if (filters.solarData) {
    returnData = filterIsSolarData(returnData);
  }
  if (filters.searchInput) {
    returnData = filterStoriesBySearchInput(returnData, filters.searchInput);
  }

  return returnData;
}