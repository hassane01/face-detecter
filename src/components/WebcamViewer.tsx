
import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import {
  FaceDetectionWithAgeAndGender,
  WithFaceExpressions
} from 'face-api.js';
type Detection = FaceDetectionWithAgeAndGender & WithFaceExpressions;

export function WebcamViewer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [file, setFile] = useState<File | null>(null);
const imageRef = useRef<HTMLImageElement>(null);
const [detections, setDetections] = useState<Detection[]>([]);


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


      setDetections(detections);
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
  const runImageDetection = async () => {
    if (!imageRef.current || !canvasRef.current) return;
  
    // 1) Match canvas to image size
    const img = imageRef.current;
    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
  
    // 2) Detect faces + attributes on the image
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender()
      .withFaceExpressions();
      setDetections(detections)
    // 3) Draw
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, detections);
  
    detections.forEach(d => {
      const { x, y } = d.detection.box;
      const age = Math.round(d.age);
      const gender = d.gender;
      const maxEmotion = Object.entries(d.expressions)
        .reduce((p, c) => (c[1] > p[1] ? c : p))[0];
      const label = `${age} yrs, ${gender}, ${maxEmotion}`;
  
      ctx.font = '16px sans-serif';
      ctx.fillStyle = 'red';
      ctx.fillText(label, x, y - 8);
    });
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
      <div className="mt-4">
  <label className="block mb-1 font-medium">Upload Image:</label>
  <input
    type="file"
    accept="image/*"
    onChange={e => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
        // stop webcam if running
        stopWebcam();
      }
    }}
    className="block"
  />
</div>
<div className="mt-4">
  <button
    onClick={() => {
      // detections are already in state
      console.log('Captured detections:', detections);
      // you could also send them to an API here
    }}
    disabled={detections.length === 0}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
  >
    Capture Detections
  </button>
</div>
{file && (
  <div className="relative w-full max-w-lg mt-6">
    <img
      ref={imageRef}
      src={URL.createObjectURL(file)}
      alt="Uploaded"
      onLoad={() => runImageDetection()}
      className="w-full rounded shadow-lg"
    />
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
    />
  </div>
)}
{detections.length > 0 && (
  <div className="mt-6 w-full max-w-lg bg-gray-100 p-4 rounded shadow">
    <h3 className="font-semibold mb-2">Detected Faces:</h3>
    <ul className="space-y-2">
      {detections.map((d, i) => {
        // Determine dominant emotion
        const maxEmotion = Object.entries(d.expressions)
          .reduce((p, c) => (c[1] > p[1] ? c : p))[0];
        return (
          <li key={i} className="text-sm">
            <strong>Face {i + 1}:</strong> 
            {` Age: ${Math.round(d.age)} yrs, Gender: ${d.gender}, Emotion: ${maxEmotion}`}
          </li>
        );
      })}
    </ul>
  </div>
)}


    </div>
  );
}
