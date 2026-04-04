import { test, expect, parseCoords, VALID_MGRS, VALID_MGRS_2, INVALID_MGRS } from './fixtures'

test.describe('Parsing MGRS coordinates', () => {
  test('Parse button is disabled when input is empty', async ({ freshPage: page }) => {
    // Given the app is open with no input
    // Then the Parse button is disabled
    await expect(page.getByRole('button', { name: 'Parse' })).toBeDisabled()
  })

  test('Parsing a valid coordinate shows a green result row', async ({ freshPage: page }) => {
    // Given the user has entered a valid MGRS coordinate
    // When they click Parse
    await parseCoords(page, [VALID_MGRS])

    // Then a green indicator appears and the summary shows 1 valid
    await expect(page.locator('.bg-green-500').first()).toBeVisible()
    await expect(page.getByText('1 valid')).toBeVisible()
  })

  test('Parsing an invalid coordinate shows a red result row', async ({ freshPage: page }) => {
    // Given the user has entered invalid text
    // When they click Parse
    await parseCoords(page, [INVALID_MGRS])

    // Then the invalid label is shown in the results
    await expect(page.getByText('invalid').first()).toBeVisible()
  })

  test('Parsing mixed input shows correct valid and invalid counts', async ({ freshPage: page }) => {
    // Given two valid and one invalid coordinate
    // When they are parsed
    await parseCoords(page, [VALID_MGRS, VALID_MGRS_2, INVALID_MGRS])

    // Then the summary reflects the split
    await expect(page.getByText('2 valid')).toBeVisible()
    await expect(page.getByText('1 invalid')).toBeVisible()
  })

  test('Coordinates with extra spaces are normalised and parsed successfully', async ({ freshPage: page }) => {
    // Given a coordinate entered with spaces between the parts
    // When it is parsed
    await parseCoords(page, ['30U XC 90000 10000'])

    // Then it is treated as valid
    await expect(page.getByText('1 valid')).toBeVisible()
  })

  test('Clear button resets the input and results', async ({ freshPage: page }) => {
    // Given valid results are shown
    await parseCoords(page, [VALID_MGRS])
    await expect(page.getByText('1 valid')).toBeVisible()

    // When the user clicks Clear
    await page.getByRole('button', { name: 'Clear' }).click()

    // Then the textarea and results are gone
    await expect(page.getByPlaceholder(/33UXP/)).toHaveValue('')
    await expect(page.getByText('1 valid')).not.toBeVisible()
  })

  test('Save bar appears only after valid coordinates are parsed', async ({ freshPage: page }) => {
    // Given no coords have been parsed
    await expect(page.getByRole('button', { name: 'Save', exact: true })).not.toBeVisible()

    // When valid coords are parsed
    await parseCoords(page, [VALID_MGRS])

    // Then the Save bar appears
    await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeVisible()
  })

  test('Save bar does not appear when only invalid coords are parsed', async ({ freshPage: page }) => {
    // Given only invalid coords are entered
    // When they are parsed
    await parseCoords(page, [INVALID_MGRS])

    // Then the Save bar is not shown
    await expect(page.getByRole('button', { name: 'Save', exact: true })).not.toBeVisible()
  })
})
