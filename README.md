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

<Masonry columns={3} aria={{ label: "Photo gallery" }}>
  {photos.map((photo) => (
    <div class="card">
      <img src={photo.src} alt={photo.alt} />
      <p>{photo.caption}</p>
    </div>
  ))}
</Masonry>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `number` | `1` | Number of columns. Used as the base for `breakpoints` |
| `gap` | `number \| string` | `"1rem"` | Gap between items. A plain number is treated as `px` |
| `breakpoints` | `Record<number, number>` | — | Map of `minWidth → columns` for responsive layouts |
| `autoFill` | `number \| string` | — | Minimum column width. Fills as many columns as fit the container |
| `aria` | `{ label?, role? }` | — | Adds `aria-label` and `role` to the root element |
| `class` | `string` | — | Extra class names on the root element |

> `breakpoints` and `autoFill` are mutually exclusive — using both throws an error.

## Breakpoints

Define column counts at specific viewport widths. The `columns` prop sets the base (mobile-first), and breakpoints add on top.

```astro
<!-- 1 column by default, 2 from 640px, 3 from 1024px -->
<Masonry columns={1} breakpoints={{ 640: 2, 1024: 3 }}>
  <div>Item one</div>
  <div>Item two</div>
</Masonry>
```

## Fluid columns

Let the component decide how many columns fit based on a minimum width. Column count updates automatically on container resize.

```astro
<!-- as many ~280px columns as the container fits -->
<Masonry autoFill={280}>
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

## Accessibility

- Screen readers navigate items in column order, which matches the visual layout
- The `aria` prop accepts `label` and `role` for landmark and feed semantics

```astro
<Masonry aria={{ label: "Photo gallery", role: "feed" }}>
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT © [Ere Männistö](https://github.com/eremannisto)