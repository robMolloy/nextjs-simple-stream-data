import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextApiRequest } from "next";
// import z from "zod";

const apiKey = process.env.ANTHROPIC_API_KEY; // Use environment variable
const anthropic = createAnthropic({ apiKey });

export const maxDuration = 30;
export const runtime = "edge";

// const schema = z.object({
//   messages: z.array(
//     z.object({
//       role: z.enum(["user", "assistant"]),
//       content: z.string(),
//     })
//   ),
// });

async function handler(req: NextApiRequest) {
  console.log(`vercel-stream-text.ts:${/*LL*/ 21}`, {});
  const { messages } = await req.body;
  console.log(`vercel-stream-text.ts:${/*LL*/ 23}`, { messages });

  const result = streamText({
    model: anthropic("claude-3-5-haiku-20241022"),
    messages,
    onChunk: (x) => {
      console.log(`vercel-stream-text.ts:${/*LL*/ 29}`, { x });
    },
  });

  return result.toDataStreamResponse({});
}

export default handler;
