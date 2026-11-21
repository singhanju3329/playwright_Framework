import { expect, test, type Page } from '@playwright/test';
import { DataGenerator } from '../../utils/DataGenerator';
import { envOr } from '../../config/env';

const bankUrl = 'https://app.thetestingacademy.com/playwright/tta-bank/';

// Public demo account shown on the TTA Bank sign-in page. Override in .env if needed.
const email = envOr('TTA_BANK_EMAIL', 'priya.tester@ttabank.in');
const password = envOr('TTA_BANK_PASSWORD', 'Test@1234');

async function signIn(page: Page): Promise<void> {
    await page.goto(bankUrl);
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('TTA Bank', () => {
    test('Login with valid credentials', async ({ page }) => {
        await signIn(page);
        await expect(page).toHaveTitle('TTA Bank - Dashboard');
    });

    test('debit a transfer from the TTA Bank account', async ({ page }) => {
        await signIn(page);

        const accountBalance = page.getByRole('region', { name: 'Account balance' });
        await expect(accountBalance.getByText('₹50,000', { exact: true })).toBeVisible();

        await page.getByRole('main').getByRole('link', { name: 'Send money' }).click();
        await page.getByRole('option', { name: 'Pay Meera Iyer' }).click();
        await page.getByLabel('Amount in rupees').fill('5000');
        await page.getByLabel('Expense category').selectOption({ label: 'Travel' });
        await page.getByLabel('Transfer note').fill(DataGenerator.transferNote());

        await page.getByRole('button', { name: 'Review transfer' }).click();

        const confirmPopup = page.getByRole('dialog', { name: 'Confirm transfer' });
        await expect(confirmPopup).toContainText('Meera Iyer');
        await expect(confirmPopup).toContainText('₹5,000');
        await expect(confirmPopup).toContainText('Travel');

        await confirmPopup.getByRole('button', { name: 'Confirm and send' }).click();

        await page.getByRole('link', { name: 'Dashboard' }).click();
        await expect(accountBalance.getByText('₹45,000', { exact: true })).toBeVisible();

        const debitRow = page.getByRole('table', { name: 'Recent transactions table' })
            .getByRole('row')
            .filter({ hasText: 'Meera Iyer' });

        await expect(debitRow).toContainText('Travel');
        await expect(debitRow).toContainText('debit');
        await expect(debitRow).toContainText('-₹5,000');
    });

});
