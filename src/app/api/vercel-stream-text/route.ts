import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_KEY });

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-3-5-haiku-20241022"),
    messages,
    onChunk: (x) => {
      console.log(`route.ts:${/*LL*/ 18}`, { x });
    },
  });

  const rtn = result.toDataStreamResponse({});

  return rtn;
}
