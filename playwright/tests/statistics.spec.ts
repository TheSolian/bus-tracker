import { expect } from '@playwright/test';
import { test } from '../utils/test.util';

test.describe('Statistics', () => {
  test('should display initial empty state', async ({ page, statisticsPo }) => {
    await page.goto('/statistics');
    expect(statisticsPo.getEmptyState()).toBeVisible();
  });

  test('should display bus selection dropdown', async ({
    page,
    statisticsPo,
  }) => {
    await page.goto('/statistics');

    expect(statisticsPo.getBusSelect()).toBeVisible();
  });

  test('should display schedule selection dropdown', async ({
    page,
    statisticsPo,
  }) => {
    await page.goto('/statistics');

    expect(statisticsPo.getScheduleSelect()).toBeVisible();
    expect(statisticsPo.getScheduleSelect()).toBeDisabled();
  });

  test('should enable schedule selection after bus selection', async ({
    page,
    statisticsPo,
  }) => {
    await page.goto('/statistics');

    await statisticsPo.getBusSelect().click();
    await page.getByRole('option', { name: '215' }).click();

    await expect(statisticsPo.getScheduleSelect()).toBeEnabled();
  });

  test('should update URL parameters when selecting bus and schedule', async ({
    page,
    statisticsPo,
  }) => {
    await page.goto('/statistics');

    await statisticsPo.getBusSelect().click();
    await page.getByRole('option', { name: '215' }).click();

    await statisticsPo.waitForBusSelection();
    await statisticsPo.waitForScheduleSelection();

    expect(page.url()).toContain('bus=215');
  });
});
