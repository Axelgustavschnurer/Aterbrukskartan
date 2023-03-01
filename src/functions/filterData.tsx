import { DeepRecycle, Filter } from "@/types";

// export default runActiveFilters;
export { filterByProjectType, filterByYear, filterByLookingFor };

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

function filterByYear(data: DeepRecycle[], year: number[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  for (let i in data) {
    if (data[i].mapItem.year! <= Math.max(...year) && data[i].mapItem.year! >= Math.min(...year)) {
      returnData.push(data[i]);
    }
  }
  return returnData;
}

function filterByLookingFor(data: DeepRecycle[], lookingFor: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  // Loop through the list of all map tacks
  for (let i in data) {
    // The leaveInnerLoop label and ´break leaveInnerLoop;´ are used to break out of the for loop from within a switch statement
    leaveInnerLoop: {
      // Split the lookingForMaterials string and compare each material within to the materials in the filter.
      // If *ANY* material in the string matches *ANY* material in the filter, the map tack is added to the returnData array and thus not filtered away.
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

// function runActiveFilters(data: DeepRecycle[], filters: Filter[]): DeepRecycle[];