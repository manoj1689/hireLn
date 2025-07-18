"use client";

import { useState, useCallback, useEffect } from "react";
import CameraFeed from "@/components/interview/CameraFeed";
import {
  HiMiniVideoCamera,
  HiMiniVideoCameraSlash,
} from "react-icons/hi2";
import { MdMic, MdMicOff, MdCallEnd } from "react-icons/md";
import { IoCodeSharp, IoCodeSlash } from "react-icons/io5";
import {
  RxEnterFullScreen,
  RxExitFullScreen,
} from "react-icons/rx";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiCamera,
} from "react-icons/fi";

export default function VideoInterfacePage({
  permissions,
  setPermissions,
  faceDetectionResults,
  setFaceDetectionResults,
  examStatus,
}) {
  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const handleFacesDetected = useCallback(
    (results) => {
      setFaceDetectionResults(results);
    },
    [setFaceDetectionResults]
  );

  // 🧠 Auto-disable features on examStatus = "COMPLETED"
  useEffect(() => {
    if (examStatus === "COMPLETED") {
      setPermissions((prev) => ({
        ...prev,
        camera: false,
        microphone: false,
        fullscreen: false,
      }));

      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      }
    }
  }, [examStatus, setPermissions]);

  return (
    <div className="relative h-auto overflow-hidden">
      {permissions.camera ? (
        <>
          <CameraFeed
            onFacesDetected={handleFacesDetected}
            enableAudio={permissions.microphone}
            examStatus={examStatus}
          />

          <div className="absolute top-2 left-2 bg-white/90 rounded-md px-3 py-1 text-sm shadow text-gray-800 space-y-1">
            {faceDetectionResults.multiplePeopleDetected && (
              <div className="flex items-center text-red-600 gap-1">
                <FiAlertTriangle className="w-4 h-4" />
                <span>Multiple faces detected</span>
              </div>
            )}
            <div
              className={`flex items-center gap-1 ${
                faceDetectionResults.faceVerified
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {faceDetectionResults.faceVerified ? (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Face Verified</span>
                </>
              ) : (
                <>
                  <FiAlertCircle className="w-4 h-4" />
                  <span>Face Not Verified</span>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg shadow-inner">
          <FiCamera className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Camera is disabled</p>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 items-center">
        <button
          onClick={() => togglePermission("camera")}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow transition backdrop-blur bg-white/10 ${
            permissions.camera ? "text-emerald-300" : "text-gray-500"
          }`}
        >
          {permissions.camera ? (
            <HiMiniVideoCamera size={30} />
          ) : (
            <HiMiniVideoCameraSlash size={30} />
          )}
        </button>

        <button
          onClick={() => togglePermission("microphone")}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow transition backdrop-blur bg-white/10 ${
            permissions.microphone ? "text-green-400" : "text-gray-500"
          }`}
        >
          {permissions.microphone ? (
            <MdMic size={30} />
          ) : (
            <MdMicOff size={30} />
          )}
        </button>

        <button className="w-16 h-12 rounded-2xl flex items-center justify-center shadow transition backdrop-blur bg-red-500 text-white hover:bg-red-600">
          <MdCallEnd size={35} />
        </button>

        <button
          onClick={() => togglePermission("devToolsOpen")}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow transition backdrop-blur bg-white/10 ${
            permissions.devToolsOpen ? "text-red-500" : "text-gray-500"
          }`}
        >
          {permissions.devToolsOpen ? (
            <IoCodeSharp size={30} />
          ) : (
            <IoCodeSlash size={30} />
          )}
        </button>

        <button
          onClick={toggleFullscreen}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow transition backdrop-blur bg-white/10 ${
            permissions.fullscreen ? "text-indigo-500" : "text-gray-500"
          }`}
        >
          {permissions.fullscreen ? (
            <RxExitFullScreen size={30} />
          ) : (
            <RxEnterFullScreen size={30} />
          )}
        </button>
      </div>
    </div>
  );
}
