import { NextApiRequest, NextApiResponse } from "next";

const createRandomNumber = () => Math.floor(Math.random() * 1000) + 1;
const createRandomNumberArray = (length: number) =>
  [...Array(length)].map(() => createRandomNumber());

const delay = async (x: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), x);
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set headers for streaming
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const randomNumbers = createRandomNumberArray(10);

  try {
    for (const randomNumber of randomNumbers) {
      await delay(1000);
      const data = JSON.stringify({
        number: randomNumber,
        timestamp: new Date().toISOString(),
      });

      res.write(`data: ${data}\n\n`);
      res?.flushHeaders();
      if ("flush" in res && typeof res.flush === "function") res.flush();
    }

    // End the response
    res.end();
  } catch (error) {
    console.error(`hello.ts:${/*LL*/ 37}`, error);
    res.status(500).json({ error: "Stream failed" });
    res.end();
  }
}
