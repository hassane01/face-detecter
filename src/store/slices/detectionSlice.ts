// src/store/slices/detectionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { FaceDetectionWithAgeAndGender, WithFaceExpressions } from 'face-api.js'

// Combine types for our detections
export type Detection = FaceDetectionWithAgeAndGender & WithFaceExpressions

interface DetectionState {
  items: Detection[]
}

const initialState: DetectionState = {
  items: [],
}

const detectionSlice = createSlice({
  name: 'detections',
  initialState,
  reducers: {
    setDetections(state, action: PayloadAction<Detection[]>) {
      state.items = action.payload
    },
    clearDetections(state) {
      state.items = []
    },
  },
})

export const { setDetections, clearDetections } = detectionSlice.actions
export default detectionSlice.reducer
