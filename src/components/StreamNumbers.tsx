import { useState } from "react";

export const StreamNumbers = () => {
  const [numbers, setNumbers] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = async () => {
    setNumbers([]);
    setError(null);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/stream-numbers");

      if (!response.ok) throw new Error("Failed to start stream");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) setNumbers((prev) => [...prev, line]);
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
        <pre>{JSON.stringify({ numbers }, undefined, 2)}</pre>
      </div>
    </div>
  );
};
