import type { HTMLAttributes } from "astro/types"

export type Breakpoints = Record<number, number>

export type MasonryProps = {
  columns?: number
  gap?: number | string
  breakpoints?: Breakpoints
  autoColumns?: number | string
  sequential?: boolean
  "aria-label"?: string
  "role"?: HTMLAttributes<"div">["role"]
  class?: string
}
