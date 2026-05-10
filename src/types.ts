export type Breakpoints = Record<number, number>

export type AriaProps = {
  label?: string
  role?: astroHTML.JSX.HTMLAttributes["role"]
}

export type MasonryProps = {
  columns?: number
  gap?: number | string
  breakpoints?: Breakpoints
  columnMinWidth?: number | string
  aria?: AriaProps
  class?: string
}
