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
  const randomIntegers = createRandomIntegerArray(3);

  try {
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Stream failed" });
  }
}
