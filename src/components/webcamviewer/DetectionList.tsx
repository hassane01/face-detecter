import type {
  WithAge,
  WithGender,
  WithFaceExpressions,
  FaceDetection,
} from "face-api.js";

type Detection = WithFaceExpressions<
  WithAge<WithGender<{ detection: FaceDetection }>>
>;

interface DetectionListProps {
  detections: Detection[];
}

export function DetectionList({ detections }: DetectionListProps) {
  return (
    <div className="max-w-md mx-auto bg-gray-100 p-4 rounded-lg shadow-lg mt-6">
      <h3 className="text-lg font-semibold mb-3">Detected Faces</h3>
      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {detections.map((d, i) => {
          const maxEmotion = Object.entries(d.expressions).reduce((p, c) =>
            c[1] > p[1] ? c : p
          )[0];
          return (
            <li key={i} className="text-sm text-gray-800">
              <span className="font-medium">Face {i + 1}:</span>{" "}
              {`Age: ${Math.round(d.age)} yrs, Gender: ${
                d.gender
              }, Emotion: ${maxEmotion}`}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
