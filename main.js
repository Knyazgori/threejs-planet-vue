import gsap from "gsap";
import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// create a sphere
const loader = new THREE.TextureLoader();
const texture1 = loader.load("./land_details_2.jpg");
const texture2 = loader.load("./water.png");

const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.MeshBasicMaterial({
    alphaMap: texture1,
    transparent: true,
  })
);
scene.add(sphere1);

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(4.97, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture2: {
        value: texture2,
      },
    },
  })
);
scene.add(sphere2);

// create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);

atmosphere.scale.set(1.1, 1.1, 1.1);

scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere1);
group.add(sphere2);

scene.add(group);

camera.position.z = 15;


function createPoint(lat, lng) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.05, 0.6),
    new THREE.MeshBasicMaterial({
      color: "#025EA1",
    })
  );

  const latitude = (lat / 180) * Math.PI;
  const longitude = (lng / 180) * Math.PI;
  const radius = 5;

  const x = radius * Math.cos(latitude) * Math.sin(longitude);
  const y = radius * Math.sin(latitude);
  const z = radius * Math.cos(latitude) * Math.cos(longitude);

  box.position.x = x;
  box.position.y = y;
  box.position.z = z;

  box.lookAt(0, 0, 0)
  box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.2))

  group.add(box);

  gsap.to(box.scale, {
    z: 0.2, 
    duration: 5,
    yoyo: true,
    repeat: -1,
    ease: 'linear',
    delay: Math.random()
  })
}

createPoint(59.751917, 30.579828)
createPoint(60, 31)
createPoint(61.813052, 34.315870)
createPoint(47.513422, 42.212227)

sphere1.rotation.y = -Math.PI / 2;
sphere2.rotation.y = -Math.PI / 2;

const mouse = {
  x: undefined,
  y: undefined,
};

const raycaster = new THREE.Raycaster()
console.log(group.children)

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // sphere1.rotation.y += 0.0008;
  // sphere2.rotation.y += 0.0008;
  // sphere1.rotation.x += 0.0004;
  // sphere2.rotation.x += 0.0004;
  if (mouse.x) {
    gsap.to(group.rotation, {
      x: -mouse.y * 0.06,
      y: mouse.x * 0.04,
      duration: 2,
    });
  }

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(group.children)
  for (let i = 0; i < intersects.length; i++) {
    // console.log('go')
  }

  renderer.render(scene, camera)
}
animate();

addEventListener("mousemove", (event) => {
  // mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.x = ((event.clientX - innerWidth / 2) / innerWidth) * 2 - 1
  console.log(mouse.x)
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
