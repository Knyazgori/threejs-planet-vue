import * as THREE from "three";
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'
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
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// create a sphere
const loader = new THREE.TextureLoader()
const texture1 = loader.load('./land_details_2.jpg')
const texture2 = loader.load('./water.png')

// const sphere1 = new THREE.Mesh(
//   new THREE.SphereGeometry(5, 50, 50),
//   new THREE.ShaderMaterial({
//     vertexShader,
//     fragmentShader,  
//     uniforms: {
//       globeTexture1: {
        
//         value: texture1,
//       }
//     }  
//   })
// );
// scene.add(sphere1);


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
    }  
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
    side: THREE.BackSide
  })
)

atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(atmosphere)
camera.position.z = 15

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere1.rotation.y += 0.0008
  sphere2.rotation.y += 0.0008
}
animate();
