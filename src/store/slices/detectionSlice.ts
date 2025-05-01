import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FaceDetection, WithAge, WithGender, WithFaceExpressions } from 'face-api.js'

// Combine types for our detections
export type Detection = WithFaceExpressions<
  WithAge<
    WithGender<{
      detection: FaceDetection;
    }>
  >
>;
interface DetectionState {
  items: Detection[];
}

const initialState: DetectionState = {
  items: [],
};

const detectionSlice = createSlice({
  name: "detections",
  initialState,
  reducers: {
    setDetections(state, action: PayloadAction<Detection[]>) {
      state.items = action.payload;
    },
    clearDetections(state) {
      state.items = [];
    },
  },
});

export const { setDetections, clearDetections } = detectionSlice.actions;
export default detectionSlice.reducer;
