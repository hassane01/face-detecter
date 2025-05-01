// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import detectionReducer from "./slices/detectionSlice";
import imageReducer from "./slices/imageSlice";

export const store = configureStore({
  reducer: {
    detections: detectionReducer,
    image: imageReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
