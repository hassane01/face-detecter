import * as faceapi from "face-api.js";

export function getDominantEmotion(
  expressions: faceapi.FaceExpressions
): string {
  return Object.entries(expressions).reduce((prev, curr) =>
    curr[1] > prev[1] ? curr : prev
  )[0];
}

type AnnotatedDetection = faceapi.WithFaceExpressions<
  faceapi.WithAge<
    faceapi.WithGender<
      faceapi.WithFaceLandmarks<{
        detection: faceapi.FaceDetection;
      }, faceapi.FaceLandmarks68>
    >
  >
>;


export function drawDetectionsWithLabels(
  source: HTMLVideoElement | HTMLImageElement,
  canvas: HTMLCanvasElement,
  detections: AnnotatedDetection[]
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const displaySize = {
    width: source.clientWidth,
    height: source.clientHeight,
  };

  faceapi.matchDimensions(canvas, displaySize);
  const resizedDetections = faceapi.resizeResults(detections, displaySize);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  faceapi.draw.drawDetections(canvas, resizedDetections);
  // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // Uncomment if .withFaceLandmarks() used

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
