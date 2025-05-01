import { RefObject } from "react";

interface LiveFeedProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function LiveFeed({ videoRef, canvasRef }: LiveFeedProps) {
  // sizing effect stays here if you want or leave in parent
  console.log("Canvas element:", canvasRef.current);
  return (
    <div className="relative w-full max-w-md mx-auto">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full rounded-lg shadow-md"
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
}
