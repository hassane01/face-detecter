import React, { RefObject, useEffect } from 'react';

interface LiveFeedProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  stream: MediaStream | null;
  runFaceDetection: () => void;
}

export function LiveFeed({ videoRef, canvasRef, stream, runFaceDetection }: LiveFeedProps) {
  // sizing effect stays here if you want or leave in parent
  useEffect(() => {
    if (stream) runFaceDetection();
  }, [stream]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="relative w-full max-w-md mx-auto">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full rounded-lg shadow-md"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
}
