import React, { RefObject } from "react";

interface ImagePreviewProps {
  fileUrl: string;
  imageRef: RefObject<HTMLImageElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  runImageDetection: () => void;
}

export function ImagePreview({
  fileUrl,
  imageRef,
  canvasRef,
  runImageDetection,
}: ImagePreviewProps) {
  return (
    <div className="relative w-full max-w-md mx-auto mt-6">
      <img
        ref={imageRef}
        src={fileUrl}
        alt="Uploaded"
        onLoad={runImageDetection}
        className="w-full rounded-lg shadow-md"
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
}
