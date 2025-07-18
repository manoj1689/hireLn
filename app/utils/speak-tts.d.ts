declare module 'speak-tts' {
  export default class Speech {
    constructor();

    hasBrowserSupport(): boolean;

    init(options: {
      volume?: number;
      lang?: string;
      rate?: number;
      pitch?: number;
      voice?: string;
      splitSentences?: boolean;
    }): Promise<{ voices: Array<{ name: string; lang: string; default: boolean }> }>;

    speak(options: {
      text: string;
      queue?: boolean; 
      listeners?: {
        onstart?: () => void;
        onend?: () => void;
        onerror?: (e: Error) => void;
      };
    }): Promise<void>;

    getVoices(): Array<{ name: string; lang: string; default: boolean }>;

    cancel(): void; // Add this method
  }
}

