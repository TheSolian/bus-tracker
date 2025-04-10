/* eslint-disable react-hooks/rules-of-hooks */

import { test as base } from '@playwright/test';
import { ArrivalsPo } from '../page-objects/arrivals.po';

export const test = base.extend<{
  arrivalsPo: ArrivalsPo;
}>({
  arrivalsPo: async ({ page }, use) => await use(new ArrivalsPo(page)),
});
