import { Page } from '@playwright/test';

export class StatisticsPo {
  constructor(private readonly page: Page) {}

  async waitForBusSelection() {
    await this.page.waitForURL('**/statistics?bus=*');
  }

  async waitForScheduleSelection() {
    await this.page.waitForURL('**/statistics?bus=*&schedule=*');
  }

  getEmptyState() {
    return this.page.getByTestId('empty-state');
  }

  getNoDataState() {
    return this.page.getByTestId('no-data-state');
  }

  getBusSelect() {
    return this.page.getByTestId('bus-select');
  }

  getScheduleSelect() {
    return this.page.getByTestId('schedule-select');
  }
}
