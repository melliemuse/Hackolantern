import * as firebase from 'firebase/app';
import 'firebase/storage';

const $video = document.querySelector('#video');
const $canvas = document.querySelector('#canvas');
const storageRef = firebase.storage().ref('images');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    $video.srcObject = stream;
  });

export const takePhoto = () => {
  $video.play();
  $canvas.width = $video.clientWidth;
  $canvas.height = $video.clientHeight;

  const context = $canvas.getContext('2d');
  context.drawImage($video, 0, 0, $video.clientWidth, $video.clientHeight);

  const dataUrl = $canvas.toDataURL('image/png');

  // This is v cool
  return fetch(dataUrl)
    .then(response => response.blob())
    .then(blob => {
      const childRef = storageRef.child(`${Date.now()}`);
      return childRef.put(blob)
    })
    .then(() => console.log('image added'))
    .then(() => $video.pause());
};