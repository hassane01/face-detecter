import React, { useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { WebcamViewer } from './components/WebcamViewer';

function App() {

  useEffect(() => {
  console.log('Before loading:', faceapi.nets.tinyFaceDetector.isLoaded);
  faceapi.nets.tinyFaceDetector
    .loadFromUri('/models')
    .then(() => console.log('After loading:', faceapi.nets.tinyFaceDetector.isLoaded));
}, []);

  useEffect(() => {
    // Check if any net is loaded yet
    console.log('TinyFaceDetector loaded?', faceapi.nets.tinyFaceDetector.isLoaded);
    // After we load it below, it should turn true
    faceapi.nets.tinyFaceDetector
      .loadFromUri('/models')
      .then(() => {
        console.log('After loading → TinyFaceDetector loaded?', faceapi.nets.tinyFaceDetector.isLoaded);
      })
      .catch(console.error);
  }, []);

  return <div className='p-4'>
    <WebcamViewer/>
  </div>;
}

export default App;
