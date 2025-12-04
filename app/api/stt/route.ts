import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { audio } = await req.json();

  const response = await fetch(
    "https://speech.googleapis.com/v1/speech:recognize?key=" +
      process.env.GOOGLE_SPEECH_API_KEY,
    {
      method: "POST",
      body: JSON.stringify({
        config: {
          encoding: "WEBM_OPUS",
          languageCode: "en-IN",
        },
        audio: {
          content: audio,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  const text =
    data.results?.[0]?.alternatives?.[0]?.transcript || "";

  return NextResponse.json({ text });
}
