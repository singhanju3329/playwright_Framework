import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * TTACart login screen.
 *
 *   const login = new LoginPage(page);
 *   await login.open();
 *   await login.loginAs('standard_user', 'tta_secret');
 */



export class LoginPage extends BasePage {

    static readonly PATH = '/playwright/ttacart/index.html';

    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorBox: Locator;
    private readonly loginCredentialsHint: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly submit: Locator;


    constructor(page: Page) {
        super(page, 'LoginPage');
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorBox = page.locator('[data-test="error"]');
        this.loginCredentialsHint = page.locator('[data-test="login-credentials"]');
        this.username = page.locator('//input[@name="email"]');
        this.password = page.locator('//input[@name="password"]');
        this.submit = page.locator('//button[@id="loginSubmit"]')
    }

    async open(): Promise<void> {
        this.log.info("Open login page");
        await this.goto(LoginPage.PATH);
    }

    async loginAs(username: string, password: string): Promise<void> {
        this.log.info(`loginAs ${username}`);
        await this.el.fill(this.usernameInput, username);
        await this.el.fill(this.passwordInput, password);
        await this.el.click(this.loginButton);
        await expect.poll(async () => (
            this.page.url().includes('/inventory') || await this.errorBox.isVisible()
        )).toBe(true);
    }

    async login(username: string, password: string): promise<void> {
        this.username()
    }
    async waitForLoginButtonHidden(): Promise<void> {
        await this.el.waitForHidden(this.loginButton);
    }

    async expectErrorContains(text: string): Promise<void> {
        await expect(this.errorBox).toBeVisible();
        await expect(this.errorBox).toContainText(text);
    }

}