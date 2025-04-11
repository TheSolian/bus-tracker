/* eslint-disable react-hooks/rules-of-hooks */

import { test as base } from '@playwright/test';
import { ArrivalsPo } from '../page-objects/arrivals.po';
import { StatisticsPo } from '../page-objects/statistics.po';
export const test = base.extend<{
  arrivalsPo: ArrivalsPo;
  statisticsPo: StatisticsPo;
}>({
  arrivalsPo: async ({ page }, use) => await use(new ArrivalsPo(page)),
  statisticsPo: async ({ page }, use) => await use(new StatisticsPo(page)),
});
