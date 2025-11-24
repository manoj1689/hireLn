"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Rnd } from "react-rnd";

import { HiMiniVideoCamera, HiMiniVideoCameraSlash } from "react-icons/hi2";
import { MdMic, MdMicOff, MdCallEnd } from "react-icons/md";
import { IoCodeSharp, IoCodeSlash } from "react-icons/io5";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiCamera,
} from "react-icons/fi";

const CameraFeed = dynamic(() => import("@/components/interview/CameraFeed"), {
  ssr: false,
});

export default function VideoInterfacePage({
  permissions,
  setPermissions,
  faceDetectionResults,
  setFaceDetectionResults,
  examStatus,
  interviewId,
  token
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

  return (
    <Rnd
      default={{
        x: 50,
        y: 100,
        width: 420,
        height: 320,
      }}
      bounds="window"
      minWidth={320}
      minHeight={240}
      dragHandleClassName="drag-handle"
      className="z-50 shadow-lg rounded-xl overflow-hidden backdrop-blur"
    >
      <div className="relative bg-gray-900 rounded-xl w-full h-full flex flex-col items-center justify-center">
        {/* ─── Drag Handle ─────────────────────────── */}
        <div className="drag-handle absolute top-0 left-0 w-full h-8 bg-gray-800/40 cursor-move rounded-t-xl z-[999]"></div>

        {/* ─── Camera Section ──────────────────────── */}
        {permissions.camera ? (
          <>
            <div
              className={`flex items-center gap-1 transition-all duration-300 rounded-xl 
                ${
                  faceDetectionResults.faceVerified
                    ? "shadow-[0_0_30px_4px_rgba(249,115,22,0.6)]" // orange glow
                    : "shadow-[0_0_30px_4px_rgba(239,68,68,0.6)]" // red glow
                }`}
            >
              <CameraFeed
                onFacesDetected={handleFacesDetected}
                enableAudio={permissions.microphone}
                examStatus={examStatus}
                interviewId={interviewId}
                token={token}
              />
            </div>

            {/* ─── Face Detection Status ───────────── */}
            <div className="absolute top-3 left-3 bg-white/90 rounded-md px-3 py-1 text-sm shadow text-gray-800 space-y-1">
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
          <div className="flex w-full flex-col items-center justify-center h-full bg-gray-100 rounded-lg shadow-inner">
            <FiCamera className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Camera is disabled</p>
          </div>
        )}

        {/* ─── Control Buttons ─────────────────────── */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4 items-center">
          <button
            onClick={() => togglePermission("camera")}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow transition backdrop-blur bg-white/10 ${
              permissions.camera ? "text-emerald-300" : "text-gray-500"
            }`}
          >
            {permissions.camera ? (
              <HiMiniVideoCamera size={20} />
            ) : (
              <HiMiniVideoCameraSlash size={20} />
            )}
          </button>

          <button
            onClick={() => togglePermission("microphone")}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow transition backdrop-blur bg-white/10 ${
              permissions.microphone ? "text-green-400" : "text-gray-500"
            }`}
          >
            {permissions.microphone ? (
              <MdMic size={20} />
            ) : (
              <MdMicOff size={20} />
            )}
          </button>

          <button className="w-12 h-10 rounded-2xl flex items-center justify-center shadow transition backdrop-blur bg-red-500 text-white hover:bg-red-600">
            <MdCallEnd size={25} />
          </button>

          <button
            onClick={() => togglePermission("devToolsOpen")}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow transition backdrop-blur bg-white/10 ${
              permissions.devToolsOpen ? "text-red-500" : "text-gray-500"
            }`}
          >
            {permissions.devToolsOpen ? (
              <IoCodeSharp size={20} />
            ) : (
              <IoCodeSlash size={20} />
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow transition backdrop-blur bg-white/10 ${
              permissions.fullscreen ? "text-indigo-500" : "text-gray-500"
            }`}
          >
            {permissions.fullscreen ? (
              <RxExitFullScreen size={20} />
            ) : (
              <RxEnterFullScreen size={20} />
            )}
          </button>
        </div>
      </div>
    </Rnd>
  );
}
