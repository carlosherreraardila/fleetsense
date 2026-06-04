import { type Page, type Locator } from '@playwright/test'

export class DashboardPage {
  readonly page: Page
  readonly role: Locator
  readonly logoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.role = page.getByTestId('user-role')
    this.logoutButton = page.getByTestId('logout-button')
  }

  async logout() {
    await this.logoutButton.click()
  }
}