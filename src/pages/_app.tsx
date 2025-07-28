import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="flex gap-8">
        <Link href="/" className="hover:underline p-4">
          Home
        </Link>
        <Link href="/simple-stream-numbers" className="hover:underline p-4">
          simple-stream-numbers
        </Link>
        <Link href="/socket-stream-numbers" className="hover:underline p-4">
          socket-stream-numbers
        </Link>
      </div>
      <Component {...pageProps} />
    </>
  );
}
