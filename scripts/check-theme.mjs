/** Browser regression checks. Install Playwright separately, then run:
 * PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/check-theme.mjs [URL]
 * Defaults to the local Vite dev server. No production data is changed.
 */
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const url = process.argv[2] || 'http://127.0.0.1:5176';
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const context = await browser.newContext({ viewport, reducedMotion });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      await page.waitForTimeout(1500);
      for (const dark of [true, false, true]) {
        const result = await page.evaluate(async () => {
          const buttons = [...document.querySelectorAll('button[aria-label^="Switch to"]')];
          buttons.find(button => button.getBoundingClientRect().width > 0).click();
          await new Promise(requestAnimationFrame);
          const transitions = document.getAnimations().filter(animation => animation instanceof CSSTransition);
          return {
            transitions: transitions.length,
            dark: document.documentElement.classList.contains('dark'),
            stored: localStorage.getItem('theme'),
            labels: buttons.map(button => button.getAttribute('aria-label'))
          };
        });
        assert.equal(result.dark, dark);
        assert.equal(result.stored, dark ? 'dark' : 'light');
        assert.ok(result.labels.every(label => label === `Switch to ${dark ? 'light' : 'dark'} mode`));
        assert.equal(result.transitions, 0, 'Theme switches must not start document-wide CSS transitions');
        await page.waitForFunction(() => !document.documentElement.classList.contains('theme-changing'));
        assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation instanceof CSSTransition && /color|shadow/.test(animation.transitionProperty)).length), 0, 'Restoring hover transitions must not restart palette transitions');
      }
      await page.reload();
      await page.waitForTimeout(300);
      assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), true);
      // Rapid clicks must leave the latest state and release transition suppression.
      await page.evaluate(() => {
        const button = [...document.querySelectorAll('button[aria-label^="Switch to"]')].find(b => b.getBoundingClientRect().width);
        button.click(); button.click(); button.click();
      });
      await page.waitForTimeout(150);
      assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), false);
      assert.equal(await page.evaluate(() => document.documentElement.classList.contains('theme-changing')), false);
      // Storage failures must not break either theme control.
      await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('Storage denied'); }; });
      await page.locator('button[aria-label="Switch to dark mode"]:visible').click();
      assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), true);
      await page.waitForTimeout(150);
      if (reducedMotion === 'no-preference') {
        assert.notEqual(await page.locator('button[aria-label^="Switch to"]:visible').evaluate(button => getComputedStyle(button).transitionDuration), '0s', 'Hover transitions must be restored');
      }
      assert.deepEqual(errors, []);
      console.log(`PASS ${viewport.width}px ${reducedMotion}: instant toggle, controls, persistence, rapid clicks, blocked storage, restored transitions`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
