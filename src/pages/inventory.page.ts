import { Page } from '@playwright/test';
import { BaseComponent } from '../../src/pages/components/BaseComponents';

export class InventoryPage extends BaseComponent {
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    protected page: Page;

    async addItemToCart(itemName: string) {
        const item = this.page.getByTestId('inventory-item').filter({ hasText: itemName });
        const button = item.getByRole('button', { name: 'Add to cart' });
        await this.clickElement(button);
    }

    async getCartBadgeCount(): Promise<string> {
        const badge = this.page.getByTestId('shopping-cart-badge');
        await this.waitForElement(badge);
        return (await badge.textContent())!;
    }

    async goToCart() {
        await this.clickElement(this.page.getByTestId('shopping-cart-link'));
    }
}
