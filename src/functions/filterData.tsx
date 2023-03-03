import { DeepRecycle, Filter } from "@/types";
import { Recycle } from "@prisma/client";

export default runActiveFilters;
export { runActiveFilters, filterByProjectType, filterByYear, filterByLookingFor, filterByAvailable, filterByOrganisation };

/**
 * Filters out recycle objects that do not have a project type that matches with at least one of the project types in the projectType parameter.
 * @param data Array of DeepRecycle objects to filter by project type.
 * @param projectType Array of strings containing the project types to filter by.
 * @returns Recycle objects with a project type that matches with *one or more* of the project types in the projectType parameter.
 */
function filterByProjectType(data: DeepRecycle[], projectType: string[]): DeepRecycle[] {
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
 * Filters out recycle objects that do not have a year that is within the range of the year parameter.
 * @param data Array of DeepRecycle objects to filter by year.
 * @param years Array of numbers, where the highest number is the max year and the lowest number is the min year. Can contain a single number, which will be used as both the min and max year.
 * @returns The recycle objects that have a year that is within the range of the year parameter.
 */
function filterByYear(data: DeepRecycle[], years: number[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  console.log(Math.max(...years), Math.min(...years))
  for (let i in data) {
    if (data[i].mapItem.year! <= Math.max(...years) && data[i].mapItem.year! >= Math.min(...years)) {
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
function filterByLookingFor(data: DeepRecycle[], lookingFor: string[]): DeepRecycle[] {
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
function filterByAvailable(data: DeepRecycle[], available: string[]): DeepRecycle[] {
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
 * Filters out recycle objects that do not belong to any of the organisations in the organisation parameter
 * @param data Array of DeepRecycle objects to filter by organisation
 * @param organisation Array of strings containing the organisations to filter by
 * @returns Recycle objects that belong to *one or more* of the organisations in the organisation parameter
*/
function filterByOrganisation(data: DeepRecycle[], organisation: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  for (let i in data) {
    if (organisation.includes(data[i].mapItem.organisation!)) {
      returnData.push(data[i]);
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
function runActiveFilters(data: DeepRecycle[], filters: Filter): DeepRecycle[] {
  let returnData: DeepRecycle[] = data;
  // If the year slider in ../components/sidebar.tsx is changed, this value might need to be updated
  const currentDate = new Date().getFullYear()
  console.log("Active filters: ", filters);
  if (filters.projectType?.length) {
    returnData = filterByProjectType(returnData, filters.projectType);
    console.log("Project type filter applied: ", filters.projectType);
  }
  // If the year slider in ../components/sidebar.tsx is changed, this comparison might need to be updated to reflect the new input range
  if (filters.years && (Math.max(...filters.years) != (currentDate + 10) || Math.min(...filters.years) != currentDate)) {
    returnData = filterByYear(returnData, filters.years);
    console.log("Year filter applied: ", filters.years);
  }
  if (filters.availableCategories?.length) {
    returnData = filterByAvailable(returnData, filters.availableCategories);
    console.log("Available filter applied: ", filters.availableCategories);
  }
  if (filters.lookingForCategories?.length) {
    returnData = filterByLookingFor(returnData, filters.lookingForCategories);
    console.log("Looking for filter applied: ", filters.lookingForCategories);
  }
  if (filters.organisation?.length) {
    returnData = filterByOrganisation(returnData, filters.organisation);
    console.log("Organisation filter applied: ", filters.organisation);
  }
  console.log("Tried to apply filters");
  return returnData;
}