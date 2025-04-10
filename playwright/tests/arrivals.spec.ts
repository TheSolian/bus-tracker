import { expect } from '@playwright/test';
import { test } from '../utils/test.util';

test.describe('Arrivals', () => {
  test('should verify if the page name is Bus Tracker', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bus Tracker/);
  });

  test('should verify if the arrivals table is visible', async ({
    page,
    arrivalsPo,
  }) => {
    await page.goto('/');

    await expect(arrivalsPo.getArrivalsTable()).toBeVisible();
    await expect(arrivalsPo.getRegisterArrivalButton()).toBeVisible();
  });
});
