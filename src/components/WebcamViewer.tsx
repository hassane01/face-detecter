import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearDetections } from "../store/slices/detectionSlice";
import { setImageUrl } from "../store/slices/imageSlice";
import { Controls } from "./webcamviewer/Controls";
import { LiveFeed } from "./webcamviewer/LiveFeed";
import { ImagePreview } from "./webcamviewer/ImagePreview";
import { DetectionList } from "./webcamviewer/DetectionList";

import { useFaceApiModels } from "../hooks/useFaceApiModels";
import { useCanvasSync } from "../hooks/useCanvasSync";
import { useFaceDetection } from "../hooks/useFaceDetection";
import { useImageDetection } from "../hooks/useImageDetection";

export function WebcamViewer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);

  const dispatch = useAppDispatch();
  const detections = useAppSelector((state) => state.detections.items);
  const fileUrl = useAppSelector((state) => state.image.fileUrl);

  // ─── A) Start / Stop Logic ────────────────────────────
  const startWebcam = async () => {
    const userStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    setStream(userStream);
    if (videoRef.current) videoRef.current.srcObject = userStream;
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    dispatch(clearDetections());
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  // ─── B) Side-Effect Hooks ─────────────────────────────

  const modelsLoaded = useFaceApiModels();
  useCanvasSync(stream, videoRef, videoCanvasRef);
  useFaceDetection(modelsLoaded, stream, videoRef, videoCanvasRef);
  useImageDetection(modelsLoaded, fileUrl, imageRef, imageCanvasRef);

  // ─── C) Render ────────────────────────────────────────
  {
    console.log("Video element:", videoRef.current);

    console.log(
      "Video dimensions:",
      videoRef.current?.videoWidth,
      videoRef.current?.videoHeight
    );
  }
  return (
    <div className="flex flex-col items-center space-y-4">
      <Controls
        streamActive={!!stream}
        onStart={startWebcam}
        onStop={stopWebcam}
        onUpload={(f) => {
          stopWebcam();
          dispatch(setImageUrl(URL.createObjectURL(f)));
          dispatch(clearDetections());
        }}
        onCapture={() => console.log("Captured", detections)}
        disableCapture={detections.length === 0}
      />
      <LiveFeed videoRef={videoRef} canvasRef={videoCanvasRef} />

      {fileUrl && (
        <ImagePreview
          fileUrl={fileUrl}
          imageRef={imageRef}
          imageCanvasRef={imageCanvasRef}
        />
      )}
      {detections.length > 0 && <DetectionList detections={detections} />}
    </div>
  );
}
