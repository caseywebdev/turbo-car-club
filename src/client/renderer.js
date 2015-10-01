import THREE from 'three';

const RENDERER = new THREE.WebGLRenderer();
RENDERER.setSize(window.innerWidth, window.innerHeight);
RENDERER.shadowMap.enabled = true;
RENDERER.shadowMap.cullFace = THREE.CullFaceBack;
RENDERER.shadowMap.type = THREE.PCFSoftShadowMap;
RENDERER.domElement.style.display = 'block';

window.addEventListener('resize', () =>
  RENDERER.setSize(window.innerWidth, window.innerHeight)
);

export default RENDERER;
