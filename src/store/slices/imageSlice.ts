import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageState {
  fileUrl: string | null;
}

const initialState: ImageState = { fileUrl: null };

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImageUrl(state, action: PayloadAction<string>) {
      state.fileUrl = action.payload;
    },
    clearImage(state) {
      state.fileUrl = null;
    },
  },
});

export const { setImageUrl, clearImage } = imageSlice.actions;

// ← This default export is required for `import imageReducer from './slices/imageSlice'`
export default imageSlice.reducer;
