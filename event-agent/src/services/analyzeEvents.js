import fs from "fs/promises";

function getTopItems(frequencyObject, limit) {
  if (!frequencyObject) return {};

  return Object.fromEntries(
    Object.entries(frequencyObject)
      .filter(([key]) => key !== "null" && key !== "Unknown" && key !== "")
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit),
  );
}

export async function analyzeEvents() {
  const textFile = await fs.readFile("events.json", "utf8");
  const events = JSON.parse(textFile);

  const fields = [
    {
      field: "areas",
      label: "AreaFrequency",
    },
    {
      field: "format",
      label: "FormatFrequency",
    },
    {
      field: "topics",
      label: "TopicFrequency",
    },
    {
      field: "event_type",
      label: "EventTypeFrequency",
    },
    {
      field: "region",
      label: "RegionFrequency",
    },
    {
      field: "target_audience",
      label: "TargetAudienceFrequency",
    },
    {
      field: "technologies",
      label: "TechnologiesFrequency",
    },
  ];

  const trends = {};

  for (let i = 0; i < fields.length; i++) {
    let count = 0;
    let holder = [];
    let temp_field = fields[i].field;
    for (let j = 0; j < events.length; j++) {
      if (Array.isArray(events[j][temp_field])) {
        holder.push(...events[j][temp_field]);
        count = holder.reduce((accumulator, currentItem) => {
          accumulator[currentItem] = (accumulator[currentItem] || 0) + 1;
          return accumulator;
        }, {});
      } else {
        holder.push(events[j][temp_field]);
        count = holder.reduce((accumulator, currentItem) => {
          accumulator[currentItem] = (accumulator[currentItem] || 0) + 1;
          return accumulator;
        }, {});
      }
    }
    trends[fields[i].label] = count;
  }
  const compactTrends = {
    topAreas: getTopItems(trends.AreaFrequency, 5),
    formats: trends.FormatFrequency,
    topTopics: getTopItems(trends.TopicFrequency, 10),
    topEventTypes: getTopItems(trends.EventTypeFrequency, 5),
    topRegions: getTopItems(trends.RegionFrequency, 5),
    topTargetAudiences: getTopItems(trends.TargetAudienceFrequency, 8),
    topTechnologies: getTopItems(trends.TechnologiesFrequency, 8),
  };

  return compactTrends;
}

analyzeEvents();
