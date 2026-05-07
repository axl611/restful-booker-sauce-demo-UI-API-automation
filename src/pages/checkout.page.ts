import { Page } from '@playwright/test';
import { BaseComponent } from '../../src/pages/components/BaseComponents';

export class CheckoutPage extends BaseComponent {
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    protected page: Page;

    async fillForm(firstName: string, lastName: string, postalCode: string) {
        await this.fillField(this.page.getByPlaceholder('First Name'), firstName);
        await this.fillField(this.page.getByPlaceholder('Last Name'), lastName);
        await this.fillField(this.page.getByPlaceholder('Zip/Postal Code'), postalCode);
    }

    async continue() {
        await this.clickElement(this.page.getByRole('button', { name: 'Continue' }));
    }
}
