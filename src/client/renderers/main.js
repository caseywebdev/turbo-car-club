import THREE from 'three';

const RENDERER = new THREE.WebGLRenderer();
RENDERER.shadowMap.enabled = true;
RENDERER.shadowMap.cullFace = THREE.CullFaceBack;
RENDERER.shadowMap.type = THREE.PCFSoftShadowMap;
RENDERER.domElement.style.display = 'block';

const handleResize = () =>
  RENDERER.setSize(window.innerWidth, window.innerHeight);

handleResize();
window.addEventListener('resize', handleResize);

export default RENDERER;
