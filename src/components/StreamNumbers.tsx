import { useState } from "react";

type TFetchParams = Parameters<typeof fetch>;

const streamFetch = async (p: {
  url: string;
  payload: TFetchParams[1];
  onStream: (x: string) => void;
}): Promise<
  { success: true; data: string } | { success: false; error: unknown }
> => {
  try {
    const strArray: string[] = [];
    const response = await fetch(p.url, p.payload);
    if (!response.ok)
      return { success: false, error: "Failed to start stream" };

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return { success: false, error: "No reader available" };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      strArray.push(chunk);
      p.onStream(strArray.join(""));
    }

    return { success: true, data: strArray.join("") };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const StreamNumbers = () => {
  const [number, setNumber] = useState("");
  const [mode, setMode] = useState<"ready" | "streaming" | "error">("ready");

  const startStream = async () => {
    setNumber("");
    setMode("streaming");
    const response = await streamFetch({
      url: "/api/stream-numbers",
      payload: {},
      onStream: (x) => setNumber(x),
    });

    setMode(response.success ? "ready" : "error");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Random Number Stream</h1>

      {mode === "streaming" && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      {mode !== "streaming" && (
        <button
          onClick={startStream}
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Start Stream
        </button>
      )}

      {mode === "error" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          there was an error
        </div>
      )}

      <div className="space-y-2">
        <pre>{JSON.stringify({ numbers: number }, undefined, 2)}</pre>
      </div>
    </div>
  );
};
