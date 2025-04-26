
import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export function WebcamViewer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  

  // ─── 1) Start/Stop Webcam Hooks ───────────────────────────────────
  const startWebcam = async () => {
    const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(userStream);
    if (videoRef.current) videoRef.current.srcObject = userStream;
  };
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  };

  // ─── 2) Model Loading Hook ────────────────────────────────────────
  useEffect(() => {
    const MODEL_URL = '/models';
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ])
      .then(() => console.log('All required nets loaded'))
      .catch(err => console.error('Model loading error:', err));
  }, []);
  

  // ─── 3) CANVAS SIZING Hook (place this *after* stream/ref setup) ──
  useEffect(() => {
    if (!stream || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const handleResize = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    // When the video’s metadata (including dimensions) finishes loading:
    video.addEventListener('loadedmetadata', handleResize);

    // Clean up the listener if stream changes or component unmounts:
    return () => {
      video.removeEventListener('loadedmetadata', handleResize);
    };
  }, [stream]);

  // ─── 4) FACE DETECTION Loop Hook ─────────────────────────────────
  const runFaceDetection = async () => {
    if (!videoRef.current || !canvasRef.current) return;
  
    // 1) Detect faces + attributes
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender()
      .withFaceExpressions();
  
    // 2) Prepare canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // 3) Draw bounding boxes
    faceapi.draw.drawDetections(canvas, detections);
  
    // 4) Draw labels for each face
    detections.forEach(d => {
      const { x, y } = d.detection.box;
      const age = Math.round(d.age);
      const gender = d.gender;
      // find the emotion with the highest probability
      const maxEmotion = Object.entries(d.expressions)
        .reduce((prev, curr) => (curr[1] > prev[1] ? curr : prev))[0];
  
      const label = `${age} yrs, ${gender}, ${maxEmotion}`;
  
      ctx.font = '16px sans-serif';
      ctx.fillStyle = 'red';
      ctx.fillText(label, x, y - 8);
    });
  
    // 5) Loop
    requestAnimationFrame(runFaceDetection);
  };
 
  
  useEffect(() => {
    if (stream) runFaceDetection();
  }, [stream]);

  // ─── 5) RENDER ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold">Webcam Feed</h2>
      <div className="space-x-2">
        <button onClick={startWebcam} disabled={!!stream} className="px-4 py-2 rounded bg-green-500 text-white disabled:opacity-50">
          Start Webcam
        </button>
        <button onClick={stopWebcam} disabled={!stream} className="px-4 py-2 rounded bg-red-500 text-white disabled:opacity-50">
          Stop Webcam
        </button>
      </div>
      <div className="relative w-full max-w-lg">
        <video ref={videoRef} autoPlay muted className="w-full rounded shadow-lg" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
      


    </div>
  );
}
