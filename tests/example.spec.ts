import { test, expect } from '@playwright/test';
import fs from 'fs';

test('navigate to SDET INSights -> Playwright Java and save content', async ({ page }) => {
  // Step 1: Go to the website
  await page.goto('https://www.softwaretestautomation.org');

  // Step 2: Hover over "SDET INSights" to reveal the submenu
  await page.getByRole('menuitem', { name: /SDET INSights/i }).hover();

  // Step 3: Click "Playwright Java" from the submenu
  await page.getByRole('menuitem', { name: /Playwright Java/i }).click();

  // Step 4: Wait for the content to load (assuming main content is in an article tag)
  await page.waitForSelector('article', { timeout: 10000 });
  const content = await page.locator('article').innerText();

  // Step 5: Save the content to downloaded_readme.txt
  fs.writeFileSync('downloaded_readme.txt', content);

  // Step 6: Assert file exists
  expect(fs.existsSync('downloaded_readme.txt')).toBeTruthy();
});