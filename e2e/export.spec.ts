import { test, expect, parseCoords, saveSet, VALID_MGRS, VALID_MGRS_2 } from './fixtures'

test.describe('Exporting GPX', () => {
  test('Export from input tab downloads a GPX file', async ({ freshPage: page }) => {
    // Given valid coordinates are parsed
    await parseCoords(page, [VALID_MGRS])
    await page.getByPlaceholder(/Import/).fill('Test Export')

    // When the user clicks Export
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export' }).click(),
    ])

    // Then a .gpx file is downloaded
    expect(download.suggestedFilename()).toMatch(/\.gpx$/)
  })

  test('Exported GPX file contains valid XML with the set name', async ({ freshPage: page }) => {
    // Given valid coordinates are parsed with a specific name
    await parseCoords(page, [VALID_MGRS])
    await page.getByPlaceholder(/Import/).fill('My Route')

    // When the user exports
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export' }).click(),
    ])

    // Then the GPX content contains the set name and a waypoint
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) chunks.push(Buffer.from(chunk))
    const content = Buffer.concat(chunks).toString()

    expect(content).toContain('<?xml')
    expect(content).toContain('<gpx ')
    expect(content).toContain('<name>My Route</name>')
    expect(content).toContain('<wpt ')
  })

  test('Selecting markers from a saved set shows the ExportBar', async ({ freshPage: page }) => {
    // Given a set has been saved
    await saveSet(page, [VALID_MGRS], 'Hotel Set', 'H')
    await page.getByRole('button', { name: /Saved sets/ }).click()

    // When the user checks the set's checkbox
    await page.locator('input[type="checkbox"]').first().check()

    // Then the ExportBar appears at the bottom with the selection count
    await expect(page.getByText(/marker.*selected/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Export GPX' })).toBeVisible()
  })

  test('ExportBar shows count for multiple selected markers', async ({ freshPage: page }) => {
    // Given a set with two markers is saved
    await saveSet(page, [VALID_MGRS, VALID_MGRS_2], 'India Set', 'I')
    await page.getByRole('button', { name: /Saved sets/ }).click()

    // When the user checks the set (selects all)
    await page.locator('input[type="checkbox"]').first().check()

    // Then the count shows 2
    await expect(page.getByText('2 markers selected')).toBeVisible()
  })

  test('Clearing selection hides the ExportBar', async ({ freshPage: page }) => {
    // Given a marker is selected and the ExportBar is visible
    await saveSet(page, [VALID_MGRS], 'Juliet Set', 'J')
    await page.getByRole('button', { name: /Saved sets/ }).click()
    await page.locator('input[type="checkbox"]').first().check()
    await expect(page.getByRole('button', { name: 'Export GPX' })).toBeVisible()

    // When the user clicks "✕ clear" in the ExportBar
    await page.getByText('✕ clear').click()

    // Then the ExportBar is gone
    await expect(page.getByRole('button', { name: 'Export GPX' })).not.toBeVisible()
  })

  test('Exporting from saved sets downloads a GPX file with selected markers', async ({ freshPage: page }) => {
    // Given a set is saved and its markers are selected
    await saveSet(page, [VALID_MGRS], 'Kilo Set', 'K')
    await page.getByRole('button', { name: /Saved sets/ }).click()
    await page.locator('input[type="checkbox"]').first().check()

    // When the user clicks Export GPX
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export GPX' }).click(),
    ])

    // Then a .gpx file is downloaded
    expect(download.suggestedFilename()).toMatch(/\.gpx$/)
  })
})
