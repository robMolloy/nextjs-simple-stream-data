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
        <Link href="/vercel-stream-text" className="hover:underline p-4">
          vercel-stream-text
        </Link>
        <Link href="/vercel-stream-text-page" className="hover:underline p-4">
          vercel-stream-text-page
        </Link>
        <Link href="/call-anthropic" className="hover:underline p-4">
          call-anthropic
        </Link>
      </div>
      <Component {...pageProps} />
    </>
  );
}
