import { chromium } from "playwright";
import fs from "fs/promises";

function getValueAfterLabel(text, label) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const index = lines.findIndex(
    (line) => line.toLowerCase() === label.toLowerCase(),
  );

  if (index === -1) {
    return null;
  }

  return lines[index + 1] || null;
}

const events = [];

async function main() {
  const fileText = await fs.readFile("event-links.json", "utf8");
  const links = JSON.parse(fileText);

  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  for (let i = 0; i < links.length; i++) {
    const firstLink = links[i];

    await page.goto(firstLink, {
      waitUntil: "domcontentloaded",
    });

    const title = await page.locator("h1").first().innerText();
    const raw_text = await page.locator("main").innerText();

    const eventData = {
      source_url: firstLink,

      title_original: title.trim(),
      title_normalized: null,

      area: getValueAfterLabel(raw_text, "Area"),
      format: getValueAfterLabel(raw_text, "Format"),
      region: getValueAfterLabel(raw_text, "Region"),
      address: getValueAfterLabel(raw_text, "Address"),
      start_date: getValueAfterLabel(raw_text, "Start date"),
      end_date: getValueAfterLabel(raw_text, "End date"),

      raw_text: raw_text.trim(),
    };
    events.push(eventData);
  }
  await fs.writeFile("events-raw.json", JSON.stringify(events, null, 2));

  await browser.close();
}

main();
