import { chromium } from "playwright";
import fs from "fs/promises";

async function openGuessr() {
  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.topuniversities.com/university-subject-rankings/computer-science-information-systems",
  );

  const uni = page.locator("body a").filter({
    hasText: "University",
  });

  const title = await page.title();

  console.log(title);
  console.log(uni);
  await browser.close();
}

openGuessr();
