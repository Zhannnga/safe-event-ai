import { chromium } from "playwright";
import fs from "fs/promises";

const LIST_URL = "https://astanahub.com/en/event/";

async function main() {
  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto(LIST_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForSelector("article", { timeout: 15000 });
  await page.waitForTimeout(2000);

  const articlesCount = await page.locator("article").count();

  console.log("Found articles:", articlesCount);

  const eventUrls = [];

  for (let i = 0; i < articlesCount; i++) {
    try {
      console.log(`Clicking article ${i + 1}/${articlesCount}`);

      const article = page.locator("article").nth(i);

      await article.scrollIntoViewIfNeeded();

      const previousUrl = page.url();

      await article.click();

      await page.waitForFunction(
        (oldUrl) => window.location.href !== oldUrl,
        previousUrl,
        { timeout: 10000 },
      );

      await page
        .waitForLoadState("domcontentloaded", {
          timeout: 15000,
        })
        .catch(() => {});

      const currentUrl = page.url();

      console.log(currentUrl);

      if (currentUrl.includes("/event/") && currentUrl !== LIST_URL) {
        eventUrls.push(currentUrl);
      }

      await page
        .goBack({
          waitUntil: "domcontentloaded",
          timeout: 15000,
        })
        .catch(async () => {
          await page.goto(LIST_URL, {
            waitUntil: "domcontentloaded",
          });
        });

      await page.waitForSelector("article", { timeout: 15000 });
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log(`Skipped article ${i + 1}:`, error.message);

      await page.goto(LIST_URL, {
        waitUntil: "domcontentloaded",
      });

      await page.waitForSelector("article", { timeout: 15000 });
      await page.waitForTimeout(1000);
    }
  }

  const uniqueUrls = [...new Set(eventUrls)];

  await fs.writeFile("event-links.json", JSON.stringify(uniqueUrls, null, 2));

  console.log("Saved URLs:", uniqueUrls.length);

  await browser.close();
}

main();
