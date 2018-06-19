// Web Audio API Setup Start Here
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const size = 2048;

// Create Vocal Analyser
const vocalAnalyser = audioCtx.createAnalyser();
vocalAnalyser.fftSize = size;
const vocalBufferLength = vocalAnalyser.frequencyBinCount;
console.log(`Vocal Buffer Length is ${vocalBufferLength}`);
const vocalDataArray = new Float32Array(vocalBufferLength);

// Create Syth Analyser
const sythAnalyser = audioCtx.createAnalyser();
sythAnalyser.fftSize = size;
const sythBufferLength = sythAnalyser.frequencyBinCount;
console.log(`Syth Buffer Length is ${sythBufferLength}`);
const sythDataArray = new Float32Array(sythBufferLength);

// Create Drum Analyser
const drumAnalyser = audioCtx.createAnalyser();
drumAnalyser.fftSize = size;
const drumBufferLength = drumAnalyser.frequencyBinCount;
console.log(`Drum Buffer Length is ${drumBufferLength}`);
const drumDataArray = new Float32Array(drumBufferLength);

// Create Bass Analyser
const bassAnalyser = audioCtx.createAnalyser();
bassAnalyser.fftSize = size;
const bassBufferLength = bassAnalyser.frequencyBinCount;
console.log(`Bass Buffer Length is ${bassBufferLength}`);
const bassDataArray = new Float32Array(bassBufferLength);

// Create Audio Element
const vocal = new Audio("./audio/vocal.mp3");
const syth = new Audio("./audio/syth.mp3");
const drum = new Audio("./audio/drum.mp3");
const bass = new Audio("./audio/bass.mp3");

// Create Audio Nodes
const vocalSource = audioCtx.createMediaElementSource(vocal);
const sythSource = audioCtx.createMediaElementSource(syth);
const drumSource = audioCtx.createMediaElementSource(drum);
const bassSource = audioCtx.createMediaElementSource(bass);

// Connect Audio Nodes to Analysers
vocalSource.connect(vocalAnalyser);
sythSource.connect(sythAnalyser);
drumSource.connect(drumAnalyser);
bassSource.connect(bassAnalyser);

// Connect Analusers to Audio Context Destination
vocalAnalyser.connect(audioCtx.destination);
sythAnalyser.connect(audioCtx.destination);
drumAnalyser.connect(audioCtx.destination);
bassAnalyser.connect(audioCtx.destination);

// Define Audio Play Toggle Function
let isPlaying = false;
const playToggle = () => {
  if (!isPlaying) {
    vocal.play();
    syth.play();
    drum.play();
    bass.play();
    isPlaying = true;
  } else {
    vocal.pause();
    syth.pause();
    drum.pause();
    bass.pause();
    isPlaying = false;
  }
};

// Web Audio API Setup Finish

// Three.js Setup Start Here

// Canvas Setup
const canvas = document.querySelector("canvas");
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0xffffff);
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
const material = new THREE.MeshLambertMaterial({ color: 0xcccc99 });

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

// Three.js Setup Finish

// Animation Start
const arr = [];
// Render Loop
const render = () => {
  requestAnimationFrame(render);
  // Get Aduio Data from Audio Analysers
  vocalAnalyser.getFloatFrequencyData(vocalDataArray);
  sythAnalyser.getFloatFrequencyData(sythDataArray);
  drumAnalyser.getFloatFrequencyData(drumDataArray);
  bassAnalyser.getFloatFrequencyData(bassDataArray);

  // Animations

  //////////////////////////////////////////////////////////////////////////////
  // Vocal: 3D Box is correlated to the vocal track                           //
  //        3D Box by default will rotate slowly                              //
  //        when vocal is deteced, the color of material will change randomly //
  //        the rotation speed will increase                                  //
  //////////////////////////////////////////////////////////////////////////////
  const vocalThreshold = 100;
  let vocal = Math.floor(vocalDataArray[256] + vocalThreshold);
  //console.log(`Vocal: ${vocal}`);
  if (vocal > 20) {
    rotationXY(mesh, 0.01);
    mesh.material.color.r = Math.random() * 2;
    mesh.material.color.g = Math.random() * 2;
    mesh.material.color.b = Math.random() * 2;
  }
  rotationXY(mesh, 0.001);

  //////////////////////////////////////////////////////////////////////////////
  // Syth:  Sphere is correlated to the syth track                            //
  //        when syth1 and syth2 are detected                                 //
  //        Sphere will scale X-axis to 1.5 times bigger                      //
  //        rotation will also be activated                                   //
  //////////////////////////////////////////////////////////////////////////////
  let sythThreshold = 48;
  let syth = Math.floor(sythDataArray[8] + sythThreshold);
  let syth2 = Math.floor(sythDataArray[90] + 2 * sythThreshold);
  //console.log(`Syth: ${syth}`);
  //console.log(`Syth2: ${syth2}`);
  if (syth > 0 || syth2 > 15) {
    scaleXYZ(sphere, 1.5, 1, 1);
    rotationXY(sphere, 0.03);
  } else {
    sphere.scale.set(1, 1, 1);
  }

  //////////////////////////////////////////////////////////////////////////////
  // Drum:  Cone is correlated to the drum track                              //
  //        when bassdrum is detected                                         //
  //        Cone will rotate with the bass drum                               //
  //////////////////////////////////////////////////////////////////////////////
  let drumThreshold = 50;
  let bassDrum = Math.floor(drumDataArray[4]) + drumThreshold;
  //console.log(`Bass Drum: ${bassDrum}`);
  if (bassDrum > 0) {
    rotationXY(cone, 0.01);
  }

  //////////////////////////////////////////////////////////////////////////////
  // Bass:  Cylinder is correlated to the bass track                          //
  //        when bass is detected                                             //
  //        Cylinder will rotate with the bass drum                           //
  //////////////////////////////////////////////////////////////////////////////
  let bassThreshold = 50;
  let bass = Math.floor(bassDataArray[4]) + bassThreshold;
  //console.log(`Bass: ${bass}`);
  if (bass > 0) {
    rotationXY(cylinder, 0.01);
  }

  // Render Scene & Camera
  renderer.render(scene, camera);
};

// Rotation Animation Function
const rotationXY = (object, speed) => {
  object.rotation.x += speed;
  object.rotation.y += speed;
};

const scaleXYZ = (object, xSize, ySize, zSize) => {
  object.scale.x = xSize;
  object.scale.y = ySize;
  object.scale.z = zSize;
};

render();
playToggle();
