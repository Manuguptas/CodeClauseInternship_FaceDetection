// ==========================-:first:-============================
// document.addEventListener('DOMContentLoaded', async () => {
//     const imageInput = document.getElementById('imageInput');
//     const canvas = document.getElementById('canvas');
//     const displaySize = { width: 400, height: 300 };
//     faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//     faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//     faceapi.nets.faceRecognitionNet.loadFromUri('/models');

//     imageInput.addEventListener('change', async () => {
//         const image = await faceapi.bufferToImage(imageInput.files[0]);
//         canvas.width = displaySize.width;
//         canvas.height = displaySize.height;

//         const context = canvas.getContext('2d');
//         context.clearRect(0, 0, canvas.width, canvas.height);
//         context.drawImage(image, 0, 0, canvas.width, canvas.height);

//         const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);

//         resizedDetections.forEach(detection => {
//             const box = detection.detection.box;
//             const drawBox = new faceapi.draw.DrawBox(box, { label: 'Face' });
//             drawBox.draw(canvas);
//         });
//     });
// });



// ==================================-:second:-=======================================
const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  faceapi.matchDimensions(canvas, { height: video.height, width: video.width });

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    const resizedDetections = faceapi.resizeResults(detections, {
      height: video.height,
      width: video.width,
    });
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    console.log(detections);
  }, 100);
  
});