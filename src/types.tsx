import { Prisma, Recycle, Story } from '@prisma/client'

/**
 * A version of Recycle that includes the mapItem relation
 */
export type DeepRecycle = Prisma.RecycleGetPayload<{
  include: { mapItem: true }
}>

/**
 * Checks if an object is a `DeepRecycle` or `Recycle` object rather than a `DeepStory` or `Story` object.
 * @param object Object to check
 * @returns `true` if the object is a `DeepRecycle` or `Recycle` object, `false` otherwise.
 */
export function isRecycle(object: any): object is DeepRecycle | Recycle {
  return (object as DeepRecycle | Recycle).projectType !== undefined
}

/**
 * Checks if an object is an array of `DeepRecycle` or `Recycle` objects rather than an array of `DeepStory` or `Story` objects.
 * @param object Object to check
 * @returns `true` if the object is an array of `DeepRecycle` or `Recycle` objects, `false` otherwise.
 */
export function isRecycleArray(object: any): object is DeepRecycle[] | Recycle[] {
  return Array.isArray(object) && isRecycle(object[0])
}

/**
 * A version of Story that includes the mapItem relation
 */
export type DeepStory = Prisma.StoryGetPayload<{
  include: { mapItem: true }
}>

/**
 * Checks if an object is a `DeepStory` or `Story` object rather than a `DeepRecycle` or `Recycle` object.
 * @param object Object to check
 * @returns `true` if the object is a `DeepStory` or `Story` object, `false` otherwise.
 */
export function isStory(object: any): object is DeepStory | Story {
  return (object as DeepStory | Story).isEnergyStory !== undefined
}

/**
 * Checks if an object is an array of `DeepStory` or `Story` objects rather than an array of `DeepRecycle` or `Recycle` objects.
 * @param object Object to check
 * @returns `true` if the object is an array of `DeepStory` or `Story` objects, `false` otherwise.
 */
export function isStoryArray(object: any): object is DeepStory[] | Story[] {
  return Array.isArray(object) && isStory(object[0])
}

/**
 * The data format used when creating a new `Recycle` object in the database.
 */
export type DeepRecycleInput = Prisma.RecycleCreateWithoutMapItemInput & {
  mapItem: Prisma.MapItemCreateWithoutRecycleInput
}

/**
 * The data format used when creating a new `Story` object in the database.
 */
export type DeepStoryInput = Prisma.StoryCreateWithoutMapItemInput & {
  mapItem: Prisma.MapItemCreateWithoutStoryInput
}

/**
 * A type containing filters for the recycle page
 * @param projectType Array of strings containing the project types to filter by.
 * @param years Array of numbers, where the highest number is the max year and the lowest number is the min year. Can contain a single number, which will be used as both the min and max year.
 * @param months Array of numbers, where the highest number is the max month and the lowest number is the min month. Can contain a single number, which will be used as both the min and max month.
 * @param availableCategories Array of strings containing materials to filter out which projects have them available
 * @param lookingForCategories Array of strings containing materials to filter out which projects are looking for them
 * @param organisation Array of strings containing the organisations to filter by
 * @param searchInput String containing the search input
 * @param showInactive Boolean to filter out stories that haven't been deactivated (true = show only inactive, fale = show all)
 */
export type RecycleFilter = {
  /** Array of strings containing the project types to filter by. */
  projectType?: string[],
  /** Array of numbers, where the highest number is the max year and the lowest number is the min year. Can contain a single number, which will be used as both the min and max year. */
  years?: number[],
  /** Array of numbers, where the highest number is the max month and the lowest number is the min month. Can contain a single number, which will be used as both the min and max month. */
  months?: number[],
  /** Array of strings containing materials to filter out which projects have them available */
  availableCategories?: string[],
  /** Array of strings containing materials to filter out which projects are looking for them */
  lookingForCategories?: string[],
  /** Array of strings containing organisations to filter by */
  organisation?: string[],
  /** String containing the search input */
  searchInput?: string,
  /** Boolean to filter out stories that haven't been deactivated (true = show only inactive, fale = show all) */
  showInactive?: boolean,
}

/**
 * A type containing filters for the story page
 * @param years Array of numbers, where the highest number is the max year and the lowest number is the min year. Can contain a single number, which will be used as both the min and max year.
 * @param organisation Array of strings containing organisations to filter by
 * @param categories Array of strings containing categories to filter by
 * @param educationalProgram Array of strings containing educational programs to filter by
 * @param video Boolean to filter out stories that don't have a video
 * @param report Boolean to filter out stories that don't have a report
 * @param cases Boolean to filter out stories that don't have a link to a case
 * @param openData Boolean to filter out stories that don't have a link to open data
 * @param energyStory Boolean to filter out stories that aren't energy stories, whatever that means
 * @param searchInput String containing the search input
 * @param showInactive Boolean to filter out stories that haven't been deactivated (true = show only inactive, fale = show all)
 */
export type StoryFilter = {
  /** Array of numbers, where the highest number is the max year and the lowest number is the min year. Can contain a single number, which will be used as both the min and max year. */
  years?: number[],
  /** Array of strings containing organisations to filter by */
  organisation?: string[],
  /** Array of strings containing projects categories to filter by */
  categories?: string[],
  /** Array of strings containing educational programs to filter by */
  educationalProgram?: string[],
  /** Array of strings containing educational specialisations to filter by */
  educationalSpecialisation?: string[],
  /** Boolean to filter out stories that don't have a video */
  video?: boolean,
  /** Boolean to filter out stories that don't have a report */
  report?: boolean,
  /** Boolean to filter out stories that don't have a link to a case */
  cases?: boolean,
  /** Boolean to filter out stories that don't have a link to open data */
  openData?: boolean,
  /** Boolean to filter out stories that aren't energy stories, whatever that means */
  energyStory?: boolean,
  /** Boolean to filter out stories that don't have a link to solar data */
  solarData?: boolean,
  /** String containing the search input */
  searchInput?: string,
  /** Boolean to filter out stories that haven't been deactivated (true = show only inactive, fale = show all) */
  showInactive?: boolean,
}