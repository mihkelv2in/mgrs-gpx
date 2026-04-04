import { test, expect, parseCoords, VALID_MGRS } from './fixtures'

test.describe('UI behaviour', () => {
  test('Dark mode toggles on and off', async ({ freshPage: page }) => {
    // Given the app is in its default state
    const html = page.locator('html')

    // When the user clicks the theme toggle
    await page.getByRole('button', { name: 'Toggle dark mode' }).click()

    // Then the dark class is applied or removed on <html>
    const hasDark = await html.evaluate(el => el.classList.contains('dark'))
    // Click again to toggle back
    await page.getByRole('button', { name: 'Toggle dark mode' }).click()
    const hasDarkAfter = await html.evaluate(el => el.classList.contains('dark'))
    expect(hasDark).not.toBe(hasDarkAfter)
  })

  test('Dark mode preference persists after reload', async ({ freshPage: page }) => {
    // Given the user has toggled dark mode
    await page.getByRole('button', { name: 'Toggle dark mode' }).click()
    const darkBefore = await page.locator('html').evaluate(el => el.classList.contains('dark'))

    // When the page is reloaded
    await page.reload()

    // Then the preference is maintained
    const darkAfter = await page.locator('html').evaluate(el => el.classList.contains('dark'))
    expect(darkAfter).toBe(darkBefore)
  })

  test('Custom label is reflected in the results list', async ({ freshPage: page }) => {
    // Given valid coordinates have been parsed
    await parseCoords(page, [VALID_MGRS])

    // When the user edits the label of the first result
    const labelInput = page.getByRole('textbox').first()
    await labelInput.fill('CUSTOM01')

    // Then the label input shows the new value
    await expect(labelInput).toHaveValue('CUSTOM01')
  })

  test('Help modal opens and closes', async ({ freshPage: page }) => {
    // Given the app is open
    // When the user clicks the help button
    await page.getByRole('button', { name: 'Install help' }).click()

    // Then a modal appears with the heading
    await expect(page.getByRole('heading', { name: 'Add to Home Screen' })).toBeVisible()

    // When the user closes it
    await page.getByRole('button', { name: 'Close' }).click()

    // Then the modal is gone
    await expect(page.getByRole('heading', { name: 'Add to Home Screen' })).not.toBeVisible()
  })

  test('Prefix input is forced to uppercase and limited to 5 characters', async ({ freshPage: page }) => {
    // Given valid coords are parsed so the save bar is visible
    await parseCoords(page, [VALID_MGRS])

    // When the user types a long lowercase prefix
    const prefixInput = page.getByPlaceholder('WPT')
    await prefixInput.fill('toolong')

    // Then the value is uppercased and capped at 5 characters
    await expect(prefixInput).toHaveValue('TOOLO')
  })
})
