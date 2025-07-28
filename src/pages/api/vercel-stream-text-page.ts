import { NextApiRequest, NextApiResponse } from "next";

const createRandomInteger = () => Math.floor(Math.random() * 9) + 1;
const createRandomIntegerArray = (length: number) =>
  [...Array(length)].map(() => createRandomInteger());

const delay = async (x: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), x);
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const qty = JSON.parse(req.body).qty;
  console.log(`vercel-stream-text-page.ts:${/*LL*/ 18}`, { qty });
  const randomIntegers = createRandomIntegerArray(qty);

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    for (const randomInteger of randomIntegers) {
      console.log(`vercel-stream-text-page.ts:${/*LL*/ 27}`, { randomInteger });
      await delay(5);

      res.write(JSON.stringify({ message: randomInteger }));
      res?.flushHeaders();
      if ("flush" in res && typeof res.flush === "function") res.flush();
    }

    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Stream failed" });
  }
}
