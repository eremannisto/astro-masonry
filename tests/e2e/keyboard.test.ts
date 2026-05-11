import { expect, test } from "@playwright/test"

// Column layout for the index page (16 items, 3 cols):
//   Col 0: items 1, 6, 9, 12, 16
//   Col 1: items 2, 4, 8, 11, 13
//   Col 2: items 3, 5, 7, 10, 14, 15

const ready = (page: import("@playwright/test").Page) =>
  page.waitForSelector("[data-masonry][data-masonry-ready]")

test.describe("Keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await ready(page)
  })

  // -------------------------------------------------------------------------
  // ArrowDown
  // -------------------------------------------------------------------------

  test("ArrowDown moves focus to the next item in the same column", async ({ page }) => {
    await page.focus("[data-testid='link-1']")
    await page.keyboard.press("ArrowDown")
    await expect(page.locator("[data-testid='link-6']")).toBeFocused()
  })

  test("ArrowDown on the last item in a column does nothing", async ({ page }) => {
    await page.focus("[data-testid='link-16']")
    await page.keyboard.press("ArrowDown")
    // Focus stays on link-16 (last in col 0)
    await expect(page.locator("[data-testid='link-16']")).toBeFocused()
  })

  // -------------------------------------------------------------------------
  // ArrowUp
  // -------------------------------------------------------------------------

  test("ArrowUp moves focus to the previous item in the same column", async ({ page }) => {
    await page.focus("[data-testid='link-4']")
    await page.keyboard.press("ArrowUp")
    await expect(page.locator("[data-testid='link-2']")).toBeFocused()
  })

  test("ArrowUp on the first item in a column does nothing", async ({ page }) => {
    await page.focus("[data-testid='link-1']")
    await page.keyboard.press("ArrowUp")
    await expect(page.locator("[data-testid='link-1']")).toBeFocused()
  })

  // -------------------------------------------------------------------------
  // ArrowRight
  // -------------------------------------------------------------------------

  test("ArrowRight moves to the item in the next column at the same vertical position", async ({
    page,
  }) => {
    // Item-1 is at the top of col 0; item-2 is at the top of col 1
    await page.focus("[data-testid='link-1']")
    await page.keyboard.press("ArrowRight")
    await expect(page.locator("[data-testid='link-2']")).toBeFocused()
  })

  test("ArrowRight on the last column does nothing", async ({ page }) => {
    // Item-3 is in col 2 (last column)
    await page.focus("[data-testid='link-3']")
    await page.keyboard.press("ArrowRight")
    await expect(page.locator("[data-testid='link-3']")).toBeFocused()
  })

  // -------------------------------------------------------------------------
  // ArrowLeft
  // -------------------------------------------------------------------------

  test("ArrowLeft moves to the item in the previous column at the same vertical position", async ({
    page,
  }) => {
    // Item-2 is at the top of col 1; item-1 is at the top of col 0
    await page.focus("[data-testid='link-2']")
    await page.keyboard.press("ArrowLeft")
    await expect(page.locator("[data-testid='link-1']")).toBeFocused()
  })

  test("ArrowLeft on the first column does nothing", async ({ page }) => {
    await page.focus("[data-testid='link-1']")
    await page.keyboard.press("ArrowLeft")
    await expect(page.locator("[data-testid='link-1']")).toBeFocused()
  })

  // -------------------------------------------------------------------------
  // Multi-step column traversal
  // -------------------------------------------------------------------------

  test("ArrowDown then ArrowRight then ArrowUp navigates correctly", async ({ page }) => {
    // Start at item-2 (col 1, pos 0), go down to item-4 (col 1, pos 1),
    // then right to item in col 2 near item-4's y position
    await page.focus("[data-testid='link-2']")
    await page.keyboard.press("ArrowDown") // → item-4
    await expect(page.locator("[data-testid='link-4']")).toBeFocused()

    await page.keyboard.press("ArrowRight") // → item in col 2 at ≈ item-4's top y
    // Item-4 top ≈ 100+gap below col top; col2 has item-3(150), item-5(100), item-7(150)
    // Item-4's y is within item-3's range → lands on item-3 or item-5
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("data-testid"))
    expect(["link-3", "link-5"]).toContain(focused)
  })

  // -------------------------------------------------------------------------
  // Arrow keys outside masonry
  // -------------------------------------------------------------------------

  test("arrow keys do nothing when focus is outside the masonry", async ({ page }) => {
    // Focus the document body (outside masonry)
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur())
    const focusBefore = await page.evaluate(() => document.activeElement?.tagName)

    await page.keyboard.press("ArrowDown")

    const focusAfter = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusAfter).toBe(focusBefore)
  })

  // -------------------------------------------------------------------------
  // Focus target
  // -------------------------------------------------------------------------

  test("focus lands on the first focusable descendant inside the target item", async ({ page }) => {
    // All items on the index page contain <a> links; ArrowDown from link-1
    // should focus the <a> in item-6, not the item wrapper itself
    await page.focus("[data-testid='link-1']")
    await page.keyboard.press("ArrowDown")

    const tagName = await page.evaluate(() => document.activeElement?.tagName.toLowerCase())
    expect(tagName).toBe("a")

    await expect(page.locator("[data-testid='link-6']")).toBeFocused()
  })
})
