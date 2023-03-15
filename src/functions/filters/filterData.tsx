import { DeepRecycle, Filter } from "@/types";
import { MapItem, Recycle } from "@prisma/client";
import { yearLimits } from "@/pages/aterbruk";
import { filterByYear, filterByOrganisation } from "./commonFilters";

export default runActiveFilters;

/**
 * Looks through most of the fields of the Recycle objects and returns an array of the objects that match the search string.
 * @param data Array of DeepRecycle objects to search through.
 * @param search String to search for.
 * @returns Recycle objects where a field matches the search string.
 */
export function filterBySearchInput(data: DeepRecycle[], search: string): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];

  // Fields to search through in the Recycle objects.
  let recycleSearchFields = [
    "projectType",
    "description",
    "contact",
    "externalLinks",
    "availableMaterials",
    "lookingForMaterials",
  ]

  // Fields to search through in the MapItem objects.
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

    for (let j of recycleSearchFields) {
      if (String(data[i][j as keyof DeepRecycle])?.toLowerCase().includes(search)) {
        returnData.push(data[i]);
        breakCheck = true;
        break;
      }
    }

    if (breakCheck) continue;

    // TODO: Add a check for months here. It will require special logic as the months are stored as numbers in the database, but the user will search using their Swedish names.

    for (let k of mapItemSearchFields) {
      if (String(data[i].mapItem[k as keyof MapItem])?.toLowerCase().includes(search)) {
        returnData.push(data[i]);
        break;
      }
    }
  }
  return returnData;
}

/**
 * Filters out recycle objects that do not have a project type that matches with at least one of the project types in the projectType parameter.
 * @param data Array of DeepRecycle objects to filter by project type.
 * @param projectType Array of strings containing the project types to filter by.
 * @returns Recycle objects with a project type that matches with *one or more* of the project types in the projectType parameter.
 */
export function filterByProjectType(data: DeepRecycle[], projectType: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  for (let i in data) {
    for (let j in data[i].projectType?.split(", ")) {
      if (projectType.includes(data[i].projectType?.split(", ")[j])) {
        returnData.push(data[i]);
        break;
      }
    }
  }
  return returnData;
}

/**
 * Filters out recycle objects that do not have a month that is within the range of the month parameter.
 * @param data Array of DeepRecycle objects to filter by month.
 * @param months Array of numbers, where the highest number is the max month and the lowest number is the min month. Can contain a single number, which will be used as both the min and max month.
 * @returns The recycle objects that have a month that is within the range of the month parameter.
 */
export function filterByMonth(data: DeepRecycle[], months: number[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  for (let i in data) {
    if (data[i].month! <= Math.max(...months) && data[i].month! >= Math.min(...months)) {
      returnData.push(data[i]);
    }
  }
  return returnData;
}

/**
 * Filters out recycle objects that are not looking for any of the materials in the lookingFor parameter
 * @param data Array of DeepRecycle objects to filter by the materials they are looking for
 * @param lookingFor Array of strings containing the materials to filter by
 * @returns Recycle objects that are looking for *one or more* of the materials in the lookingFor parameter
 */
export function filterByLookingFor(data: DeepRecycle[], lookingFor: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  for (let i in data) {
    for (let j in data[i].lookingForMaterials?.split(", ")) {
      if (lookingFor.includes(data[i].lookingForMaterials!.split(", ")[j as any])) {
        returnData.push(data[i]);
        break;
      }
    }
  }
  return returnData;
}

/**
 * Filters out recycle objects that are not offering any of the materials in the available parameter
 * @param data Array of DeepRecycle objects to filter by the materials they have available
 * @param available Array of strings containing the materials to filter by
 * @returns Recycle objects offering *one or more* of the materials in the available parameter
 */
export function filterByAvailable(data: DeepRecycle[], available: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  // Just like the filterByLookingFor function, this function is a bit hard to understand. See the comments there for more info.
  for (let i in data) {
    for (let j in data[i].availableMaterials?.split(", ")) {
      if (available.includes(data[i].availableMaterials!.split(", ")[j as any])) {
        returnData.push(data[i]);
        break;
      }
    }
  }
  return returnData;
}

/**
 * Filters through the data parameter using the filters parameter
 * @param data Array of DeepRecycle objects to run through filters
 * @param filters Which filters to apply
 * @returns Filtered list of DeepRecycle objects
 */
export function runActiveFilters(data: DeepRecycle[], filters: Filter): DeepRecycle[] {
  let returnData: DeepRecycle[] = data;

  if (filters.projectType?.length) {
    returnData = filterByProjectType(returnData, filters.projectType);
  }
  // The year and month filters are not run if they are in their respective default states
  if (filters.years && (Math.max(...filters.years) != yearLimits.max || Math.min(...filters.years) != yearLimits.min)) {
    returnData = filterByYear(returnData, filters.years) as DeepRecycle[];
  }
  if (filters.months && (Math.max(...filters.months) != 12 || Math.min(...filters.months) != 1)) {
    returnData = filterByMonth(returnData, filters.months);
  }
  if (filters.availableCategories?.length) {
    returnData = filterByAvailable(returnData, filters.availableCategories);
  }
  if (filters.lookingForCategories?.length) {
    returnData = filterByLookingFor(returnData, filters.lookingForCategories);
  }
  if (filters.organisation?.length) {
    returnData = filterByOrganisation(returnData, filters.organisation) as DeepRecycle[];
  }
  if (filters.searchInput) {
    returnData = filterBySearchInput(returnData, filters.searchInput);
  }
  return returnData;
}