// src/hooks/useFaceDetection.ts
import { RefObject, useEffect } from "react";
import * as faceapi from "face-api.js";
import { useAppDispatch } from "../store/hooks";
import { setDetections } from "../store/slices/detectionSlice";
import { drawDetectionsWithLabels } from "../utils/faceUtils";

export function useFaceDetection(
  modelsLoaded: boolean,
  stream: MediaStream | null,
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only start detecting once models are loaded and stream is active
    if (!modelsLoaded || !stream || !videoRef.current || !canvasRef.current) {
      return;
    }

    let animationId: number;
    let isMounted = true;

    const detectLoop = async () => {
      if (!isMounted || !videoRef.current || !canvasRef.current) return;

      try {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withAgeAndGender()
          .withFaceExpressions();

        dispatch(setDetections(detections));
        drawDetectionsWithLabels(
          videoRef.current,
          canvasRef.current,
          detections
        );
      } catch (err) {
        console.error("Error during face detection:", err);
      }

      animationId = requestAnimationFrame(detectLoop);
    };

    detectLoop();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationId);
    };
  }, [modelsLoaded, stream, videoRef, canvasRef, dispatch]);
}
