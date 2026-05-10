import { expect, test } from "@playwright/test"

const ready = (page: import("@playwright/test").Page) =>
  page.waitForSelector("[data-masonry][data-masonry-ready]")

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await ready(page)
  })

  test("[data-masonry-slot] is removed from DOM after layout", async ({ page }) => {
    await expect(page.locator("[data-masonry-slot]")).not.toBeAttached()
  })

  test("aria.label renders as aria-label on the root element", async ({ page }) => {
    await expect(page.locator("[data-masonry]")).toHaveAttribute("aria-label", "Basic masonry grid")
  })

  test("slotted items with links remain focusable after layout (not cloned)", async ({ page }) => {
    // Items are moved, not cloned — each link appears exactly once in the DOM
    const link1Count = await page.locator("[data-testid='link-1']").count()
    expect(link1Count).toBe(1)

    // The link is focusable
    await page.focus("[data-testid='link-1']")
    await expect(page.locator("[data-testid='link-1']")).toBeFocused()
  })
})
