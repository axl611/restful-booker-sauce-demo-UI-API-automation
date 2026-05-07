import { Page, Locator } from '@playwright/test';

export class BaseComponent {
    
    constructor(protected page: Page) {

    }

    protected async waitForElement(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });

    }

    protected async clickElement(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.click();

    }

    protected async fillField(locator: Locator, value: string): Promise<void> {
        await this.waitForElement(locator);
        await locator.fill(value);

    }

    protected async getText(locator: Locator): Promise<string> {
        await this.waitForElement(locator);
        return await locator.innerText();
        
    }

    protected async isVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }

    protected async navigate(path: string): Promise<void> {
        await this.page.goto(path);
    }

}