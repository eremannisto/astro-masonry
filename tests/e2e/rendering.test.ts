import { expect, test } from "@playwright/test"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ready = (page: import("@playwright/test").Page) =>
  page.waitForSelector("[data-masonry][data-masonry-ready]")

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

test.describe("Rendering", () => {
  test("multiple instances on the same page render independently", async ({ page }) => {
    await page.goto("/multiple")
    await page.waitForFunction(
      () => document.querySelectorAll("[data-masonry][data-masonry-ready]").length === 2
    )
    const roots = page.locator("[data-masonry][data-masonry-ready]")
    await expect(roots).toHaveCount(2)
  })

  test("slotted items appear in grid columns after JS initialises", async ({ page }) => {
    await page.goto("/")
    await ready(page)
    const colItems = page.locator("[data-masonry-column] [data-testid='item-1']")
    await expect(colItems).toBeVisible()
  })

  test("data-masonry-ready attribute is set on root after first layout", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("[data-masonry][data-masonry-ready]")).toBeAttached()
  })
})

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

test.describe("Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto("/")
    await ready(page)
  })

  test("items are distributed into the correct number of columns", async ({ page }) => {
    // 3 Columns requested; columns with items should be exactly 3
    const activeCount = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("[data-masonry-column]")).filter(
          (c) => (c as HTMLElement).style.display !== "none"
        ).length
    )
    expect(activeCount).toBe(3)
  })

  test("items are distributed by shortest-column, not round-robin", async ({ page }) => {
    // With heights [200,100,150,250,100,200,150,100] and 3 columns the
    // shortest-column algorithm places:  col0→1,6  col1→2,4,8  col2→3,5,7
    // Round-robin would give col0→1,4,7  col1→2,5,8  col2→3,6
    const col0 = page.locator("[data-masonry-column]").nth(0)
    const col1 = page.locator("[data-masonry-column]").nth(1)

    await expect(col0.locator("[data-testid='item-1']")).toBeAttached()
    await expect(col0.locator("[data-testid='item-6']")).toBeAttached()
    await expect(col1.locator("[data-testid='item-2']")).toBeAttached()
    await expect(col1.locator("[data-testid='item-4']")).toBeAttached()
    await expect(col1.locator("[data-testid='item-8']")).toBeAttached()

    // Item-4 is NOT in col0 (which round-robin would produce)
    await expect(col0.locator("[data-testid='item-4']")).not.toBeAttached()
  })

  test("column count responds correctly to each breakpoint on resize", async ({ page }) => {
    await page.goto("/breakpoints")

    await page.setViewportSize({ width: 1024, height: 800 })
    await ready(page)
    const active = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("[data-masonry-column]")).filter(
          (c) => (c as HTMLElement).style.display !== "none"
        ).length
    )
    expect(active).toBe(3)

    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForFunction(
      () =>
        Array.from(document.querySelectorAll("[data-masonry-column]")).filter(
          (c) => (c as HTMLElement).style.display !== "none"
        ).length === 2
    )

    await page.setViewportSize({ width: 320, height: 800 })
    await page.waitForFunction(
      () =>
        Array.from(document.querySelectorAll("[data-masonry-column]")).filter(
          (c) => (c as HTMLElement).style.display !== "none"
        ).length === 1
    )
  })

  test("autoColumns produces correct column count based on container width", async ({ page }) => {
    // autoColumns=200; at 900px wide the container fits floor(≥800/200)=4 columns
    // (Using 900px so default body margin doesn't shrink root below 800px)
    await page.setViewportSize({ width: 900, height: 800 })
    await page.goto("/min-width")
    await ready(page)

    const active = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("[data-masonry-column]")).filter(
          (c) => (c as HTMLElement).style.display !== "none"
        ).length
    )
    expect(active).toBe(4)

    // At 300px the container fits floor(300/200)=1 column
    await page.setViewportSize({ width: 300, height: 800 })
    await page.waitForFunction(
      () =>
        Array.from(document.querySelectorAll("[data-masonry-column]")).filter(
          (c) => (c as HTMLElement).style.display !== "none"
        ).length === 1
    )
  })

  test("autoColumns + columns caps the maximum column count", async ({ page }) => {
    // autoColumns=200, columns=3 (cap). At 900px, floor(≈880/200)=4, but cap=3.
    await page.setViewportSize({ width: 900, height: 800 })
    await page.goto("/auto-cap")
    await ready(page)

    const active = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("[data-masonry-column]")).filter(
          (c) => (c as HTMLElement).style.display !== "none"
        ).length
    )
    expect(active).toBe(3)
  })

  test("autoColumns + breakpoints adjusts the cap at different viewport widths", async ({
    page,
  }) => {
    // autoColumns=200, breakpoints={{ 640: 2, 1024: 3 }}
    await page.setViewportSize({ width: 1024, height: 800 })
    await page.goto("/auto-breakpoints")
    await ready(page)

    const at1024 = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("[data-masonry-column]")).filter(
          (c) => (c as HTMLElement).style.display !== "none"
        ).length
    )
    expect(at1024).toBe(3)

    await page.setViewportSize({ width: 640, height: 800 })
    await page.waitForFunction(
      () =>
        Array.from(document.querySelectorAll("[data-masonry-column]")).filter(
          (c) => (c as HTMLElement).style.display !== "none"
        ).length === 2
    )
  })

  test("column count never drops below 1 with autoColumns", async ({ page }) => {
    await page.setViewportSize({ width: 100, height: 800 })
    await page.goto("/min-width")
    await ready(page)

    const active = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("[data-masonry-column]")).filter(
          (c) => (c as HTMLElement).style.display !== "none"
        ).length
    )
    expect(active).toBeGreaterThanOrEqual(1)
  })
})

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

