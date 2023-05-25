import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import TWEEN from '@tweenjs/tween.js';

const info_1 = document.querySelector('#info-1')!;
const info_2 = document.querySelector('#info-2')!;
const info_1Button = info_1.querySelector('button')!;
const info_2Button = info_2.querySelector('button')!;
gsap.set(info_2, { xPercent: 100 });

let dimensions = getDimesions();
let room1: THREE.Group;
let room2: THREE.Group;

let rottationSpeed1 = 0.003;
let rottationSpeed2 = 0.003;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  dimensions.width / dimensions.height,
  0.1,
  1000
);
camera.position.set(12.12, 9.31, -2.95);
camera.lookAt(0, 0, 0);

const canvas = document.querySelector('#canvas')!;
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.useLegacyLights = false;
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(dimensions.width, dimensions.height);
render;

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  'assets/models/room1.glb',
  gltf => {
    gltf.scene.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.receiveShadow = true;
        m.castShadow = true;
      }

      if ((child as THREE.Light).isLight) {
        const l = child as THREE.Light;

        l.intensity = 200;

        l.castShadow = true;
        l.shadow.bias = -0.001;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });
    room1 = gltf.scene;
    scene.add(room1);
  },
  xhr => {},
  error => {
    console.log(error);
  }
);

gltfLoader.load(
  'assets/models/room2.glb',
  gltf => {
    gltf.scene.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.receiveShadow = true;
        m.castShadow = true;
      }

      if ((child as THREE.Light).isLight) {
        const l = child as THREE.Light;

        l.intensity = 200;

        l.castShadow = true;
        l.shadow.bias = -0.001;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });
    room2 = gltf.scene;
    room2.scale.set(4, 4, 4);
    room2.rotation.set(0, -10, 0);
    room2.position.y = 20;
    scene.add(room2);
  },
  xhr => {},
  error => {
    console.log(error);
  }
);

function animate() {
  requestAnimationFrame(animate);

  TWEEN.update();

  if (room1) {
    room1.rotateY(rottationSpeed1);
    if (room1.rotation.y > 0.6 || room1.rotation.y < -1.5) {
      rottationSpeed1 *= -1;
    }
  }

  if (room2) {
    room2.rotateY(rottationSpeed2);
    if (room2.rotation.y > 1.3 || room2.rotation.y < -0.4) {
      rottationSpeed2 *= -1;
    }
  }

  render();
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  dimensions = getDimesions();
  camera.aspect = dimensions.width / dimensions.height;
  camera.updateProjectionMatrix();
  renderer.setSize(dimensions.width, dimensions.height);
  render();
}

function getDimesions() {
  const style = getComputedStyle(document.documentElement);
  const width = parseInt(style.getPropertyValue('--width'));
  const height = parseInt(style.getPropertyValue('--height'));
  return { width, height };
}

function switchToInfo2() {
  gsap.to(info_1, { xPercent: 100, duration: 0.5 });
  gsap.to(info_2, { xPercent: 0, yPercent: 0, duration: 0.5, delay: 0.5 });

  const tween1 = new TWEEN.Tween(room2.position)
    .to(
      {
        y: 0,
      },
      500
    )
    .easing(TWEEN.Easing.Back.Out);

  const tween2 = new TWEEN.Tween(room1.position)
    .to(
      {
        y: 20,
      },
      500
    )
    .easing(TWEEN.Easing.Back.In);

  tween2.chain(tween1);
  tween2.start();
}

function switchToInfo1() {
  gsap.to(info_2, { xPercent: 100, duration: 0.5 });
  gsap.to(info_1, { xPercent: 0, yPercent: 0, duration: 0.5, delay: 0.5 });

  const tween1 = new TWEEN.Tween(room1.position)
    .to(
      {
        y: 0,
      },
      500
    )
    .easing(TWEEN.Easing.Back.Out);

  const tween2 = new TWEEN.Tween(room2.position)
    .to(
      {
        y: 20,
      },
      500
    )
    .easing(TWEEN.Easing.Back.In);

  tween2.chain(tween1);
  tween2.start();
}

window.addEventListener('resize', onWindowResize, false);
info_1Button.addEventListener('click', switchToInfo2);
info_2Button.addEventListener('click', switchToInfo1);

animate();
