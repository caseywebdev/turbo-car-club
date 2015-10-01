import THREE from 'three';

const CAMERA = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
CAMERA.aspect = window.innerWidth / window.innerHeight;
CAMERA.updateProjectionMatrix();

window.addEventListener('resize', () => {
  CAMERA.aspect = window.innerWidth / window.innerHeight;
  CAMERA.updateProjectionMatrix();
});

export default CAMERA;
