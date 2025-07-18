import React, { useState, useEffect } from 'react';
import Speech from 'speak-tts';

const SpeechTTSPage: React.FC = () => {
  const [speech] = useState(new Speech());
  const [voices, setVoices] = useState<Array<{ name: string; lang: string }>>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([
    "First message: Welcome to SmartGrader!",
    "Second message: Please introduce yourself.",
    "Third message: What is your expertise?"
  ]);
  const [messageIndex, setMessageIndex] = useState<number>(0);
  
  // Initialize speech and load voices
  useEffect(() => {
    if (speech.hasBrowserSupport()) {
      speech
        .init({
          volume: 1,
          lang: 'en-US',
          rate: 1,
          pitch: 1,
          splitSentences: true,
        })
        .then((data) => {
          const availableVoices = data.voices;
          setVoices(availableVoices);
          setSelectedVoice(availableVoices[0].name); // Set default voice
          console.log('Voices available:', availableVoices);
        })
        .catch((e) => {
          console.error('Error during speech initialization:', e);
        });
    } else {
      console.error('Speech synthesis is not supported in this browser.');
    }
  }, [speech]);

  // Handle speaking the next message in the queue
  const speakNextMessage = () => {
    if (messageIndex >= messages.length) return;

    const messageToSpeak = messages[messageIndex];
    
    speech.speak({
      text: messageToSpeak,
      listeners: {
        onstart: () => console.log(`Speech started for: "${messageToSpeak}"`),
        onend: () => {
          console.log(`Speech ended for: "${messageToSpeak}"`);
          setMessageIndex((prevIndex) => prevIndex + 1); // Move to the next message
        },
        onerror: (e) => console.error("Speech error occurred:", e),
      },
      queue: false, // If false, interrupts any ongoing speech
    });
  };

  // Handle voice selection
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedVoice(selected);
    speech.init({
      voice: selected,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Text-to-Speech Demo</h1>

      <div className="mb-4">
        <label htmlFor="voiceSelect" className="block text-lg mb-2">
          Choose a Voice:
        </label>
        <select
          id="voiceSelect"
          value={selectedVoice}
          onChange={handleVoiceChange}
          className="p-2 border rounded-lg"
        >
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={speakNextMessage}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Speak Next Message
      </button>

      <p className="mt-4">
        {messageIndex < messages.length
          ? `Next message to speak: "${messages[messageIndex]}"`
          : "All messages have been spoken."}
      </p>
    </div>
  );
};

export default SpeechTTSPage;