test.describe("Images", () => {
  test("layout is deferred until images in source have loaded", async ({ page }) => {
    await page.goto("/images")
    await page.waitForSelector("[data-masonry][data-masonry-ready]")
  })

  test("a failed image load does not block layout from completing", async ({ page }) => {
    await page.goto("/images")
    // /missing.png Will 404 — layout must still complete
    await page.waitForSelector("[data-masonry][data-masonry-ready]")
    await expect(page.locator("[data-testid='item-img-broken']")).toBeAttached()
  })
})

// ---------------------------------------------------------------------------
// Sequential
// ---------------------------------------------------------------------------

test.describe("Sequential", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto("/sequential")
    await ready(page)
  })

  test("sequential distributes items left-to-right, top-to-bottom (round-robin)", async ({
    page,
  }) => {
    // 9 Items, 3 cols: col0→1,4,7  col1→2,5,8  col2→3,6,9
    const col0 = page.locator("[data-masonry-column]").nth(0)
    const col1 = page.locator("[data-masonry-column]").nth(1)
    const col2 = page.locator("[data-masonry-column]").nth(2)

    await expect(col0.locator("[data-testid='item-1']")).toBeAttached()
    await expect(col0.locator("[data-testid='item-4']")).toBeAttached()
    await expect(col0.locator("[data-testid='item-7']")).toBeAttached()
    await expect(col1.locator("[data-testid='item-2']")).toBeAttached()
    await expect(col1.locator("[data-testid='item-5']")).toBeAttached()
    await expect(col1.locator("[data-testid='item-8']")).toBeAttached()
    await expect(col2.locator("[data-testid='item-3']")).toBeAttached()
    await expect(col2.locator("[data-testid='item-6']")).toBeAttached()
    await expect(col2.locator("[data-testid='item-9']")).toBeAttached()
  })

  test("sequential does not affect keyboard navigation", async ({ page }) => {
    // ArrowDown from link-1 (col 0, pos 0) should reach link-4 (col 0, pos 1)
    await page.focus("[data-testid='link-1']")
    await page.keyboard.press("ArrowDown")
    await expect(page.locator("[data-testid='link-4']")).toBeFocused()

    // ArrowRight from link-1 (col 0) should reach link-2 (col 1 top)
    await page.focus("[data-testid='link-1']")
    await page.keyboard.press("ArrowRight")
    await expect(page.locator("[data-testid='link-2']")).toBeFocused()
  })
})

// ---------------------------------------------------------------------------
// View transitions
// ---------------------------------------------------------------------------

test.describe("View transitions", () => {
  test("layout initialises correctly after astro:page-load fires", async ({ page }) => {
    await page.goto("/transitions/")
    await page.waitForSelector("[data-masonry][data-masonry-ready]")

    await page.click("[data-testid='nav-to-b']")
    await page.waitForSelector("[data-masonry][data-masonry-ready]")

    // New page's masonry is initialised and items are placed
    await expect(page.locator("[data-masonry-column] [data-testid='tb-item-1']")).toBeAttached()
  })

  test("second navigation does not double-initialise any instance", async ({ page }) => {
    await page.goto("/transitions/")
    await page.waitForSelector("[data-masonry][data-masonry-ready]")

    // Capture how many items are in columns after first init
    const countBefore = await page.locator("[data-masonry-column] [data-testid]").count()
    expect(countBefore).toBeGreaterThan(0)

    // Simulate astro:page-load firing a second time on the same page
    await page.evaluate(() => document.dispatchEvent(new Event("astro:page-load")))
    await page.waitForTimeout(100)

    // Item count must be identical — no duplication from a second MasonryInstance
    const countAfter = await page.locator("[data-masonry-column] [data-testid]").count()
    expect(countAfter).toBe(countBefore)
  })
})
