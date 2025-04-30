import { RefObject, useEffect } from "react";
import * as faceapi from "face-api.js";
import { useAppDispatch } from "../store/hooks";
import { setDetections } from "../store/slices/detectionSlice";
import { drawDetectionsWithLabels } from "../utils/faceUtils";

export function useImageDetection(
  modelsLoaded: boolean,
  fileUrl: string | null,
  imageRef: RefObject<HTMLImageElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!modelsLoaded || !fileUrl || !imageRef.current || !canvasRef.current) return;

    const run = async () => {
      const img = imageRef.current!;
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withAgeAndGender()
        .withFaceExpressions();

      dispatch(setDetections(detections));
      drawDetectionsWithLabels(imageRef.current!, canvasRef.current!, detections);


    };

    run();
  }, [modelsLoaded ,fileUrl, imageRef, canvasRef, dispatch]);
}
