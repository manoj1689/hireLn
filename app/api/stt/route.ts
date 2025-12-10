import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("🎯 STT API called");

    const { audio, mimeType } = await req.json();

    if (!audio) {
      console.error("❌ No audio data provided in request");
      return NextResponse.json({ error: "No audio data provided" }, { status: 400 });
    }

    console.log("📦 Audio data received, length:", audio.length);
    console.log("🎵 MIME type:", mimeType || "not provided");

    // Check if API key exists
    if (!process.env.GOOGLE_SPEECH_API_KEY) {
      console.error("❌ GOOGLE_SPEECH_API_KEY not found in environment variables");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    console.log("🔑 API key found, length:", process.env.GOOGLE_SPEECH_API_KEY.length);

    // Determine encoding based on MIME type
    let encoding = "WEBM_OPUS"; // Default encoding
    if (mimeType?.includes("webm")) {
      encoding = "WEBM_OPUS";
    } else if (mimeType?.includes("ogg")) {
      encoding = "OGG_OPUS";
    } else if (mimeType?.includes("mp3")) {
      encoding = "MP3";
    } else if (mimeType?.includes("flac")) {
      encoding = "FLAC";
    } else if (mimeType?.includes("wav")) {
      encoding = "LINEAR16"; // WAV typically uses LINEAR16
    }

    console.log("🎚️ Using encoding:", encoding);

    const requestConfig = {
      encoding,
      languageCode: "en-IN",
      enableAutomaticPunctuation: true,
      useEnhanced: true, // Use enhanced model for better accuracy
      model: "latest_long", // Use latest_long model for better quality
      audioChannelCount: 1,
    };

    console.log("📤 Sending request to Google STT API with config:", JSON.stringify(requestConfig));

    const response = await fetch(
      "https://speech.googleapis.com/v1/speech:recognize?key=" +
      process.env.GOOGLE_SPEECH_API_KEY,
      {
        method: "POST",
        body: JSON.stringify({
          config: requestConfig,
          audio: {
            content: audio,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📥 Google STT API response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Google STT API error:", JSON.stringify(errorData, null, 2));
      return NextResponse.json(
        { error: "Speech recognition failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Google STT API success:", JSON.stringify(data, null, 2));

    // Combine all transcription results
    const transcripts = data.results?.map((result: any) =>
      result.alternatives?.[0]?.transcript || ""
    ) || [];

    const text = transcripts.join(" ").trim();
    console.log("📝 Transcribed text:", text || "(empty)");
    console.log("📊 Number of segments:", transcripts.length);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("💥 STT API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}