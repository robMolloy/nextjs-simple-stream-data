import { useState } from "react";

type TFetchParams = Parameters<typeof fetch>;

const streamFetch = async (p: {
  url: string;
  payload: TFetchParams[1];
  onStream: (x: string) => void;
}): Promise<string> => {
  const strArray: string[] = [];
  const response = await fetch(p.url, p.payload);
  if (!response.ok) throw new Error("Failed to start stream");

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) throw new Error("No reader available");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    strArray.push(chunk);
    p.onStream(strArray.join(""));
  }

  return strArray.join("");
};

export const StreamNumbers = () => {
  const [number, setNumber] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = async () => {
    setNumber("");
    setError(null);
    setIsStreaming(true);
    const response = await streamFetch({
      url: "/api/stream-numbers",
      payload: {},
      onStream: (x) => setNumber(x),
    });

    console.log(`StreamNumbers.tsx:${/*LL*/ 50}`, { response });
    setIsStreaming(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Random Number Stream</h1>

      {isStreaming && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      {!isStreaming && (
        <button
          onClick={startStream}
          disabled={isStreaming}
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {isStreaming ? "Streaming..." : "Start Stream"}
        </button>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="space-y-2">
        <pre>{JSON.stringify({ numbers: number }, undefined, 2)}</pre>
      </div>
    </div>
  );
};
