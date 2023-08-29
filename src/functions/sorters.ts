import { DeepRecycle, DeepStory } from "@/types";
import { Recycle, Story } from "@prisma/client";

/**
 * Sorts an array of recycle objects by their id
 */
export function recycleSorter(a: Recycle, b: Recycle) {
  return a.id - b.id;
}

/**
 * Sorts an array of story objects by their id
 */
export function storySorter(a: Story, b: Story) {
  return a.id - b.id;
}