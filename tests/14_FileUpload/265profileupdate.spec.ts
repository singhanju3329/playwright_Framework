import { test, Page } from '@playwright/test'
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
// Credentials live in .env (gitignored) — never hardcode them in a public repo.
const TTA_EMAIL = process.env.TTA_EMAIL ?? '';
const TTA_PASSWORD = process.env.TTA_PASSWORD ?? '';

const URL = 'https://app.thetestingacademy.com/login'
test.describe('fileUpload', () => {

    test('profileupdate', async ({ page }) => {

        await page.goto(URL)
        await page.locator('//input[@id="identifier-field"]').fill(TTA_EMAIL)
        await page.locator('//input[@id="password-field"]').fill(TTA_PASSWORD)
        await page.getByText('Continue', { exact: true }).click();
        await page.pause();
        await page.getByText('Continue', { exact: true }).click();
        await page.locator('//span[normalize-space()="Settings"]').click();
        await page.locator('//span[normalize-space()="Upload Photo"]').click();
        const filePath = path.join(__dirname, 'image.png');
        console.log(filePath);
        await page.locator("#file-upload").setInputFiles([filePath]);
        await page.getByRole("button", { name: "Upload" }).click();




    })








})