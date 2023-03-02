import { DeepRecycle, Filter } from "@/types";

// export default runActiveFilters;
export { filterByProjectType, filterByYear, filterByLookingFor, filterByAvailable };

/**
 * Filters out recycle objects that do not have a project type that matches with at least one of the project types in the projectType parameter.
 * @param data Array of DeepRecycle objects to filter by project type.
 * @param projectType Array of strings containing the project types to filter by.
 * @returns Map items with a project type that matches with *at least one* of the project types in the projectType parameter.
 */
function filterByProjectType(data: DeepRecycle[], projectType: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  for (let i in data) {
    switch (data[i].projectType) {
      case projectType[0]:
      case projectType[1]:
      case projectType[2]:
        returnData.push(data[i]);
        break;

      default:
        break;
    }
  }
  return returnData;
}

/**
 * Filters out recycle objects that do not have a year that is within the range of the year parameter.
 * @param data Array of DeepRecycle objects to filter by year.
 * @param year Array of numbers, where the highest number is the max year and the lowest number is the min year. Can contain a single number, which will be used as both the min and max year.
 * @returns The map items that have a year that is within the range of the year parameter.
 */
function filterByYear(data: DeepRecycle[], year: number[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  for (let i in data) {
    if (data[i].mapItem.year! <= Math.max(...year) && data[i].mapItem.year! >= Math.min(...year)) {
      returnData.push(data[i]);
    }
  }
  return returnData;
}

/**
 * Filters out recycle objects that are not looking for any of the materials in the lookingFor parameter
 * @param data Array of DeepRecycle objects to filter by the materials they are looking for
 * @param lookingFor Array of strings containing the materials to filter by
 * @returns Map items that are looking for *at least one* of the materials in the lookingFor parameter
 */
function filterByLookingFor(data: DeepRecycle[], lookingFor: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  // This function is a bit complicated, because it needs to split the lookingForMaterials string and compare each material within to the materials in the filter.
  // The idea is that if *ANY* material in the string matches *ANY* material in the filter, the map tack is added to the returnData array and thus not filtered away.
  for (let i in data) {
    // The leaveInnerLoop label and ´break leaveInnerLoop;´ are used to break out of the for loop from within a switch statement
    leaveInnerLoop: {
      for (let j in data[i].lookingForMaterials?.split(", ")) {
        switch (j) {
          case lookingFor[0]:
          case lookingFor[1]:
          case lookingFor[2]:
          case lookingFor[3]:
            returnData.push(data[i]);
            break leaveInnerLoop;

          default:
            break;
        }
      }
    }
  }
  return returnData;
}

/**
 * Filters out recycle objects that are not offering any of the materials in the available parameter
 * @param data Array of DeepRecycle objects to filter by the materials they have available
 * @param available Array of strings containing the materials to filter by
 * @returns Map items offering *at least one* of the materials in the available parameter
 */
function filterByAvailable(data: DeepRecycle[], available: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  // Just like the filterByLookingFor function, this function is a bit hard to understand. See the comments there for more info.
  for (let i in data) {
    // The leaveInnerLoop label and ´break leaveInnerLoop;´ are used to break out of the for loop from within a switch statement
    leaveInnerLoop: {
      for (let j in data[i].availableMaterials?.split(", ")) {
        switch (j) {
          case available[0]:
          case available[1]:
          case available[2]:
          case available[3]:
            returnData.push(data[i]);
            break leaveInnerLoop;
            
          default:
            break;
        }
      }
    }
  }
  return returnData;
}

// function runActiveFilters(data: DeepRecycle[], filters: Filter[]): DeepRecycle[];