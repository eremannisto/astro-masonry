export type Breakpoints = Record<number, number>

export type AriaProps = {
  label?: string
  role?: astroHTML.JSX.HTMLAttributes["role"]
}

export type MasonryProps = {
  columns?: number
  gap?: number | string
  breakpoints?: Breakpoints
  autoFill?: number | string
  aria?: AriaProps
  class?: string
}
