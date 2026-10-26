import dotenv from "dotenv";

dotenv.config();

const URL = "https://llm.alem.ai/v1/chat/completions";

export async function callAlemLLM(message) {
  const API_KEY = process.env.ALEM_API_KEY;

  if (!API_KEY) {
    throw new Error("AlemLLM API key is missing.");
  }

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "alemllm",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });
d
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AlemLLM request failed: ${response.status}, ${errorText}`);
  }

  const data = await response.json();

  return data.choices[0].message.content;
}
