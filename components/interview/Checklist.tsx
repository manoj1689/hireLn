"use client";

import React from "react";
import {
  HiMiniVideoCamera,
  HiMiniVideoCameraSlash,
} from "react-icons/hi2";
import { MdMic, MdMicOff } from "react-icons/md";
import { IoCodeSharp, IoCodeSlash } from "react-icons/io5";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";

interface Permissions {
  camera: boolean;
  microphone: boolean;
  devToolsOpen: boolean;
  fullscreen: boolean;
}

interface ChecklistIconsProps {
  permissions: Permissions;
}

const ChecklistIcons: React.FC<ChecklistIconsProps> = ({ permissions }) => {
  return (
    <div className="fixed bg-gray-200 left-4 top-1/2 -translate-y-1/2 flex rounded-lg shadow-lg flex-col items-center gap-4 z-50 p-2">
      {/* Camera */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform ${
          permissions.camera
            ? "text-orange-500 animate-pulse-once"
            : "text-gray-400"
        }`}
      >
        {permissions.camera ? (
          <HiMiniVideoCamera size={24} />
        ) : (
          <HiMiniVideoCameraSlash size={24} />
        )}
      </div>

      {/* Microphone */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform ${
          permissions.microphone
            ? "text-green-500 animate-pulse-once"
            : "text-gray-400"
        }`}
      >
        {permissions.microphone ? (
          <MdMic size={24} />
        ) : (
          <MdMicOff size={24} />
        )}
      </div>

      {/* DevTools */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform ${
          permissions.devToolsOpen
            ? "text-red-500 animate-pulse-once"
            : "text-gray-400"
        }`}
      >
        {permissions.devToolsOpen ? (
          <IoCodeSharp size={22} />
        ) : (
          <IoCodeSlash size={22} />
        )}
      </div>

      {/* Fullscreen */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform ${
          permissions.fullscreen
            ? "text-indigo-500 animate-pulse-once"
            : "text-gray-400"
        }`}
      >
        {permissions.fullscreen ? (
          <RxExitFullScreen size={22} />
        ) : (
          <RxEnterFullScreen size={22} />
        )}
      </div>
    </div>
  );
};

export default ChecklistIcons;
