import { RefObject, useEffect } from "react";

export function useCanvasSync(
  stream: MediaStream | null,
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
  useEffect(() => {
    if (!stream || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const handleResize = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.addEventListener("loadedmetadata", handleResize);
    return () => {
      video.removeEventListener("loadedmetadata", handleResize);
    };
  }, [stream, videoRef, canvasRef]);
}
