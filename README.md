# Astro Masonry

![banner](./docs/banner.png)

![Astro](https://img.shields.io/badge/astro-%232C2052.svg?style=for-the-badge&logo=astro&logoColor=white)
![npm version](https://img.shields.io/npm/v/@mannisto/astro-masonry?style=for-the-badge)
![license](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

Astro-native masonry layout component with shortest-column balancing, responsive breakpoints, and accessible arrow key navigation.

## Installation

```bash
npm install @mannisto/astro-masonry
```

```bash
pnpm add @mannisto/astro-masonry
```

```bash
yarn add @mannisto/astro-masonry
```

## Usage

```astro
---
import { Masonry } from "@mannisto/astro-masonry/components"
---

<Masonry columns={3} gap="1.5rem" aria={{ label: "Photo gallery" }}>
  {photos.map((photo) => (
    <div class="card">
      <img src={photo.src} alt={photo.alt} />
      <p>{photo.caption}</p>
    </div>
  ))}
</Masonry>
```

Items are slotted in and automatically distributed across columns. Each item is **moved, not cloned** — event listeners on slotted elements are always preserved.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `number` | `1` | Number of columns. Used as the base for `breakpoints` |
| `gap` | `number \| string` | `"1rem"` | Gap between items. A plain number is treated as `px` |
| `breakpoints` | `Record<number, number>` | — | Map of `minWidth → columns` for responsive layouts |
| `columnMinWidth` | `number \| string` | — | Minimum column width. Fills as many columns as fit the container |
| `aria` | `{ label?, role? }` | — | Adds `aria-label` and `role` to the root element |
| `class` | `string` | — | Extra class names on the root element |

> `breakpoints` and `columnMinWidth` are mutually exclusive — using both at the same time throws an error.

## Breakpoints

Define column counts at specific viewport widths. The `columns` prop sets the base (mobile-first), and breakpoints add on top.

```astro
<!-- 1 column by default, 2 from 640px, 3 from 1024px -->
<Masonry columns={1} breakpoints={{ 640: 2, 1024: 3 }} gap="1rem">
  <div>Item one</div>
  <div>Item two</div>
</Masonry>
```

## Fluid columns

Let the component decide how many columns fit based on a minimum width. Column count updates automatically on container resize.

```astro
<!-- as many ~280px columns as the container fits -->
<Masonry columnMinWidth={280} gap="1rem">
  <div>Item one</div>
  <div>Item two</div>
</Masonry>
```

## Keyboard navigation

When focus is inside the grid, arrow keys move between items:

| Key | Behaviour |
|---|---|
| `ArrowUp` | Previous item in the same column |
| `ArrowDown` | Next item in the same column |
| `ArrowLeft` | Item in the previous column at the same vertical position |
| `ArrowRight` | Item in the next column at the same vertical position |

Focus is placed on the first focusable descendant inside the target item (link, button, etc.), or the item itself if none exists.

## Accessibility

- Before layout completes, items are in `[data-masonry-slot]` and readable by screen readers in their original slot order
- After layout, the slot is removed from the DOM — items exist exactly once, inside the grid columns
- The grid is hidden with `visibility: hidden` until layout is ready, preventing a flash of empty columns
- The `aria` prop passes `aria-label` and `role` directly to the root element

## License

MIT © [Ere Männistö](https://github.com/eremannisto)
