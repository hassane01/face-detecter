// src/hooks/useFaceApiModels.ts
import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

/**
 * Custom hook to load face-api.js models from the public/models directory.
 * Returns `true` once all models are loaded.
 */
export function useFaceApiModels(): boolean {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const MODEL_URL = "/models";

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net .loadFromUri(MODEL_URL), 
    ])
      .then(() => {
        console.log("✅ face-api.js models loaded");
        setModelsLoaded(true);
      })
      .catch((err) => {
        console.error("❌ Error loading face-api.js models:", err);
      });
  }, []);

  return modelsLoaded;
}
