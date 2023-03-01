import { DeepRecycle, Filter } from "@/types";

export default runActiveFilters;


function runActiveFilters(data: DeepRecycle[], activeFilters: Filter): DeepRecycle[];

function filterByProjectType(data: DeepRecycle[], projectType: string[]): DeepRecycle[];


function filterByProjectType(data: DeepRecycle[], projectType: string[]): DeepRecycle[] {
  let returnData: DeepRecycle[] = [];
  for ( let i in data ){
    // TODO: Refactor this to be better
    if (data[i].projectType === projectType[0] || data[i].projectType === projectType[1] || data[i].projectType === projectType[2]) {
      returnData.push(data[i]);
    }
  }
  return returnData;
}