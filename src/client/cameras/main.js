import THREE from 'three';

const CAMERA = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

const update = () => {
  CAMERA.aspect = window.innerWidth / window.innerHeight;
  CAMERA.updateProjectionMatrix();
};

window.addEventListener('resize', update);

export default CAMERA;
