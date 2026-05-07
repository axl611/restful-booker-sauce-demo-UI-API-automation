import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { InventoryPage } from '../../src/pages/inventory.page';
import { CartPage } from '../../src/pages/cart.page';
import { CheckoutPage } from '../../src/pages/checkout.page';
import { CheckoutCompletePage } from '../../src/pages/checkout-complete.page';
import { users, checkoutDetails, inventoryItems } from '../../src/data/users';

test.describe('SauceDemo E-Commerce Flow', () => {

    const items = [inventoryItems.backpack, inventoryItems.bikeLight];

    test('should complete full e-commerce flow: login → add items → cart → checkout → order complete', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const completePage = new CheckoutCompletePage(page);

        // Given: User is on login page
        await loginPage.goto();

        // When: User logs in with valid credentials
        await loginPage.login(users.standard.username, users.standard.password);

        // Then: User is on inventory page
        await expect(page).toHaveURL(/inventory.html$/);

        // When: User adds two distinct items to cart
        for (const item of items) {
            await inventoryPage.addItemToCart(item);
        }

        // Then: Cart badge shows 2 items
        await expect(inventoryPage.getCartBadgeCount()).resolves.toBe('2');

        // When: User navigates to cart
        await inventoryPage.goToCart();

        // Then: Cart contains the correct items
        await expect(page).toHaveURL(/cart.html$/);
        const cartItems = await cartPage.getItemNames();
        expect(cartItems).toHaveLength(2);
        expect(cartItems).toContain(inventoryItems.backpack);
        expect(cartItems).toContain(inventoryItems.bikeLight);

        // When: User proceeds to checkout and fills form
        await cartPage.checkout();
        await checkoutPage.fillForm(checkoutDetails.firstName, checkoutDetails.lastName, checkoutDetails.postalCode);
        await checkoutPage.continue();

        // Then: User sees order overview and completes purchase
        await completePage.finish();

        // Then: Thank you message is displayed
        expect(await completePage.getThankYouMessage()).toBe('Thank you for your order!');
    });
});
