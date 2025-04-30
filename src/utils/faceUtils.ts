import * as faceapi from "face-api.js";

/**
 * Given an object of expression scores, returns the emotion key with highest score.
 */
export function getDominantEmotion(expressions: faceapi.FaceExpressions): string {
  return Object.entries(expressions).reduce(
    (prev, curr) => (curr[1] > prev[1] ? curr : prev)
  )[0];
}

/**
 * Clears the canvas, draws bounding boxes and face labels (age, gender, emotion).
 */
export function drawDetectionsWithLabels(
  source: HTMLVideoElement | HTMLImageElement,
  canvas: HTMLCanvasElement,
  detections: faceapi.WithFaceExpressions<
    faceapi.WithAgeAndGender<faceapi.FaceDetection>
  >[]
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Match canvas size to displayed video/image
  const displaySize = {
    width: source.clientWidth,
    height: source.clientHeight,
  };

  faceapi.matchDimensions(canvas, displaySize);
  const resizedDetections = faceapi.resizeResults(detections, displaySize);

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw detection boxes and landmarks
  faceapi.draw.drawDetections(canvas, resizedDetections);
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

  // Draw labels (age, gender, emotion)
  resizedDetections.forEach((d) => {
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
