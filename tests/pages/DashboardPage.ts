import { type Page, type Locator } from '@playwright/test'

export class DashboardPage {
  readonly page: Page
  readonly role: Locator
  readonly logoutButton: Locator
  readonly table: Locator
  readonly rows: Locator
  readonly nextPage: Locator
  readonly prevPage: Locator
  readonly pageIndicator: Locator
  readonly exportButton: Locator

  constructor(page: Page) {
    this.page = page
    this.role = page.getByTestId('user-role')
    this.logoutButton = page.getByTestId('logout-button')
    this.table = page.getByTestId('telemetry-table')
    this.rows = page.getByTestId('telemetry-row')
    this.nextPage = page.getByTestId('next-page')
    this.prevPage = page.getByTestId('prev-page')
    this.pageIndicator = page.getByTestId('page-indicator')
    this.exportButton = page.getByTestId('export-csv')
  }

  async logout() {
    await this.logoutButton.click()
  }

  async goToNextPage() {
    await this.nextPage.click()
  }
}