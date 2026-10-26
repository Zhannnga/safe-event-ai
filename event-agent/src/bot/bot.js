import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { callAlemLLM } from "../services/alemLLMService.js";
import { recommendEvent } from "../services/recommendationService.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_API_KEY);

await bot.telegram.setMyCommands([]);

bot.command("start", async (ctx) => {
  await ctx.deleteMessage().catch(() => {});

  await ctx.reply(
    "Привет, я Alem Event AI, и я могу порекоммендовать вам идею на будущий ивент Astana Hub!",
    {
      reply_markup: {
        remove_keyboard: true,
      },
    },
  );
});

bot.command("ask", async (ctx) => {
  try {
    const req = ctx.payload;
    if (!req) {
      return ctx.reply(
        "Добавьте ваш запрос после комманды. Например: /ask Ваш Запрос.",
      );
    }
    const answer = await callAlemLLM(req);
    await ctx.reply(answer);
  } catch (error) {
    await ctx.reply("Ой, произошла ошибка.");
  }
});

bot.command("recommend", async (ctx) => {
  try {
    const answer = await recommendEvent();
    await ctx.reply(answer);
  } catch (error) {
    await ctx.reply("Ой, произошла ошибка.");
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
