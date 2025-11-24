"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { uploadScreenshot } from "@/lib/slices/screenshots/screenshotsSlice";

let faceapi: any = null;

interface CameraFeedProps {
  onFacesDetected: (data: any) => void;
  enableAudio?: boolean;
  examStatus: string | null;
  interviewId: string;
  token?: string;
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  onFacesDetected,
  enableAudio = false,
  examStatus,
  interviewId,
  token,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [webcamActive, setWebcamActive] = useState(true);
  const webcamRef = useRef<Webcam>(null);
  const intervalIdRef = useRef<NodeJS.Timer | null>(null);
  console.log("token",token)
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  // ============================
  // Load Face API models
  // ============================
  const loadFaceApi = async () => {
    if (!faceapi && typeof window !== "undefined") {
      const mod = await import("@vladmandic/face-api");
      faceapi = mod;
    }
  };

  const loadModels = async () => {
    try {
      await loadFaceApi();
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");

      setModelsLoaded(true);
    } catch (err) {
      console.error("❌ Error loading models", err);
    }
  };

  // ============================
  // Stop webcam when exam ends
  // ============================
  const stopWebcam = () => {
    if (webcamRef.current?.video?.srcObject) {
      webcamRef.current.video.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }
    setWebcamActive(false);
  };

  // ============================
  // Face detection
  // ============================
  const detectFaces = async () => {
    if (!faceapi || !webcamRef.current?.video) return;

    return await faceapi
      .detectAllFaces(
        webcamRef.current.video,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceExpressions();
  };

  const startDetection = useCallback(() => {
    if (modelsLoaded && webcamRef.current?.video) {
      intervalIdRef.current = setInterval(async () => {
        const detections = await detectFaces();
        onFacesDetected({
          faceVerified: detections?.length > 0,
          multiplePeopleDetected: detections?.length > 1,
          detections,
        });
      }, 500);
    }
  }, [modelsLoaded, onFacesDetected]);

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded && examStatus !== "COMPLETED") {
      startDetection();
    }

    if (examStatus === "COMPLETED") {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      stopWebcam();
    }

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [modelsLoaded, startDetection, examStatus]);

  // ============================
  // Screenshot Capture
  // ============================
  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("📸 Screenshot:", imageSrc);
  }, []);

  // ============================
  // Auto Upload Screenshot every 1 min if examStatus active
  // ============================
useEffect(() => {
  if (!examStatus || examStatus === "COMPLETED") return;

  const interval = setInterval(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Convert base64 to file
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], `screenshot-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    // ✅ Use your existing face detection results here
    

    // Dispatch uploadScreenshot thunk
    dispatch(
      uploadScreenshot({
        interview_id: interviewId,
        file,
        token,
        faceVerified: true,
        multiFace:false,
        note:"testing"
      })
    );
  }, 60_000);

  return () => clearInterval(interval);
}, [dispatch, examStatus, interviewId, token]);

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <ToastContainer />
      {webcamActive && (
        <>
          <Webcam
            ref={webcamRef}
            audio={enableAudio}
            muted
            autoPlay
            mirrored={true}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ borderRadius: "12px" }}
          />
      
        </>
      )}
    </div>
  );
};

export default React.memo(CameraFeed);
