import { useState } from "react";

interface NumberData {
  number: number;
  count: number;
  timestamp: string;
}

export const StreamNumbers = () => {
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = async () => {
    setNumbers([]);
    setError(null);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/stream-numbers");

      if (!response.ok) {
        throw new Error("Failed to start stream");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          console.log({ line });
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6)); // Remove 'data: ' prefix
              setNumbers((prev) => [...prev, data]);
            } catch (e) {
              console.error("Failed to parse JSON:", e);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Random Number Stream</h1>

      <button
        onClick={startStream}
        disabled={isStreaming}
        className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {isStreaming ? "Streaming..." : "Start Stream"}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="space-y-2">
        {numbers.map((data, index) => (
          <div
            key={index}
            className="bg-gray-100 p-3 rounded border animate-pulse"
            style={{ animationDuration: "1s", animationIterationCount: "1" }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-mono">{data.number}</span>
              <span className="text-sm text-gray-500">
                #{data.count} - {new Date(data.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isStreaming && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};
