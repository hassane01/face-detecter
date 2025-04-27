import React from "react";

interface ControlsProps {
  streamActive: boolean;
  onStart: () => void;
  onStop: () => void;
  onUpload: (file: File) => void;
  onCapture: () => void;
  disableCapture: boolean;
}

export function Controls({
  streamActive,
  onStart,
  onStop,
  onUpload,
  onCapture,
  disableCapture,
}: ControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex gap-2">
        <button
          onClick={onStart}
          disabled={streamActive}
          className="px-5 py-3 rounded-lg bg-green-600 text-white text-base disabled:opacity-50"
        >
          Start Webcam
        </button>
        <button
          onClick={onStop}
          disabled={disableCapture}
          className="px-5 py-3 rounded-lg bg-red-600 text-white text-base disabled:opacity-50"
        >
          Stop Webcam
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Upload Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                onUpload(file);
              }
            }}
            className="text-sm"
          />
        </div>
        <button
          onClick={onCapture}
          className="px-5 py-3 rounded-lg bg-blue-600 text-white text-base disabled:opacity-50"
        >
          Capture Detections
        </button>
      </div>
    </div>
  );
}
