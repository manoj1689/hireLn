"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast, ToastContainer } from "react-toastify";

let faceapi = null; // will load dynamically

const CameraFeed = ({ onFacesDetected, enableAudio, examStatus }) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [webcamActive, setWebcamActive] = useState(true);
  const webcamRef = useRef(null);
  const intervalIdRef = useRef(null);

  const loadFaceApi = async () => {
    if (!faceapi && typeof window !== "undefined") {
      const mod = await import("@vladmandic/face-api");
      faceapi = mod;
    }
  };

  const loadModels = async () => {
    try {
      await loadFaceApi();
      console.log("Loading face detection models...");

      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");

      console.log("✅ Models Loaded");
      setModelsLoaded(true);
    } catch (err) {
      console.error("❌ Error loading models", err);
    }
  };

  const stopWebcam = () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.srcObject
    ) {
      webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
    }
    setWebcamActive(false);
  };

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
        const faceVerified = detections?.length > 0;
        const multiplePeopleDetected = detections?.length > 1;

        onFacesDetected({
          faceVerified,
          multiplePeopleDetected,
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
      clearInterval(intervalIdRef.current);
      stopWebcam();
    }

    return () => clearInterval(intervalIdRef.current);
  }, [modelsLoaded, startDetection, examStatus]);

  return (
    <div className="flex w-full justify-center">
      <ToastContainer />
      {webcamActive && (
        <Webcam
          ref={webcamRef}
          audio={enableAudio}
          muted
          autoPlay
          mirrored={true}
          style={{ borderRadius: "2%" }}
        />
      )}
    </div>
  );
};

export default React.memo(CameraFeed);
