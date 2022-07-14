import { Browser, Page } from 'puppeteer';
import { IPFS_DOMAINS } from './utils/constant';
import { createBrowser, takeScreenshot } from "./utils/puppeteer";
import { ONE_MINUTE, timeOut } from './utils/time';

jest.setTimeout(ONE_MINUTE * 10);

describe('Check health of domains', () => {
    let testBrowser: Browser | undefined;
    let testPage: Page | undefined;

    beforeAll(async () => {
      const { browser, page } = await createBrowser();

      testBrowser = browser;
      testPage = page;

    })

    afterAll(async () => await testBrowser?.close());

    it.each(IPFS_DOMAINS)('check %s domain', async (domain, projectName, connectWalletId) => {
      if (testPage) {
        try {
          await testPage.goto(domain, {
            timeout: ONE_MINUTE,
          });

          await timeOut(ONE_MINUTE / 4);

          await testPage.waitForSelector(`#${connectWalletId}`, {
            timeout: ONE_MINUTE,
          });

          await takeScreenshot(testPage, `CheckDomain_${projectName}`);
        } catch (error) {
          console.error(`Check ${domain} domain: `, error);
          await takeScreenshot(testPage, `CheckDomainError_${projectName}`);

          // eslint-disable-next-line jest/no-conditional-expect
          expect(false).toBe(true);
        }
      } else {
        throw new Error('page is not found');
      }
    });

});
