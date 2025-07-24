import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import pdf from 'pdfkit';

test('download Playwright intro instructions as README.md', async ({ page }) => {
  // Navigate to the Playwright intro docs page
  await page.goto('https://playwright.dev/docs/intro');

  // Get the main instructions content (from the main article)
  const instructions = await page.locator('article').innerText();

  // Save the instructions to README.md
  fs.writeFileSync('README.md', instructions);

  // Assert the file was created
  expect(fs.existsSync('README.md')).toBeTruthy();
});

test('download homepage content of softwaretestautomation.org (remove first 4 lines)', async ({ page }) => {
  await page.goto('https://www.softwaretestautomation.org');
  const content = await page.locator('body').innerText();

  // Remove the first 4 lines
  const cleanedContent = content.split('\n').slice(4).join('\n');

  fs.writeFileSync('downloaded_homepage.txt', cleanedContent);
  expect(fs.existsSync('downloaded_homepage.txt')).toBeTruthy();
});

test('click UI Automation link, then first Selenium link, and save content as PDF (without first 3 lines)', async ({ page }) => {
  await page.goto('https://www.softwaretestautomation.org');

  // Click on the UI Automation link
  await page.getByText('🖥️ Web UI Automation — From Legacy to Modern Web Apps', { exact: true }).click();

  // Click on the first link containing 'selenium'
  await page.getByText(/Selenium WebDriver/i).first().click();

  // Get the content of the resulting page
  let seleniumContent = await page.locator('body').innerText();

  // Remove the first 3 lines
  seleniumContent = seleniumContent.split('\n').slice(3).join('\n');

  // Save content as PDF
  const pdfDoc = new pdf();
  const pdfPath = path.join(process.cwd(), 'master_selenium.pdf');
  const writeStream = fs.createWriteStream(pdfPath);
  pdfDoc.pipe(writeStream);
  pdfDoc.fontSize(12).text(seleniumContent);
  pdfDoc.end();

  // Wait for the PDF to be fully written
  await new Promise<void>(resolve => writeStream.on('finish', () => resolve()));

  expect(fs.existsSync(pdfPath)).toBeTruthy();
});