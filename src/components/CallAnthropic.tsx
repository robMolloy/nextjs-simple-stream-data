import { useState } from "react";

type TFetchParams = Parameters<typeof fetch>;

const safeJsonParse = (x: unknown) => {
  try {
    return { succcess: true, data: JSON.parse(x as string) };
  } catch (error) {
    return { success: false, error: "unable to parse " + x + error };
  }
};

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
      const jsonParseResp = safeJsonParse(chunk);
      if (jsonParseResp.success === false)
        return { success: false, error: "unable to parse data" };

      const message = jsonParseResp.data.message;
      if (message === undefined || message === null)
        return { success: false, error: "message is undefined or null" };

      strArray.push(message);
      p.onStream(strArray.join(""));
    }

    return { success: true, data: strArray.join("") };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};

export const CallAnthropic = () => {
  const [qty, setQty] = useState(8);
  const [numbers, setNumber] = useState("");
  const [mode, setMode] = useState<"ready" | "streaming" | "error">("ready");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Random Number Stream</h1>

      <div
        className={`${
          mode !== "error" ? "opacity-0" : ""
        }  bg-red-100 border  text-red-700 p-4 rounded`}
      >
        there was an error
      </div>

      <br />

      <div className="flex justify-between">
        <input
          className="text-black w-12"
          type="number"
          onInput={(e) => {
            const evt = e.target as unknown as { value: string };
            setQty(parseInt(evt.value as string));
          }}
          value={qty}
        />
        <button
          onClick={async () => {
            if (mode === "streaming") return;
            setNumber("");
            setMode("streaming");

            const response = await streamFetch({
              url: "/api/call-anthropic",
              payload: {
                method: "POST",
                body: JSON.stringify({ qty }),
              },
              onStream: (x) => setNumber(x),
            });

            setMode(response.success ? "ready" : "error");
          }}
          disabled={mode === "streaming"}
          className="h-16 bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {mode !== "streaming" ? (
            "Start Stream"
          ) : (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            </div>
          )}
        </button>
      </div>
      <pre>
        {JSON.stringify(
          {
            qty,
            // numbers,
            length: numbers.length,
          },
          undefined,
          2
        )}
      </pre>
      <div>{numbers}</div>
    </div>
  );
};
