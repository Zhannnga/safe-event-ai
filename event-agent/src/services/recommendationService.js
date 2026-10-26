import { analyzeEvents } from "./analyzeEvents.js";
import { callAlemLLM } from "./alemLLMService.js";
import fs from "fs/promises";

export async function recommendEvent() {
  const text = await fs.readFile("speakerCandidates.json", "utf8");
  const speakers = JSON.parse(text);
  const compactTrends = analyzeEvents();

  const message = `
You are an event strategy assistant for Astana Hub.

Your task is to recommend ONE high-quality future event that can increase engagement on astanahub.com and the Astana Hub mobile app.

Use the event trend analysis and speaker candidate list below.

Event trends:
${JSON.stringify(compactTrends, null, 2)}

Speaker candidates:
${JSON.stringify(speakers, null, 2)}

Rules:
- Do NOT mention predicted attendance.
- Use "engagement potential", not "attendance prediction".
- Recommend only speaker candidates from the provided speaker list.
- Do not invent speaker names, companies, titles, or achievements.
- If no speaker fits perfectly, say "No exact speaker match from provided list" and suggest the closest candidate.
- Make the recommendation specific, practical, and detailed.
- The event should feel realistic for Astana Hub / alem.ai / regional IT hubs.
- Focus on increasing portal/mobile app activity through registration, reminders, check-ins, voting, feedback, saved materials, and post-event follow-up.

Return a Telegram-ready message, not JSON.

Use this exact format:

🎯 Event Recommendation

📌 Title:
...

🏷 Event type:
...

💻 Format:
...

📍 Suggested region / venue:
...

👥 Target audience:
...

🧠 Why this event fits the trends:
...

🎤 Recommended speakers:
1. Name — role/company
   Why: ...
2. Name — role/company
   Why: ...

🗓 Suggested agenda:
1. ...
2. ...
3. ...
4. ...

📲 Portal / mobile app activation plan:
- Before event: ...
- During event: ...
- After event: ...

📊 Engagement potential score:
.../10

⚠️ Notes:
Mention that speakers are recommended candidates, not confirmed participants.
Keep the whole answer concise but detailed enough for a mentor demo.
`;

  const response = await callAlemLLM(message);
  return response;
}

recommendEvent();
