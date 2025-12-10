import { test, expect } from '@playwright/test';


test('student registration OTP flow (real backend)', async ({ page }) => {
  const otpCode = process.env.TEST_OTP_CODE;
  if (!otpCode || otpCode.length !== 6) {
    test.fail(true, 'Set TEST_OTP_CODE=###### to run against the real backend');
  }

  await page.goto('http://localhost:5173/register/student', { waitUntil: 'networkidle' });

  await page.getByPlaceholder('Full Name').fill('Test Student');
  await page.getByPlaceholder('Email').fill(`student+${Date.now()}@example.com`);
  await page.getByPlaceholder('Phone Number').fill('9998887777');
  await page.getByPlaceholder('Password').fill('P@ssw0rd!');

  await page.getByRole('button', { name: 'Send OTP to Email' }).click();

  const otpInputs = page.locator('input[maxlength="1"]');
  await expect(otpInputs).toHaveCount(6);

  for (let i = 0; i < 6; i++) {
    await otpInputs.nth(i).fill(otpCode[i]);
  }

  await page.getByRole('button', { name: 'Verify & Create Account' }).click();

  await page.waitForURL('http://localhost:5173/login', { timeout: 20000 });
  await expect(page).toHaveURL('http://localhost:5173/login');
});

