const { test, expect } = require('@playwright/test');
const dayjs = require('dayjs');

test('Search for a hotel in chicago for the next 5 days', async ({ page }) => {
  await page.goto('https://www.booking.com');

  // Try to close the pop-up if it appears
  const crossPopUpToSigIn = page.locator('[aria-label="Dismiss sign-in info."]');
  if (await crossPopUpToSigIn.count() > 0 && await crossPopUpToSigIn.isVisible().catch(() => false)) {
    await crossPopUpToSigIn.click();
  }

  // Enter the destination
  await page.fill('[aria-label="Where are you going?"]', 'Chicago');

  // Open calendar widget and set dates
  await page.click('[data-testid="searchbox-dates-container"]');

  // Verify that calendar appears
  await expect(page.locator('[data-testid="datepicker-tabs"]')).toBeVisible();

  let [today, fiveDaysAfter] = getFormattedDates();
  await page.locator(today).click();
  await page.locator(fiveDaysAfter).click();

  await page.click('button[type="submit"]', { force: true });
});

function getFormattedDates() {
  const tomorrow = dayjs().add(1, 'day');
  const inFiveDays = dayjs().add(6, 'day');
  const formattedTomorrow = tomorrow.format('YYYY-MM-DD');
  const formattedInFiveDays = inFiveDays.format('YYYY-MM-DD');
  return [`[data-date="${formattedTomorrow}"]`, `[data-date="${formattedInFiveDays}"]`];
}