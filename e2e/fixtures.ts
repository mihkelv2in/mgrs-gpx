import { test as base, expect, type Page } from '@playwright/test'

// A real 10-digit MGRS coordinate (central London area)
export const VALID_MGRS = '30UXC9000010000'
export const VALID_MGRS_2 = '30UXC9100011000'
export const INVALID_MGRS = 'NOTMGRS'

/** Clear localStorage and navigate to the app. */
async function freshPage(page: Page) {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
}

/** Type MGRS lines into the textarea and click Parse. */
async function parseCoords(page: Page, lines: string[]) {
  await page.getByPlaceholder(/33UXP/).fill(lines.join('\n'))
  await page.getByRole('button', { name: 'Parse' }).click()
}

/** Parse coords, then fill in name + prefix and click Save. */
async function saveSet(page: Page, lines: string[], name: string, prefix: string) {
  await parseCoords(page, lines)
  await page.getByPlaceholder(/Import/).fill(name)
  await page.getByPlaceholder('WPT').fill(prefix)
  await page.getByRole('button', { name: 'Save', exact: true }).click()
}

export const test = base.extend<{
  freshPage: Page
}>({
  freshPage: async ({ page }, use) => {
    await freshPage(page)
    await use(page)
  },
})

export { expect, parseCoords, saveSet, freshPage }
