// Web Audio API Setup
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
// Create analyser node
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);
const dataArray = new Float32Array(bufferLength);

// Create Audio Element
const vocal = new Audio("./audio/vocal.mp3");
const syth = new Audio("./audio/syth.mp3");
const drum = new Audio("./audio/drum.mp3");
const bass = new Audio("./audio/bass.mp3");

// Canvas Setup
const canvas = document.querySelector("canvas");
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x00ff00);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasWidth, canvasHeight);

// Camera Setup
const camera = new THREE.PerspectiveCamera(
  35, // Filed of View: the extent of the scene that is seen on the display at any given moment
  canvasWidth / canvasHeight, // Aspect Ratio: usually element width / height
  // Render Range
  0.1, // Near
  3000 // Far
);

// Scene Setup
const scene = new THREE.Scene();

// Lights Setup
const ambLight = new THREE.AmbientLight(0xfffff, 0.5);
scene.add(ambLight);
const pointLight = new THREE.PointLight(0xfffff, 0.5);
scene.add(pointLight);

// Create Elements

//Define Material
const material = new THREE.MeshLambertMaterial({ color: 0xf3ffe2 });

// Create Box Object
const geometry = new THREE.BoxGeometry(10, 10, 10);
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(-28, 0, -60);
scene.add(mesh);

// Create Circle Object
const geometry1 = new THREE.SphereGeometry(5, 32, 32);
const sphere = new THREE.Mesh(geometry1, material);
sphere.position.set(-10, 0, -60);
scene.add(sphere);

// Create Cone Object
const geometry2 = new THREE.ConeGeometry(5, 20, 32);
const cone = new THREE.Mesh(geometry2, material);
cone.position.set(5, 0, -60);
scene.add(cone);

// Create Cylinder Object
const geometry3 = new THREE.CylinderGeometry(5, 5, 20, 32);
const cylinder = new THREE.Mesh(geometry3, material);
cylinder.position.set(25, 0, -60);
scene.add(cylinder);

// Render Loop
const render = () => {
  requestAnimationFrame(render);
  rotationXY(mesh, 0.01);
  rotationXY(sphere, 0.01);
  rotationXY(cone, 0.01);
  rotationXY(cylinder, 0.01);
  renderer.render(scene, camera);
};

const rotationXY = (object, speed) => {
  object.rotation.x += speed;
  object.rotation.y += speed;
};

render();
