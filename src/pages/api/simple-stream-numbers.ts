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
  _req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  console.log(`simple-stream-numbers.ts:${/*LL*/ 21}`, {
    x: await _req.body,
  });

  const randomIntegers = createRandomIntegerArray(3);

  try {
    for (const randomInteger of randomIntegers) {
      if (randomInteger === 1) throw new Error("test");
      await delay(100);

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
