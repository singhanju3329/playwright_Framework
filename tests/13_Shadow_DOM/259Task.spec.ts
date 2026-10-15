import { FrameLocator, expect, test } from '@playwright/test'

const URL = 'https://selectorshub.com/xpath-practice-page/'
test.describe('shadow and iframe ', () => {

    test('Shadowdom', async ({ page }) => {
        await page.goto(URL)
        await page.locator('#kils').fill('anju')
        await page.locator('#pizza').fill('cheese pizza')
        //await page.locator('#training').fill('making pizza')
        //await page.locator('#pwd').fill('test@123')
        await expect(page.locator('#kils')).toHaveValue('anju')
        await expect(page.locator('#pizza')).toHaveValue('cheese pizza')
    })

    test('iframe', async ({ page }) => {
        await page.goto(URL)
        // The link opens a new page: https://selectorshub.com/iframe-in-shadow-dom/
        await page.pause();
        await page.locator('//a[contains(text(),"Click to practice iframe inside shadow dom scenario")]').click()
        await page.waitForURL('**/iframe-in-shadow-dom/')
        await page.pause();
        // Shadow DOM input on the new page (CSS pierces shadow roots automatically)
        await page.locator('#kils').fill('anju')
        await page.pause();
        // iframe #pact1 lives inside the shadow root
        const frame1: FrameLocator = page.frameLocator('#pact1')
        await frame1.locator('#jex').fill('anju crush')
        await page.pause();
        // nested iframe #pact3 lives inside #pact1
        const frame2: FrameLocator = frame1.frameLocator('#pact3')
        await frame2.locator('#glaf').fill('destiny')
        await page.pause();
        await expect(frame1.locator('#jex')).toHaveValue('anju crush')
        await expect(frame2.locator('#glaf')).toHaveValue('destiny')
        await page.pause();
    })

})
