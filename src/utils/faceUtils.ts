import * as faceapi from "face-api.js";

/**
 * Given an object of expression scores, returns the emotion key with highest score.
 */
export function getDominantEmotion(
  expressions: faceapi.FaceExpressions
): string {
  return Object.entries(expressions).reduce((prev, curr) =>
    curr[1] > prev[1] ? curr : prev
  )[0];
}

/**
 * Full detection type for video (with landmarks, age, gender, expressions).
 */
export type AnnotatedDetection = faceapi.WithFaceExpressions<
  faceapi.WithAge<
    faceapi.WithGender<
      faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>
    >
  >
>;

/**
 * Simplified detection type for images (age, gender, expressions only).
 */
export type SimpleDetection = faceapi.WithFaceExpressions<
  faceapi.WithAge<
    faceapi.WithGender<{ detection: faceapi.FaceDetection }>
  >
>;

/**
 * Draws boxes, landmarks, and labels (age, gender, emotion) on a canvas over a video or image.
 * Expects detections that include landmarks.
 */
export function drawDetectionsWithLabels(
  source: HTMLVideoElement | HTMLImageElement,
  canvas: HTMLCanvasElement,
  detections: AnnotatedDetection[]
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const displaySize = { width: source.clientWidth, height: source.clientHeight };
  faceapi.matchDimensions(canvas, displaySize);
  const resized = faceapi.resizeResults(detections, displaySize);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  faceapi.draw.drawDetections(canvas, resized);
  faceapi.draw.drawFaceLandmarks(canvas, resized);

  resized.forEach((d) => {
    // Now that we have landmarks, the box lives under d.alignedRect.box
    const { x, y } = d.alignedRect.box;
    const age = Math.round(d.age);
    const gender = d.gender;
    const emotion = getDominantEmotion(d.expressions);

    const label = `${age} yrs, ${gender}, ${emotion}`;
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "red";
    ctx.fillText(label, x, y - 8);
  });
}

/**
 * Draws boxes and labels (age, gender, emotion) on a canvas overlaid on an image.
 * Expects detections without landmarks.
 */
export function drawSimpleDetectionsWithLabels(
  source: HTMLVideoElement | HTMLImageElement,
  canvas: HTMLCanvasElement,
  detections: SimpleDetection[]
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const displaySize = { width: source.clientWidth, height: source.clientHeight };
  faceapi.matchDimensions(canvas, displaySize);
  const resized = faceapi.resizeResults(detections, displaySize);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  faceapi.draw.drawDetections(canvas, resized);

  resized.forEach((d) => {
    const { x, y } = d.detection.box;
    const age = Math.round(d.age);
    const gender = d.gender;
    const emotion = getDominantEmotion(d.expressions);

    const label = `${age} yrs, ${gender}, ${emotion}`;
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "red";
    ctx.fillText(label, x, y - 8);
  });
}
