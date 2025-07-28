import { NextApiRequest, NextApiResponse } from "next";
import Anthropic from "@anthropic-ai/sdk";
import { v4 as uuid } from "uuid";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_KEY,
  dangerouslyAllowBrowser: true,
});

const delay = async (x: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), x);
  });
};

const createAnthropicMessage = (p: {
  role: "user" | "assistant";
  content: { type: "text"; text: string }[];
}) => {
  return { id: uuid(), role: p.role, content: p.content };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const prompt = JSON.parse(req.body).prompt;
  const responseChunks = [] as string[];

  const stream = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 5000,
    messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    stream: true,
  });

  for await (const message of stream) {
    if (message.type === "content_block_delta" && "text" in message.delta) {
      await delay(10);
      responseChunks.push(message.delta.text);
      res.write(JSON.stringify({ message: message.delta.text }));
      res?.flushHeaders();
      if ("flush" in res && typeof res.flush === "function") res.flush();
    }
  }

  console.log(`call-anthropic.ts:${/*LL*/ 55}`, responseChunks.join(""));

  res.end();
}
