import  { RefObject } from "react";

interface ImagePreviewProps {
  fileUrl: string;
  imageRef: RefObject<HTMLImageElement | null>;
  imageCanvasRef: RefObject<HTMLCanvasElement | null>;
  
}

export function ImagePreview({
  fileUrl,
  imageRef,
  imageCanvasRef,

}: ImagePreviewProps) {
  return (
    <div className="relative w-full max-w-md mx-auto mt-6">
      <img
        ref={imageRef}
        crossOrigin="anonymous"
        src={fileUrl}
        alt="Uploaded"
        
        className="w-full rounded-lg shadow-md"
      />
      <canvas ref={imageCanvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
}
