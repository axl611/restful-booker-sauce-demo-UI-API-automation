import { Page } from '@playwright/test';
import { BaseComponent } from '../../src/pages/components/BaseComponents';

export class CheckoutCompletePage extends BaseComponent {
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    protected page: Page;

    async finish() {
        await this.clickElement(this.page.getByRole('button', { name: 'Finish' }));
    }

    async getThankYouMessage(): Promise<string> {
        const header = this.page.getByTestId('complete-header');
        return (await this.getText(header));
    }
}
