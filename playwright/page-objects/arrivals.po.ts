import { Page } from '@playwright/test';

export class ArrivalsPo {
  constructor(private readonly page: Page) {}

  getArrivalsTable() {
    return this.page.getByTestId('arrivals-table');
  }

  getRegisterArrivalButton() {
    return this.page.getByTestId('register-arrival-button');
  }
}
