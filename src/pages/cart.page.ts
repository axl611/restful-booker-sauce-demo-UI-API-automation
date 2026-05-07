import { Page } from '@playwright/test';
import { BaseComponent } from '../../src/pages/components/BaseComponents';

export class CartPage extends BaseComponent {
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    protected page: Page;

    async getItemNames(): Promise<string[]> {
        const items = this.page.getByTestId('inventory-item-name');
        await this.waitForElement(items.first());
        return await items.allTextContents();
    }

    async checkout() {
        await this.clickElement(this.page.getByRole('button', { name: 'Checkout' }));
    }
}
