import { test, expect, saveSet, parseCoords, VALID_MGRS, VALID_MGRS_2 } from './fixtures'

test.describe('Saving and managing marker sets', () => {
  test('Saving a set shows a confirmation message and switches context', async ({ freshPage: page }) => {
    // Given valid coordinates are parsed
    // When the user saves them with a name and prefix
    await saveSet(page, [VALID_MGRS], 'Alpha Route', 'TGT')

    // Then a saved confirmation message appears
    await expect(page.getByText('Saved — view in Saved sets')).toBeVisible()
  })

  test('Saved set appears in the Saved sets tab', async ({ freshPage: page }) => {
    // Given a set has been saved
    await saveSet(page, [VALID_MGRS], 'Alpha Route', 'TGT')

    // When the user switches to the Saved sets tab
    await page.getByRole('button', { name: /Saved sets/ }).click()

    // Then the set name is visible
    await expect(page.getByText('Alpha Route')).toBeVisible()
  })

  test('Saved sets tab shows the marker count', async ({ freshPage: page }) => {
    // Given two valid coordinates are saved as one set
    await saveSet(page, [VALID_MGRS, VALID_MGRS_2], 'Bravo Route', 'WPT')

    // When the user switches to the Saved sets tab
    await page.getByRole('button', { name: /Saved sets/ }).click()

    // Then the set shows 2 markers
    await expect(page.getByText('2 markers')).toBeVisible()
  })

  test('Saved sets tab count in the tab label updates after saving', async ({ freshPage: page }) => {
    // Given no sets exist
    await expect(page.getByRole('button', { name: 'Saved sets' })).toBeVisible()

    // When a set is saved
    await saveSet(page, [VALID_MGRS], 'Charlie', 'C')

    // Then the tab label shows (1)
    await expect(page.getByRole('button', { name: /Saved sets \(1\)/ })).toBeVisible()
  })

  test('Saved sets persist after a page reload', async ({ freshPage: page }) => {
    // Given a set has been saved
    await saveSet(page, [VALID_MGRS], 'Persistent Set', 'P')

    // When the page is reloaded
    await page.reload()

    // Then the set is still visible in the Saved sets tab
    await page.getByRole('button', { name: /Saved sets/ }).click()
    await expect(page.getByText('Persistent Set')).toBeVisible()
  })

  test('Expanding a set reveals its marker rows', async ({ freshPage: page }) => {
    // Given a set with one marker is saved
    await saveSet(page, [VALID_MGRS], 'Delta', 'TGT')
    await page.getByRole('button', { name: /Saved sets/ }).click()

    // When the user clicks the set row to expand it
    await page.getByText('Delta').click()

    // Then marker rows become visible (delete marker button appears)
    await expect(page.getByRole('button', { name: 'Delete marker' })).toBeVisible()
  })

  test('Deleting a set requires confirmation and removes it from the list', async ({ freshPage: page }) => {
    // Given a set exists in the list
    await saveSet(page, [VALID_MGRS], 'Echo Set', 'E')
    await page.getByRole('button', { name: /Saved sets/ }).click()
    await expect(page.getByText('Echo Set')).toBeVisible()

    // When the user clicks the delete button on the set
    await page.getByRole('button', { name: 'Delete set' }).click()

    // Then a confirmation modal appears
    await expect(page.getByText(/cannot be undone/i)).toBeVisible()

    // When the user confirms
    await page.getByRole('button', { name: 'Delete', exact: true }).click()

    // Then the set is gone
    await expect(page.getByText('Echo Set')).not.toBeVisible()
    await expect(page.getByText('No saved sets yet')).toBeVisible()
  })

  test('Cancelling deletion keeps the set in the list', async ({ freshPage: page }) => {
    // Given a set exists
    await saveSet(page, [VALID_MGRS], 'Foxtrot Set', 'F')
    await page.getByRole('button', { name: /Saved sets/ }).click()

    // When the user triggers delete but then cancels
    await page.getByRole('button', { name: 'Delete set' }).click()
    await page.getByRole('button', { name: 'Cancel' }).click()

    // Then the set is still visible
    await expect(page.getByText('Foxtrot Set')).toBeVisible()
  })

  test('Deleting a single marker leaves the set with one fewer marker', async ({ freshPage: page }) => {
    // Given a set with two markers is saved and expanded
    await saveSet(page, [VALID_MGRS, VALID_MGRS_2], 'Golf Set', 'G')
    await page.getByRole('button', { name: /Saved sets/ }).click()
    await page.getByText('Golf Set').click()

    // When the user deletes the first marker and confirms
    await page.getByRole('button', { name: 'Delete marker' }).first().click()
    await page.getByRole('button', { name: 'Delete', exact: true }).click()

    // Then the set now shows 1 marker
    await expect(page.getByText('1 marker')).toBeVisible()
  })

  test('Empty sets tab shows placeholder text', async ({ freshPage: page }) => {
    // Given no sets exist
    // When the user navigates to the Saved sets tab
    await page.getByRole('button', { name: /Saved sets/ }).click()

    // Then a helpful empty state message is shown
    await expect(page.getByText('No saved sets yet')).toBeVisible()
  })
})
