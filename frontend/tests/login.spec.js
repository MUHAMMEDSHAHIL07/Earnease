import { test, expect } from '@playwright/test';

test('Earnease full login functionality works', async ({ page }) => {

  // 1️⃣ Open login page (wait for full load)
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

  // 2️⃣ Check URL AFTER the page is loaded
  await expect(page).toHaveURL('http://localhost:5173/login');

  await page.fill('input[name="email"]', 'nike@gmail.com');

  await page.fill('input[name="password"]', '123456');

  await page.click('button[type="submit"]');

  await page.waitForURL('http://localhost:5173/employer/dashboard', { timeout: 15000 });

  await expect(page).toHaveURL('http://localhost:5173/employer/dashboard');
});
