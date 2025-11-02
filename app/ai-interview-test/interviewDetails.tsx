import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Video, Mic, Code, Maximize2 } from "lucide-react";

export default function CompatibilityTest() {
  return (
    <div className="grid grid-cols-2 gap-4 pt-6 text-sm font-medium">
      {/* Video Camera Test */}
      <div className="bg-blue-100 rounded-xl px-4 py-3 relative shadow-sm">
        <span className="absolute top-0 left-10 bg-blue-400 text-white text-md px-2 py-[2px] rounded-b-lg font-medium">
          Video Camera Test
        </span>
        <div className="flex items-center gap-3 mt-4">
          <Video className="text-blue-400 w-12 h-12" />
          <div>
            <p className="text-gray-700 text-lg font-semibold">Check your camera</p>
            <p className="text-gray-600 text-sm">
              Ensure your camera feed is visible and clear before starting the interview.
            </p>
          </div>
        </div>
      </div>

      {/* Microphone Test */}
      <div className="bg-green-100 rounded-xl px-4 py-3 relative shadow-sm">
        <span className="absolute top-0 left-10 bg-green-400 text-white text-md px-2 py-[2px] rounded-b-lg font-medium">
          Microphone Test
        </span>
        <div className="flex items-center gap-3 mt-4">
          <Mic className="text-green-400 w-12 h-12" />
          <div>
            <p className="text-gray-700 text-lg font-semibold">Check your microphone</p>
            <p className="text-gray-600 text-sm">
              Speak into your mic and make sure it detects your voice input properly.
            </p>
          </div>
        </div>
      </div>

      {/* Developer Mode Test */}
      <div className="bg-yellow-100 rounded-xl px-4 py-3 relative shadow-sm">
        <span className="absolute top-0 left-10 bg-yellow-400 text-white text-md px-2 py-[2px] rounded-b-lg font-medium">
          Dev Mode Test
        </span>
        <div className="flex items-center gap-3 mt-4">
          <Code className="text-yellow-400 w-12 h-12" />
          <div>
            <p className="text-gray-700 text-lg font-semibold">Disable Dev Tools</p>
            <p className="text-gray-600 text-sm">
              Please close or disable any developer tools before beginning your test.
            </p>
          </div>
        </div>
      </div>

      {/* Full Screen Test */}
      <div className="bg-red-100 rounded-xl px-4 py-3 relative shadow-sm">
        <span className="absolute top-0 left-10 bg-red-400 text-white text-md px-2 py-[2px] rounded-b-lg font-medium">
          Full Screen Test
        </span>
        <div className="flex items-center gap-3 mt-4">
          <Maximize2 className="text-red-400 w-12 h-12" />
          <div>
            <p className="text-gray-700 text-lg font-semibold">Enable Full Screen</p>
            <p className="text-gray-600 text-sm">
              Make sure your screen is in full-screen mode for a distraction-free experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
