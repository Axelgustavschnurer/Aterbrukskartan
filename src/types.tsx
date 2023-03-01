import { Prisma } from '@prisma/client'

/**
 * A version of Recycle that includes the mapItem relation
 */
export type DeepRecycle = Prisma.RecycleGetPayload<{
  include: { mapItem: true }
}>

export type Filter = {
  projectType?: string[],
  minYear?: number,
  maxYear?: number,
  availableCategories?: string[],
  lookingForCategories?: string[],
  organization?: string[],
}