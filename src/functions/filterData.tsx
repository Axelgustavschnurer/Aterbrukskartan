import { DeepRecycle, Filter } from "@/types";

// export default runActiveFilters;
export { filterByProjectType, filterByYear };

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

/*function filterByLookingFor(data: DeepRecycle[], lookingFor: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  for (let i in data) {
    switch (data[i].lookingForMaterials) {
      case lookingFor[0]:
      case lookingFor[1]:
      case lookingFor[2]:
      case lookingFor[3]:
        returnData.push(data[i]);
        continue;
        break;

      default:
        break;
    }
    break;
  }
  return returnData;
}*/

// function runActiveFilters(data: DeepRecycle[], filters: Filter[]): DeepRecycle[];