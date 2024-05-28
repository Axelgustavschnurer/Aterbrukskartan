import { Recycle } from "@prisma/client";

/**
 * Sorts an array of recycle objects by their id
 */
export function recycleSorter(a: Recycle, b: Recycle) {
  return a.id - b.id;
}
