import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { toast, ToastContainer } from 'react-toastify';
import Webcam from 'react-webcam';

const MODEL_URL = '/models';

const CameraFeed = ({ onFacesDetected, enableAudio, examStatus }) => {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [webcamActive, setWebcamActive] = useState(true);
    const webcamRef = useRef(null);
    const intervalIdRef = useRef(null);

    const loadModels = async () => {
        try {
            console.log('Loading face detection models...');
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector_model-weights_manifest.json');
            await faceapi.nets.ssdMobilenetv1.loadFromUri('/models/ssd_mobilenetv1_model-weights_manifest.json');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68_model-weights_manifest.json');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition_model-weights_manifest.json');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression_model-weights_manifest.json');
            setModelsLoaded(true);
            console.log('All models loaded successfully');
        } catch (error) {
            console.error('Error loading models:', error);
        }
    };

    const stopWebcam = () => {
        if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
            const tracks = webcamRef.current.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        setWebcamActive(false);
    };

    const detectFaces = async (videoElement) => {
        if (!videoElement) return [];
        try {
            return await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();
        } catch (error) {
            console.error('Error detecting faces:', error);
            return [];
        }
    };

    const handleVideoPlay = useCallback(() => {
        if (modelsLoaded && webcamRef.current && webcamRef.current.video) {
            intervalIdRef.current = setInterval(async () => {
                const detections = await detectFaces(webcamRef.current.video);
                const faceVerified = detections.length > 0;
                const multiplePeopleDetected = detections.length > 1;

                onFacesDetected({
                    faceVerified,
                    multiplePeopleDetected,
                    detections,
                });
            }, 500);
        }
    }, [onFacesDetected, modelsLoaded]);

    useEffect(() => {
        loadModels();
    }, []);

    useEffect(() => {
        if (modelsLoaded && examStatus !== "COMPLETED") {
            handleVideoPlay();
        }

        if (examStatus === "COMPLETED") {
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
            stopWebcam();
        }

        return () => {
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        };
    }, [modelsLoaded, handleVideoPlay, examStatus]);

    return (
        <div className='flex w-auto h-auto '>
            <ToastContainer />
            {webcamActive && (
                <Webcam
                    ref={webcamRef}
                    audio={enableAudio}
                    muted
                    autoPlay
                    mirrored={true}
                    style={{ width: '100%', borderRadius: '1%'}}
                />
            )}
        </div>
    );
};

export default React.memo(CameraFeed);
