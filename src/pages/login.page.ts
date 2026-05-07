import { Page } from '@playwright/test';
import { BaseComponent } from '../../src/pages/components/BaseComponents';

export class LoginPage extends BaseComponent {
    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    protected page: Page;

    async goto() {
        await this.navigate('/');
    }

    async login(username: string, password: string) {
        await this.fillField(this.page.getByPlaceholder('Username'), username);
        await this.fillField(this.page.getByPlaceholder('Password'), password);
        await this.clickElement(this.page.getByRole('button', { name: 'Login' }));
    }
}
