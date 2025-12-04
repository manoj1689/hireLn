import { NextResponse } from "next/server";
import textToSpeech from "@google-cloud/text-to-speech";

export async function POST(req: Request) {
  const { text } = await req.json();

  const credentials = JSON.parse(process.env.GOOGLE_TTS_CREDENTIALS || "{}");

  // IMPORTANT: must use "new (textToSpeech as any).TextToSpeechClient"
  const client = new (textToSpeech as any).TextToSpeechClient({
    credentials,
  });

  const request = {
    input: { text },
    voice: {
      languageCode: "en-US",
      ssmlGender: "MALE",
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  };

  // FIX: do NOT destructure directly
  const result = await client.synthesizeSpeech(request);

  // FIX: Extract response safely
  const response = result[0];

  return new NextResponse(response.audioContent, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}
